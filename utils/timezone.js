const normalizeOffset = (offsetMinutes) => {
  const parsed = Number(offsetMinutes);
  return Number.isFinite(parsed) ? parsed : null;
};

const hasExplicitTimezone = (value) => /[zZ]|[+-]\d{2}:?\d{2}$/.test(value);

const parseLocalString = (value, offsetMinutes) => {
  if (value.includes("T")) {
    const [datePart, timePart] = value.split("T");
    if (!datePart || !timePart) return new Date(value);

    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, secondPart] = timePart.split(":");
    const hh = Number(hour);
    const mm = Number(minute);
    const ss = Number(secondPart || 0);

    if (![year, month, day, hh, mm, ss].every(Number.isFinite)) {
      return new Date(value);
    }

    const utcMs = Date.UTC(year, month - 1, day, hh, mm, ss) + offsetMinutes * 60000;
    return new Date(utcMs);
  }

  const [year, month, day] = value.split("-").map(Number);
  if (![year, month, day].every(Number.isFinite)) {
    return new Date(value);
  }

  const utcMs = Date.UTC(year, month - 1, day, 0, 0, 0) + offsetMinutes * 60000;
  return new Date(utcMs);
};

export const parseDateTime = (value, timezoneOffsetMinutes) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value !== "string") return new Date(value);
  if (hasExplicitTimezone(value)) return new Date(value);

  const offset = normalizeOffset(timezoneOffsetMinutes);
  if (offset === null) return new Date(value);

  return parseLocalString(value, offset);
};

export const startOfLocalDayUtc = (date, timezoneOffsetMinutes) => {
  const parsed = date instanceof Date ? date : new Date(date);
  const offset = normalizeOffset(timezoneOffsetMinutes);

  if (offset === null) {
    const local = new Date(parsed);
    local.setHours(0, 0, 0, 0);
    return local;
  }

  const localMs = parsed.getTime() - offset * 60000;
  const localDate = new Date(localMs);
  localDate.setUTCHours(0, 0, 0, 0);

  return new Date(localDate.getTime() + offset * 60000);
};

export const getLocalDayIndex = (date, timezoneOffsetMinutes) => {
  const parsed = date instanceof Date ? date : new Date(date);
  const offset = normalizeOffset(timezoneOffsetMinutes);

  if (offset === null) {
    return parsed.getDay();
  }

  const localMs = parsed.getTime() - offset * 60000;
  const localDate = new Date(localMs);
  return localDate.getUTCDay();
};

export const addLocalMinutes = (localMidnightUtc, minutes) =>
  new Date(localMidnightUtc.getTime() + minutes * 60000);
