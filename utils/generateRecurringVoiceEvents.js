export function generateRecurringVoiceEvents(rawEvents, referenceDate, weeks = 1) {
  const DAY_INDEX = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const baseDate = new Date(referenceDate);
  baseDate.setHours(0, 0, 0, 0);

  const result = [];

  rawEvents.forEach(ev => {
    let firstEventDate;

    /**
     * 1️⃣ If explicit date exists → trust it
     * (voice command like "tomorrow", "on 5th September")
     */
    if (ev.date) {
      firstEventDate = new Date(ev.date);
      firstEventDate.setHours(0, 0, 0, 0);
    }

    /**
     * 2️⃣ Otherwise derive date from day + today
     */
    else if (ev.day) {
      const targetDay = DAY_INDEX[ev.day];

      let diff = targetDay - baseDate.getDay();
      if (diff < 0) diff += 7; // move forward only

      firstEventDate = new Date(baseDate);
      firstEventDate.setDate(baseDate.getDate() + diff);
    }

    if (!firstEventDate) return;

    const [sh, sm] = ev.start.split(":").map(Number);
    const [eh, em] = ev.end.split(":").map(Number);

    /**
     * 3️⃣ Generate recurring weekly events
     */
    for (let w = 0; w < weeks; w++) {
      const eventDate = new Date(firstEventDate);
      eventDate.setDate(eventDate.getDate() + w * 7);

      const start = new Date(eventDate);
      start.setHours(sh, sm, 0, 0);

      const end = new Date(eventDate);
      end.setHours(eh, em, 0, 0);

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
