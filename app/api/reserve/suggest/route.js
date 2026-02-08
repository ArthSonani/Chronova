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

  const events = await Event.find({ userId, end: { $gte: start } })
    .sort({ start: 1 })
    .lean();

  const suggestions = [];
  let cursor = new Date(start);

  for (const event of events) {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    if (eventStart > cursor) {
      const gap = eventStart.getTime() - cursor.getTime();
      if (gap >= durationMs) {
        const slotStart = new Date(cursor);
        const slotEnd = new Date(cursor.getTime() + durationMs);
        suggestions.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
        });
        break;
      }
    }

    if (eventEnd > cursor) {
      cursor = new Date(eventEnd);
    }
  }

  if (suggestions.length === 0) {
    const slotStart = new Date(cursor);
    const slotEnd = new Date(cursor.getTime() + durationMs);
    suggestions.push({
      start: slotStart.toISOString(),
      end: slotEnd.toISOString(),
    });
  }

  return NextResponse.json({ suggestions });
}
