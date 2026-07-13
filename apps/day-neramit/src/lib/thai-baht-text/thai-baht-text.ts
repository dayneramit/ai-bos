/**
 * Converts a numeric amount into Thai Baht text, e.g.
 *   34775      -> "สามหมื่นสี่พันเจ็ดร้อยเจ็ดสิบห้าบาทถ้วน"
 *   1234.50    -> "หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบสตางค์"
 *   0          -> "ศูนย์บาทถ้วน"
 *
 * Standard algorithm used across Thai accounting/ERP systems.
 */

const DIGITS = [
  "ศูนย์",
  "หนึ่ง",
  "สอง",
  "สาม",
  "สี่",
  "ห้า",
  "หก",
  "เจ็ด",
  "แปด",
  "เก้า",
];

const PLACE_NAMES = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

/** Converts an integer (0 to < 1,000,000 before million-recursion) into Thai words. */
function convertIntegerChunk(numStr: string): string {
  let result = "";
  const length = numStr.length;

  for (let i = 0; i < length; i++) {
    const digit = Number(numStr[i]);
    const placeFromRight = length - i - 1;

    if (digit === 0) continue;

    if (placeFromRight === 0) {
      // Units place
      if (digit === 1 && length > 1) {
        result += "เอ็ด";
      } else {
        result += DIGITS[digit];
      }
    } else if (placeFromRight === 1) {
      // Tens place
      if (digit === 1) {
        result += "สิบ";
      } else if (digit === 2) {
        result += "ยี่สิบ";
      } else {
        result += DIGITS[digit] + "สิบ";
      }
    } else {
      result += DIGITS[digit] + PLACE_NAMES[placeFromRight];
    }
  }

  return result;
}

function convertInteger(value: number): string {
  if (value === 0) return "ศูนย์";

  // Thai place names only go up to ล้าน (million); beyond that, recurse
  // by grouping into millions, matching standard accounting conventions.
  const MILLION = 1_000_000;
  if (value < MILLION) {
    return convertIntegerChunk(String(value));
  }

  const millions = Math.floor(value / MILLION);
  const remainder = value % MILLION;

  const millionsText = convertInteger(millions) + "ล้าน";
  const remainderText = remainder > 0 ? convertIntegerChunk(String(remainder)) : "";

  return millionsText + remainderText;
}

export function numberToThaiBahtText(amount: number): string {
  const safeAmount = Math.abs(round2(amount));
  const baht = Math.floor(safeAmount);
  const satang = Math.round((safeAmount - baht) * 100);

  const bahtText = convertInteger(baht) + "บาท";
  const satangText = satang > 0 ? convertIntegerChunk(String(satang)) + "สตางค์" : "ถ้วน";

  const sign = amount < 0 ? "ลบ" : "";

  return sign + bahtText + satangText;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
