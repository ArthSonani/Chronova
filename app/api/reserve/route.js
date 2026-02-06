import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Event from "@/models/event";

export async function POST(req) {
  await connectToDB();
  const body = await req.json();

  const start = new Date(body.start);
  const end = new Date(body.end);

  if (!body.title || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const conflict = await Event.findOne({
    start: { $lt: end },
    end: { $gt: start },
  }).lean();

  if (conflict) {
    return NextResponse.json({ error: "already occupied" }, { status: 409 });
  }

  const event = await Event.create({
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
