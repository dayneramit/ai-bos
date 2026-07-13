import type { BaseDocument } from "./document";
import type { CompanyProfile, CustomerProfile } from "./party";

export interface WarrantyCoverageItem {
  id: string;
  productOrService: string;
  modelOrSerial?: string;
  quantity?: number;
}

export interface WarrantyCertificate extends BaseDocument {
  type: "warranty_certificate";

  company: CompanyProfile;
  customer: CustomerProfile;

  coverageItems: WarrantyCoverageItem[];

  installDate: string; // ISO 8601 — when the work/product was delivered
  warrantyStartDate: string; // ISO 8601
  warrantyEndDate: string; // ISO 8601
  warrantyPeriodLabel: string; // e.g. "1 ปี" — printed alongside the dates

  coverageBullets: string[]; // what IS covered
  exclusionBullets: string[]; // what is NOT covered / voids warranty

  relatedDocumentNumber?: string; // linked quotation/receipt number
}
