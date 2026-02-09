import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/utils/database";
import Event from "@/models/event";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();
  const body = await req.json();

  const start = new Date(body.start);
  const end = new Date(body.end);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const durationMs = Math.max(0, end.getTime() - start.getTime());
  if (durationMs <= 0) {
    return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
  }

  const businessStartHour = 9;
  const businessEndHour = 18;
  const longDuration = durationMs > 8 * 60 * 60 * 1000;

  const events = await Event.find({ userId, end: { $gte: start } })
    .sort({ start: 1 })
    .lean();
  const msPerDay = 24 * 60 * 60 * 1000;

  const getBusinessStart = (date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(businessStartHour, 0, 0, 0);
    return startOfDay;
  };

  const getBusinessEnd = (date) => {
    const endOfDay = new Date(date);
    endOfDay.setHours(businessEndHour, 0, 0, 0);
    return endOfDay;
  };

  const normalizeCursor = (date) => {
    let cursor = new Date(date);
    while (true) {
      const windowStart = getBusinessStart(cursor);
      const windowEnd = getBusinessEnd(cursor);

      if (longDuration) {
        if (cursor <= windowStart) {
          return windowStart;
        }

        cursor = new Date(windowStart.getTime() + msPerDay);
        continue;
      }

      if (cursor < windowStart) {
        return windowStart;
      }

      if (cursor >= windowEnd) {
        cursor = new Date(windowStart.getTime() + msPerDay);
        continue;
      }

      return cursor;
    }
  };

  const suggestions = [];
  let cursor = normalizeCursor(start);

  for (const event of events) {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    if (eventStart > cursor) {
      while (suggestions.length < 3) {
        cursor = normalizeCursor(cursor);
        const windowEnd = getBusinessEnd(cursor);
        const slotEnd = new Date(cursor.getTime() + durationMs);

        if (!longDuration && slotEnd > windowEnd) {
          cursor = new Date(windowEnd);
          continue;
        }

        if (slotEnd > eventStart) {
          break;
        }

        suggestions.push({
          start: new Date(cursor).toISOString(),
          end: slotEnd.toISOString(),
        });

        cursor = new Date(slotEnd);
      }
    }

    if (eventEnd > cursor) {
      cursor = normalizeCursor(eventEnd);
    }

    if (suggestions.length >= 3) {
      break;
    }
  }

  while (suggestions.length < 3) {
    cursor = normalizeCursor(cursor);
    const windowEnd = getBusinessEnd(cursor);
    const slotStart = new Date(cursor);
    const slotEnd = new Date(cursor.getTime() + durationMs);

    if (!longDuration && slotEnd > windowEnd) {
      cursor = new Date(windowEnd);
      continue;
    }

    suggestions.push({
      start: slotStart.toISOString(),
      end: slotEnd.toISOString(),
    });
    cursor = new Date(slotEnd);
  }

  return NextResponse.json({ suggestions });
}
