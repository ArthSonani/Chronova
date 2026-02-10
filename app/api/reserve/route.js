import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/utils/database";
import Event from "@/models/event";
import { parseDateTime } from "@/utils/timezone";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();
  const body = await req.json();

  const start = parseDateTime(body.start, body.timezoneOffset);
  const end = parseDateTime(body.end, body.timezoneOffset);

  if (!body.title || !start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const conflict = await Event.findOne({
    userId,
    start: { $lt: end },
    end: { $gt: start },
  }).lean();

  if (conflict) {
    return NextResponse.json({ error: "already occupied" }, { status: 409 });
  }

  const event = await Event.create({
    userId,
    title: body.title,
    start,
    end,
  });

  return NextResponse.json({
    id: event._id.toString(),
    title: event.title,
    start: event.start,
    end: event.end,
  });
}
