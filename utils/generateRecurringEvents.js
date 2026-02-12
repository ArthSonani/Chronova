import {
  addLocalMinutes,
  getLocalDayIndex,
  parseDateTime,
  startOfLocalDayUtc,
} from "./timezone";

const DAY_INDEX = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};
export function generateRecurringEvents( rawEvents, referenceDate, weeks = 1, timezoneOffsetMinutes ) { 
  
  const parsedReference = parseDateTime(referenceDate, timezoneOffsetMinutes);
  const baseDate = startOfLocalDayUtc(
    parsedReference,
    timezoneOffsetMinutes
  );

  const result = [];

  rawEvents.forEach(ev => {
    let firstEventDate;

    // 1️⃣ If explicit date exists → use it
    if (ev.date) {
      const parsedDate = parseDateTime(ev.date, timezoneOffsetMinutes);
      firstEventDate = startOfLocalDayUtc(parsedDate, timezoneOffsetMinutes);
    }

    // 2️⃣ Otherwise derive from day
    else if (ev.day) {
      const targetDay = DAY_INDEX[ev.day];
      const baseDay = getLocalDayIndex(baseDate, timezoneOffsetMinutes);

      let diff = targetDay - baseDay;
      if (diff < 0) diff += 7; // always move forward

      firstEventDate = new Date(
        baseDate.getTime() + diff * 86400000
      );
    }

    if (!firstEventDate) return;

    const [sh, sm] = ev.start.split(":").map(Number);
    const [eh, em] = ev.end.split(":").map(Number);

    for (let w = 0; w < weeks; w++) {
      const eventDate = new Date(
        firstEventDate.getTime() + w * 7 * 86400000
      );

      const start = addLocalMinutes(eventDate, sh * 60 + sm);
      const end = addLocalMinutes(eventDate, eh * 60 + em);

      result.push({
        title: ev.title || "Class",
        start,
        end,
      });
    }
  });

  return result;
}
