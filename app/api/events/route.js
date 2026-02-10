import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/utils/database";
import Event from "@/models/event";
import user from "@models/user";
import { parseDateTime } from "@/utils/timezone";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();
  const events = await Event.find({ userId });

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
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();
  const body = await req.json();
  const start = parseDateTime(body.start, body.timezoneOffset);
  const end = parseDateTime(body.end, body.timezoneOffset);

  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const event = await Event.create({
    userId,
    title: body.title,
    start,
    end,
  });

  return NextResponse.json(event);
}
