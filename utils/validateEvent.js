export const MIN_EVENT_MINUTES = 30;

export const isValidDate = (value) =>
  value instanceof Date && !Number.isNaN(value.getTime());

export const isValidEventRange = (start, end, minMinutes = MIN_EVENT_MINUTES) => {
  if (!isValidDate(start) || !isValidDate(end)) return false;
  if (end <= start) return false;
  return end.getTime() - start.getTime() >= minMinutes * 60 * 1000;
};
