import type { ComponentType } from "react";
import type { PaperSpec } from "./document";
import type { Quotation } from "./quotation";
import type { Receipt } from "./receipt";
import type { WarrantyCertificate } from "./warranty";

/**
 * The set of entity types a template can be designed for.
 * Matches the "Document Template System" requirement: templates are
 * plug-and-play per legal/organizational entity type.
 */
export type TemplateEntityType =
  | "personal"
  | "company"
  | "corporate"
  | "government"
  | "legal_entity"
  | "school"
  | "organization"
  | "foundation";

/**
 * Props every quotation template layout component receives.
 * Only ONE component renders both the live preview AND the export
 * output — this is what guarantees the PDF is never a screenshot.
 */
export interface QuotationTemplateProps {
  quotation: Quotation;
  /** Which optional sections should actually render (see lib/document-visibility). */
  visibility: QuotationSectionVisibility;
  /** Read-only mode (export/print) hides editor-only affordances. */
  mode: "preview" | "print";
}

export interface QuotationSectionVisibility {
  showLogo: boolean;
  showSignature: boolean;
  showStamp: boolean;
  showVat: boolean;
  showDiscountColumn: boolean;
  showCustomerTaxId: boolean;
  showReferenceNumber: boolean;
  showRemarks: boolean;
  showAttachments: boolean;
  showProject: boolean;
  showPromptPay: boolean;
}

export interface TemplateDefinition {
  id: string;
  label: string;
  entityType: TemplateEntityType;
  documentType: "quotation";
  paperDefaults: PaperSpec;
  component: ComponentType<QuotationTemplateProps>;
}

/** Same pattern as QuotationTemplateProps, for the Receipt / Payment Voucher document kind. */
export interface ReceiptTemplateProps {
  receipt: Receipt;
  visibility: ReceiptSectionVisibility;
  mode: "preview" | "print";
}

export interface ReceiptSectionVisibility {
  showLogo: boolean;
  showSignature: boolean;
  showStamp: boolean;
  showVat: boolean;
  showDiscountColumn: boolean;
  showCustomerTaxId: boolean;
  showProject: boolean;
  showPromptPay: boolean;
  showRemarks: boolean;
  showReferenceDocument: boolean;
}

export interface ReceiptTemplateDefinition {
  id: string;
  label: string;
  entityType: TemplateEntityType;
  documentType: "receipt";
  paperDefaults: PaperSpec;
  component: ComponentType<ReceiptTemplateProps>;
}

/** Same pattern again, for the Warranty Certificate document kind. */
export interface WarrantyTemplateProps {
  warranty: WarrantyCertificate;
  visibility: WarrantySectionVisibility;
  mode: "preview" | "print";
}

export interface WarrantySectionVisibility {
  showLogo: boolean;
  showSignature: boolean;
  showStamp: boolean;
  showCustomerTaxId: boolean;
  showExclusions: boolean;
  showRelatedDocument: boolean;
}

export interface WarrantyTemplateDefinition {
  id: string;
  label: string;
  entityType: TemplateEntityType;
  documentType: "warranty_certificate";
  paperDefaults: PaperSpec;
  component: ComponentType<WarrantyTemplateProps>;
}
