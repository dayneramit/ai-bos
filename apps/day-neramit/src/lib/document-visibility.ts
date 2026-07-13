import type { Quotation } from "@/types/quotation";
import type { Receipt } from "@/types/receipt";
import type { WarrantyCertificate } from "@/types/warranty";
import type {
  QuotationSectionVisibility,
  ReceiptSectionVisibility,
  WarrantySectionVisibility,
} from "@/types/template";

/**
 * Smart Document Rules: a section renders ONLY when it has real content.
 * This function is the single place that decides visibility so that no
 * template ever hand-rolls "if empty, hide" logic — preventing drift
 * and duplicate rules across templates.
 */
export function resolveQuotationVisibility(
  quotation: Quotation
): QuotationSectionVisibility {
  const hasAnyDiscount = quotation.items.some((item) => (item.discount ?? 0) > 0);

  const attachments = quotation.quotationAttachments;
  const hasAttachments = Boolean(
    attachments &&
      ((attachments.beforePhotos?.length ?? 0) > 0 ||
        (attachments.afterPhotos?.length ?? 0) > 0 ||
        (attachments.blueprint?.length ?? 0) > 0 ||
        (attachments.referenceImages?.length ?? 0) > 0)
  );

  return {
    showLogo: Boolean(quotation.company.logoUrl),
    showSignature: Boolean(
      quotation.signature?.preparedBySignatureUrl ||
        quotation.signature?.preparedByName
    ),
    showStamp: Boolean(quotation.signature?.companyStampUrl),
    showVat: quotation.vatEnabled,
    showDiscountColumn: hasAnyDiscount,
    showCustomerTaxId: Boolean(quotation.customer.taxId),
    showReferenceNumber: Boolean(quotation.referenceNumber),
    showRemarks: Boolean(quotation.conditions?.remarkBullets?.length),
    showAttachments: hasAttachments,
    showProject: Boolean(quotation.project?.name || quotation.project?.address),
    showPromptPay: Boolean(quotation.company.promptPayId),
  };
}

/** Filters out item rows that are entirely empty (Smart Rule: "Automatically hide empty rows"). */
export function nonEmptyItems(quotation: Quotation) {
  return quotation.items.filter(
    (item) => item.description.trim().length > 0 || item.quantity > 0
  );
}

export function resolveReceiptVisibility(receipt: Receipt): ReceiptSectionVisibility {
  const hasAnyDiscount = receipt.items.some((item) => (item.discount ?? 0) > 0);

  return {
    showLogo: Boolean(receipt.company.logoUrl),
    showSignature: Boolean(
      receipt.signature?.preparedBySignatureUrl || receipt.signature?.preparedByName
    ),
    showStamp: Boolean(receipt.signature?.companyStampUrl),
    showVat: receipt.vatEnabled,
    showDiscountColumn: hasAnyDiscount,
    showCustomerTaxId: Boolean(receipt.customer.taxId),
    showProject: Boolean(receipt.project?.name || receipt.project?.address),
    showPromptPay: Boolean(receipt.company.promptPayId),
    showRemarks: Boolean(receipt.remarkBullets?.length),
    showReferenceDocument: Boolean(receipt.payment.referenceDocumentNumber),
  };
}

/** Filters out receipt item rows that are entirely empty. */
export function nonEmptyReceiptItems(receipt: Receipt) {
  return receipt.items.filter(
    (item) => item.description.trim().length > 0 || item.quantity > 0
  );
}

export function resolveWarrantyVisibility(
  warranty: WarrantyCertificate
): WarrantySectionVisibility {
  return {
    showLogo: Boolean(warranty.company.logoUrl),
    showSignature: Boolean(
      warranty.signature?.preparedBySignatureUrl || warranty.signature?.preparedByName
    ),
    showStamp: Boolean(warranty.signature?.companyStampUrl),
    showCustomerTaxId: Boolean(warranty.customer.taxId),
    showExclusions: Boolean(warranty.exclusionBullets?.length),
    showRelatedDocument: Boolean(warranty.relatedDocumentNumber),
  };
}
