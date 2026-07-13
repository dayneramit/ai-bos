import type { BaseDocument, DocumentAsset } from "./document";
import type { CompanyProfile, CustomerProfile, ProjectInfo } from "./party";

export interface QuotationItem {
  id: string;
  description: string;
  detail?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  /** Discount amount in THB for this line (not a percentage). */
  discount?: number;
}

export interface QuotationConditions {
  paymentTerms?: string[];
  warranty?: string;
  remarkBullets?: string[];
}

export interface QuotationAttachments {
  beforePhotos?: DocumentAsset[];
  afterPhotos?: DocumentAsset[];
  blueprint?: DocumentAsset[];
  referenceImages?: DocumentAsset[];
}

export interface Quotation extends BaseDocument {
  type: "quotation";

  company: CompanyProfile;
  customer: CustomerProfile;
  project?: ProjectInfo;

  items: QuotationItem[];

  vatEnabled: boolean;
  vatRate: number; // e.g. 0.07
  withholdingTaxEnabled: boolean;
  withholdingTaxRate?: number; // future ready

  conditions?: QuotationConditions;
  quotationAttachments?: QuotationAttachments;
}

/** Computed, derived values — never stored, always recalculated from `items`. */
export interface QuotationTotals {
  subtotal: number;
  totalDiscount: number;
  vatAmount: number;
  withholdingTaxAmount: number;
  grandTotal: number;
  grandTotalText: string; // Thai Baht text
}
