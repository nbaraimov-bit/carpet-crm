export function getTashkentDateId(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function shiftDateId(dateId, offset) {
  const date = new Date(`${dateId}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

export function getStatsRange(period, today, customStart, customEnd) {
  if (period === "week") {
    const dayOffset = (new Date(`${today}T00:00:00.000Z`).getUTCDay() + 6) % 7;
    const startDate = shiftDateId(today, -dayOffset);
    return { startDate, endDate: shiftDateId(startDate, 6), isValid: true };
  }

  if (period === "month") {
    return { startDate: `${today.slice(0, 7)}-01`, endDate: today, isValid: true };
  }

  if (period === "custom") {
    const startDate = customStart || today;
    const endDate = customEnd || startDate;
    return { startDate, endDate, isValid: startDate <= endDate };
  }

  return { startDate: today, endDate: today, isValid: true };
}

export function formatStatsNumber(value, maximumFractionDigits = 0) {
  const number = Number(value || 0);
  return number.toLocaleString("uz-UZ", { maximumFractionDigits });
}
