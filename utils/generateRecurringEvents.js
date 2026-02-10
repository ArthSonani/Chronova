import {
  addLocalMinutes,
  getLocalDayIndex,
  parseDateTime,
  startOfLocalDayUtc,
} from "./timezone";

export function generateRecurringEvents(
  rawEvents,
  startDate,
  weeks = 1,
  timezoneOffsetMinutes
) {

  const DAY_INDEX = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const parsedStart = parseDateTime(startDate, timezoneOffsetMinutes);
  const baseDate = startOfLocalDayUtc(parsedStart, timezoneOffsetMinutes);

  const result = [];

  // 2️⃣ Convert each entry → Date-based events
  rawEvents.forEach(ev => {
    const targetDay = DAY_INDEX[ev.day];

    // ✅ Always move forward to NEXT occurrence
    const baseDay = getLocalDayIndex(baseDate, timezoneOffsetMinutes);
    let diff = (targetDay - baseDay + 7) % 7;
    if (diff === 0) diff = 7; // move to next week, not today

    const firstEventDate = new Date(baseDate.getTime() + diff * 86400000);

    const [sh, sm] = ev.start.split(":").map(Number);
    const [eh, em] = ev.end.split(":").map(Number);

    for (let w = 0; w < weeks; w++) {
      const eventDate = new Date(firstEventDate.getTime() + w * 7 * 86400000);

      const start = addLocalMinutes(eventDate, sh * 60 + sm);
      const end = addLocalMinutes(eventDate, eh * 60 + em);

      result.push({
        title: ev.title,
        start, // stored in UTC by MongoDB (correct)
        end,
      });
    }
  });

  console.log("Generated Events:", result);

  return result;
}
