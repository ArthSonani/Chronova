import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/utils/database";
import Event from "@/models/event";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(startOfDay.getDate() + 1);

  const events = await Event.find({
    userId,
    start: { $lt: endOfDay },
    end: { $gte: startOfDay },
  }).sort({ start: 1 });

  return NextResponse.json(
    events.map((e) => ({
      title: e.title,
      start: e.start,
      end: e.end,
    }))
  );
}
