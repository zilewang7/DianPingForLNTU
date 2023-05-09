export function formatDate(dateStr) {
  const [date, time] = dateStr.split("T");
  const timeStr = time.slice(0, 5);
  return [date, timeStr];
}
