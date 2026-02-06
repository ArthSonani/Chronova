import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

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
    const formData = await req.formData();
    const file = formData.get("file");

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
    console.log("Raw response:", responseText);
    // Clean JSON string (remove potential ```json wrappers)
    const cleanJson = responseText.replace(/```json|```/g, "").trim();

    console.log("clean response:", responseText);
    
    return NextResponse.json(JSON.parse(cleanJson));
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json({ error: "Failed to parse timetable" }, { status: 500 });
  }
}