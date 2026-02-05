import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Event from "@/models/event";

export async function PUT(req, { params }) {
  await connectToDB();
  const body = await req.json();

  const { id } = await params;
  const updated = await Event.findByIdAndUpdate(
    id,
    {
      start: new Date(body.start),
      end: new Date(body.end),
    },
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
