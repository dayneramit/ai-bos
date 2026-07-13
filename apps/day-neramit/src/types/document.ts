/**
 * AI-BOS Document Engine — base types shared by EVERY document kind.
 *
 * Quotation, Invoice, Receipt, Tax Invoice, Delivery Note, Purchase Order,
 * Work Order, Service Report, Warranty Certificate, etc. all extend
 * `BaseDocument`. Nothing document-specific belongs in this file.
 */

export type DocumentType =
  | "quotation"
  | "invoice"
  | "receipt"
  | "tax_invoice"
  | "delivery_note"
  | "purchase_order"
  | "work_order"
  | "service_report"
  | "inspection_report"
  | "job_report"
  | "warranty_certificate"
  | "acceptance_form"
  | "internal_memo"
  | "official_letter";

export type DocumentStatus = "draft" | "approved" | "cancelled";

export type PaperSize = "A4" | "A5" | "Letter" | "Legal";

export type PaperOrientation = "portrait" | "landscape";

export interface PaperSpec {
  size: PaperSize;
  orientation: PaperOrientation;
}

/** An uploaded/attached file. Backed today by object URLs, tomorrow by Firebase Storage. */
export interface DocumentAsset {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface SignatureInfo {
  preparedByName?: string;
  preparedBySignatureUrl?: string;
  approvedByName?: string;
  approvedBySignatureUrl?: string;
  customerSignatureUrl?: string;
  companyStampUrl?: string;
}

export interface BaseDocument {
  id: string;
  type: DocumentType;
  templateId: string;
  status: DocumentStatus;

  /** Human-facing running number, e.g. QT-20260712-0001 */
  documentNumber: string;
  referenceNumber?: string;

  issueDate: string; // ISO 8601
  dueDate?: string; // ISO 8601

  salesPerson?: string;
  remarks?: string;

  signature?: SignatureInfo;
  attachments?: DocumentAsset[];

  watermark?: "draft" | "cancelled" | null;

  /** Set when the document is archived; cleared on restore. Independent of `status`. */
  archivedAt?: string | null;

  paper: PaperSpec;

  createdAt: string;
  updatedAt: string;
}
