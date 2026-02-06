export function generateRecurringEvents(slots, weeks, baseDate = new Date()) {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const events = [];

  slots.forEach(slot => {
    for (let i = 0; i < weeks; i++) {
      const date = new Date(baseDate);
      const offset =
        (days.indexOf(slot.day) - date.getDay() + 7) % 7 + i * 7;
      date.setDate(date.getDate() + offset);

      const [sh, sm] = slot.start.split(":");
      const [eh, em] = slot.end.split(":");

      const start = new Date(date);
      start.setHours(sh, sm);

      const end = new Date(date);
      end.setHours(eh, em);

      events.push({
        title: slot.title,
        start,
        end,
        source: "timetable",
      });
    }
  });

  return events;
}
