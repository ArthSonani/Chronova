import {
  addLocalMinutes,
  getLocalDayIndex,
  parseDateTime,
  startOfLocalDayUtc,
} from "./timezone";

export function generateRecurringVoiceEvents(
  rawEvents,
  referenceDate,
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

  const parsedReference = parseDateTime(referenceDate, timezoneOffsetMinutes);
  const baseDate = startOfLocalDayUtc(
    parsedReference,
    timezoneOffsetMinutes
  );

  const result = [];

  rawEvents.forEach(ev => {
    let firstEventDate;

    /**
     * 1️⃣ If explicit date exists → trust it
     * (voice command like "tomorrow", "on 5th September")
     */
    if (ev.date) {
      const parsedDate = parseDateTime(ev.date, timezoneOffsetMinutes);
      firstEventDate = startOfLocalDayUtc(parsedDate, timezoneOffsetMinutes);
    }

    /**
     * 2️⃣ Otherwise derive date from day + today
     */
    else if (ev.day) {
      const targetDay = DAY_INDEX[ev.day];
      const baseDay = getLocalDayIndex(baseDate, timezoneOffsetMinutes);

      let diff = targetDay - baseDay;
      if (diff < 0) diff += 7; // move forward only

      firstEventDate = new Date(baseDate.getTime() + diff * 86400000);
    }

    if (!firstEventDate) return;

    const [sh, sm] = ev.start.split(":").map(Number);
    const [eh, em] = ev.end.split(":").map(Number);

    /**
     * 3️⃣ Generate recurring weekly events
     */
    for (let w = 0; w < weeks; w++) {
      const eventDate = new Date(firstEventDate.getTime() + w * 7 * 86400000);

      const start = addLocalMinutes(eventDate, sh * 60 + sm);
      const end = addLocalMinutes(eventDate, eh * 60 + em);

      result.push({
        title: ev.title || "Class",
        start,
        end,
      });
    }
  });

  console.log("Generated Events:", result);
  
  return result;
}
