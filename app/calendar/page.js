"use client";
import CalendarView from "@/components/CalendarView";
import TimetableUpload from "@/components/TimetableUpload";
import { generateRecurringEvents } from "@/utils/generateRecurringEvents";

export default function CalendarPage() {
  const handleGenerated = async (slots, weeks) => {
    const events = generateRecurringEvents(slots, weeks);

    for (const event of events) {
      await fetch("/api/events", {
        method: "POST",
        body: JSON.stringify(event),
      });
    }
  };

  return (
    <>
      <div className="px-4  sm:px-6 lg:px-20">
        <CalendarView />
      </div>
      <TimetableUpload onGenerated={handleGenerated} />
    </>
  );
}
