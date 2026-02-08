import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/utils/database";
import Event from "@/models/event";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const updated = await Event.findOneAndUpdate(
    { _id: id, userId },
    update,
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_, { params }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();
  const { id } = await params; 
  const deleted = await Event.findOneAndDelete({ _id: id, userId });

  if (!deleted) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function GET(_, { params }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();
  const { id } = await params; 
  const event = await Event.findOne({ _id: id, userId });

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