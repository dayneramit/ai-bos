import type { Quotation } from "@/types/quotation";
import { getQuotationTemplate } from "@/components/templates/registry";
import { resolveQuotationVisibility } from "@/lib/document-visibility";

interface QuotationDocumentProps {
  quotation: Quotation;
  mode: "preview" | "print";
}

export function QuotationDocument({ quotation, mode }: QuotationDocumentProps) {
  const template = getQuotationTemplate(quotation.templateId);
  const visibility = resolveQuotationVisibility(quotation);
  const Template = template.component;

  return <Template quotation={quotation} visibility={visibility} mode={mode} />;
}
