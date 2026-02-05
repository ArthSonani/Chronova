import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Event from "@/models/event";

export async function GET() {
  await connectToDB();
  const events = await Event.find();

  return NextResponse.json(
    events.map((e) => ({
      id: e._id.toString(),
      title: e.title,
      start: e.start,
      end: e.end,
    }))
  );
}

export async function POST(req) {
  await connectToDB();
  const body = await req.json();
  const event = await Event.create({
    title: body.title,
    start: new Date(body.start),
    end: new Date(body.end),
  });

  return NextResponse.json(event);
}
