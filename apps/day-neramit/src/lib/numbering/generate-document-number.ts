import type { DocumentType } from "@/types/document";

/** Prefix per document type — extend this map as new document kinds ship. */
export const DOCUMENT_NUMBER_PREFIX: Record<DocumentType, string> = {
  quotation: "QT",
  invoice: "IV",
  receipt: "RC",
  tax_invoice: "TX",
  delivery_note: "DN",
  purchase_order: "PO",
  work_order: "WO",
  service_report: "SR",
  inspection_report: "IR",
  job_report: "JR",
  warranty_certificate: "WR",
  acceptance_form: "AF",
  internal_memo: "IM",
  official_letter: "OL",
};

function pad(value: number, length: number): string {
  return String(value).padStart(length, "0");
}

/** Builds "QT-20260712-0001" from a document type, date, and running sequence for that day. */
export function formatDocumentNumber(
  type: DocumentType,
  date: Date,
  sequenceForDay: number
): string {
  const prefix = DOCUMENT_NUMBER_PREFIX[type];
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1, 2);
  const d = pad(date.getDate(), 2);
  return `${prefix}-${y}${m}${d}-${pad(sequenceForDay, 4)}`;
}

/** Extracts the YYYYMMDD key used to group running numbers per day. */
export function dateKeyOf(date: Date): string {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1, 2);
  const d = pad(date.getDate(), 2);
  return `${y}${m}${d}`;
}
