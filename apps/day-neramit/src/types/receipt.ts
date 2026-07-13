import type { BaseDocument } from "./document";
import type { CompanyProfile, CustomerProfile, ProjectInfo } from "./party";
import type { QuotationItem, QuotationTotals } from "./quotation";

/**
 * In Thai SME practice "ใบเสร็จรับเงิน" (receipt) and "ใบรับเงิน" (payment
 * voucher / deposit receipt) share the same layout and only differ in the
 * printed title and legal framing. `receiptKind` picks which title prints —
 * no separate document type or module is needed.
 */
export type ReceiptKind = "receipt" | "payment_voucher";

export type PaymentMethod = "cash" | "transfer" | "promptpay" | "card" | "cheque";

export const RECEIPT_KIND_LABEL: Record<ReceiptKind, string> = {
  receipt: "ใบเสร็จรับเงิน",
  payment_voucher: "ใบรับเงิน",
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: "เงินสด",
  transfer: "โอนเงิน",
  promptpay: "PromptPay",
  card: "บัตรเครดิต/เดบิต",
  cheque: "เช็ค",
};

export interface PaymentDetails {
  method: PaymentMethod;
  amountReceived: number;
  paidAt: string; // ISO 8601
  referenceDocumentNumber?: string; // e.g. related quotation/invoice number
  bankName?: string;
  chequeNumber?: string;
  receivedByName?: string;
}

export interface Receipt extends BaseDocument {
  type: "receipt";
  receiptKind: ReceiptKind;

  company: CompanyProfile;
  customer: CustomerProfile;
  project?: ProjectInfo;

  items: QuotationItem[];

  vatEnabled: boolean;
  vatRate: number;
  withholdingTaxEnabled: boolean;
  withholdingTaxRate?: number;

  payment: PaymentDetails;
  remarkBullets?: string[];
}

export type ReceiptTotals = QuotationTotals;
