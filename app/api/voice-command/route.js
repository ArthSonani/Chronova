import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import Event from "@/models/event";
import { generateRecurringVoiceEvents } from "@utils/generateRecurringVoiceEvents.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const PROMPT = `
You are an assistant that converts natural language voice commands
into structured events.

Input:
- A spoken command converted to text by speech recognition.
- Todays date is ${new Date().toDateString()}. (important for understanding "today", "tomorrow", "next Monday", etc.)

Your task:
- Understand the user's intent to reserve time slots
- Identify day(s), start time, end time, subject/title
- Identify recurrence duration (number of weeks)

Rules:
- Use 24-hour time format (HH:MM)
- If duration is missing, assume 1 hour
- If weeks are not mentioned, assume it is a one-time event
- If end time is not mentioned, calculate it from duration
- If subject is not mentioned, use "Class"
- Normalize days to full names (Monday, Tuesday, etc.)
- By Using current day and date Identify correct exact targeted day even if user says "Today", "tomorrow", "next Monday", "5th December", "10th October" or "this Friday"
- If multiple days are mentioned, create multiple events
- Do NOT invent data that is not implied
- Output ONLY valid JSON (no text, no explanation)

Output format:
{
  "weeks": 12,
  "events": [
    {
      "title": "DBMS Lab",
      "day": "Monday",
      "date": "2024-09-02", // can be derived from day + today's date or if user says "on 5th September"
      "start": "10:00",
      "end": "12:00"
    }
  ]
}
`;


export async function POST(req) {
  try {
    const { command } = await req.json();

    if (!command) {
      return NextResponse.json({ error: "No command provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent({
        contents: [
            {
            role: "user",
            parts: [
                { text: PROMPT },
                { text: `User command: "${command}"` }
            ]
            }
        ]
    });
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json|```/g, "").trim();

    let rawEvents;
    try {
        rawEvents = JSON.parse(cleanJson);
    } catch (err) {
        return NextResponse.json({ error: "Invalid timetable text: cannot parse JSON" }, { status: 500 });
    }
    const date = new Date();

    console.log("Parsed Command JSON:", rawEvents);
    
    const response = generateRecurringVoiceEvents(rawEvents.events, date, Number(rawEvents.weeks));

    await Event.insertMany(response);
    
    return NextResponse.json({
        message: `${response.length} Events are created successfully`,
    });

  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json({ error: "Failed to parse timetable" }, { status: 500 });
  }
}