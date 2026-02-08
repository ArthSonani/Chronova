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

  if (!body.title || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
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
