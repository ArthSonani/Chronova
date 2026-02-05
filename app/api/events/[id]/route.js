import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Event from "@/models/event";

export async function PUT(req, { params }) {
  await connectToDB();
  const body = await req.json();

  const { id } = await params;
  const update = {
    start: new Date(body.start),
    end: new Date(body.end),
  };

  if (typeof body.title === "string") {
    update.title = body.title;
  }

  const updated = await Event.findByIdAndUpdate(
    id,
    update,
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(_, { params }) {
  
  await connectToDB();
  const { id } = await params; 
  await Event.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

export async function GET(_, { params }) {
  await connectToDB();
  const { id } = await params; 
  const event = await Event.findById(id);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: event._id.toString(),
    title: event.title,
    start: event.start,
    end: event.end,
  });
}