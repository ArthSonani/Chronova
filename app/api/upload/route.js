import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Event from "@/models/event";
import { generateRecurringEvents } from "@utils/generateRecurringEvents.js";
import { parseDateTime } from "@/utils/timezone";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const PROMPT = `
Extract college timetable slots from the image.

Rules:
- Identify classes/labs only
- Ignore breaks & empty cells
- Use 24-hour format

Output ONLY valid JSON array:
[
  {
    "title": "Subject",
    "day": "Monday",
    "start": "09:00",
    "end": "10:00",
  },
  ...
]
`;

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const file = formData.get("file");
    const date = formData.get("date");
    const weeks = formData.get("weeks");
    const timezoneOffset = formData.get("timezoneOffset");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to base64 for Gemini
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      PROMPT,
      {
        inlineData: {
          data: base64Image,
          mimeType: file.type,
        },
      },
    ]);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    let rawEvents;
    try {
        rawEvents = JSON.parse(cleanJson);
    } catch (err) {
        return NextResponse.json({ error: "Invalid timetable text: cannot parse JSON" }, { status: 500 });
    }
    
    const parsedStart = parseDateTime(date, timezoneOffset);
    if (!parsedStart || Number.isNaN(parsedStart.getTime())) {
      return NextResponse.json({ error: "Invalid start date" }, { status: 400 });
    }

    const response = generateRecurringEvents(
      rawEvents,
      parsedStart,
      Number(weeks),
      timezoneOffset
    ).map(
      (event) => ({
        ...event,
        userId,
      })
    );

    await Event.insertMany(response);
    
    return NextResponse.json({
        message: `${response.length} Events are created successfully`,
    });

  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json({ error: "Failed to parse timetable" }, { status: 500 });
  }
}