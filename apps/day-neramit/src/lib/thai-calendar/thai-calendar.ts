const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const BUDDHIST_YEAR_OFFSET = 543;

/** Formats an ISO date string as Thai Buddhist calendar, e.g. "12 พฤษภาคม 2567". */
export function formatThaiBuddhistDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = THAI_MONTHS[date.getMonth()];
  const buddhistYear = date.getFullYear() + BUDDHIST_YEAR_OFFSET;
  return `${day} ${month} ${buddhistYear}`;
}

export function toBuddhistYear(gregorianYear: number): number {
  return gregorianYear + BUDDHIST_YEAR_OFFSET;
}
