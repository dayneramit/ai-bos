import type { WarrantyCertificate } from "@/types/warranty";
import { getWarrantyTemplate } from "@/components/templates/warranty-registry";
import { resolveWarrantyVisibility } from "@/lib/document-visibility";

interface WarrantyDocumentProps {
  warranty: WarrantyCertificate;
  mode: "preview" | "print";
}

export function WarrantyDocument({ warranty, mode }: WarrantyDocumentProps) {
  const template = getWarrantyTemplate(warranty.templateId);
  const visibility = resolveWarrantyVisibility(warranty);
  const Template = template.component;

  return <Template warranty={warranty} visibility={visibility} mode={mode} />;
}
