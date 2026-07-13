/**
 * "Party" = any company, customer, or entity referenced on a document.
 * Reused by Quotation, Invoice, Receipt, PO, and every future document.
 */

export interface CompanyProfile {
  logoUrl?: string;
  name: string;
  branch?: string;
  taxId?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  facebook?: string;
  line?: string;
  promptPayId?: string;
}

export interface CustomerProfile {
  name: string;
  logoUrl?: string;
  address?: string;
  taxId?: string;
  phone?: string;
  email?: string;
}

export interface ProjectInfo {
  name?: string;
  address?: string;
}
