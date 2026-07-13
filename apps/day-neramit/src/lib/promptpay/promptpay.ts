/**
 * Thai PromptPay QR payload generator.
 * Implements the Thai QR Payment Standard (EMVCo-based TLV format)
 * published by the Bank of Thailand / Thai Payment Network.
 */

function tlv(id: string, value: string): string {
  const length = String(value.length).padStart(2, "0");
  return `${id}${length}${value}`;
}

/** CRC-16/CCITT-FALSE, as required by the EMVCo QR spec (tag 63). */
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/** Normalizes a PromptPay ID: 13-digit Tax ID/national ID, or Thai mobile number. */
function normalizeTarget(promptPayId: string): { tag: "01" | "02"; value: string } {
  const digitsOnly = promptPayId.replace(/[^0-9]/g, "");

  if (digitsOnly.length === 13) {
    // National ID / Juristic Tax ID
    return { tag: "02", value: digitsOnly };
  }

  // Mobile number: convert local 0XXXXXXXXX -> international 66XXXXXXXXX (13 chars incl. leading zeros)
  const withoutLeadingZero = digitsOnly.startsWith("0")
    ? digitsOnly.slice(1)
    : digitsOnly;
  const international = `0066${withoutLeadingZero}`.slice(-13).padStart(13, "0");
  return { tag: "01", value: international };
}

export interface BuildPromptPayPayloadOptions {
  promptPayId: string;
  amount?: number;
}

/** Builds the full EMVCo TLV string to encode into the QR image. */
export function buildPromptPayPayload({
  promptPayId,
  amount,
}: BuildPromptPayPayloadOptions): string {
  const target = normalizeTarget(promptPayId);

  const merchantAccountInfo =
    tlv("00", "A000000677010111") + tlv(target.tag, target.value);

  const isDynamic = typeof amount === "number" && amount > 0;

  const parts = [
    tlv("00", "01"), // Payload Format Indicator
    tlv("01", isDynamic ? "12" : "11"), // Point of Initiation Method
    tlv("29", merchantAccountInfo), // PromptPay merchant account
    tlv("53", "764"), // Currency: THB
    isDynamic ? tlv("54", amount!.toFixed(2)) : "",
    tlv("58", "TH"), // Country code
  ].join("");

  const withCrcPlaceholder = `${parts}6304`;
  const checksum = crc16(withCrcPlaceholder);

  return `${withCrcPlaceholder}${checksum}`;
}
