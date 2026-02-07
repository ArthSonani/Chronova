export function generateRecurringEvents(rawEvents, startDate, weeks = 1) {

  const DAY_INDEX = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const baseDate = new Date(startDate);
  baseDate.setHours(0, 0, 0, 0);

  const result = [];

  // 2️⃣ Convert each entry → Date-based events
  rawEvents.forEach(ev => {
    const targetDay = DAY_INDEX[ev.day];

    // ✅ Always move forward to NEXT occurrence
    let diff = (targetDay - baseDate.getDay() + 7) % 7;
    if (diff === 0) diff = 7; // move to next week, not today

    const firstEventDate = new Date(baseDate);
    firstEventDate.setDate(firstEventDate.getDate() + diff);

    const [sh, sm] = ev.start.split(":").map(Number);
    const [eh, em] = ev.end.split(":").map(Number);

    for (let w = 0; w < weeks; w++) {
      const eventDate = new Date(firstEventDate);
      eventDate.setDate(eventDate.getDate() + w * 7);

      const start = new Date(eventDate);
      start.setHours(sh, sm, 0, 0);

      const end = new Date(eventDate);
      end.setHours(eh, em, 0, 0);

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
