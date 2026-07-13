import type { ReceiptTemplateDefinition } from "@/types/template";
import { ReceiptGoldTemplate } from "./company/day-neramit/ReceiptGoldTemplate";

export const RECEIPT_TEMPLATES: Record<string, ReceiptTemplateDefinition> = {
  "day-neramit-gold": {
    id: "day-neramit-gold",
    label: "Day Neramit — Gold (บริษัท)",
    entityType: "company",
    documentType: "receipt",
    paperDefaults: { size: "A4", orientation: "portrait" },
    component: ReceiptGoldTemplate,
  },
};

export const DEFAULT_RECEIPT_TEMPLATE_ID = "day-neramit-gold";

export function getReceiptTemplate(templateId: string): ReceiptTemplateDefinition {
  const template = RECEIPT_TEMPLATES[templateId];
  if (!template) {
    throw new Error(`Unknown receipt template: "${templateId}"`);
  }
  return template;
}

export function listReceiptTemplates(): ReceiptTemplateDefinition[] {
  return Object.values(RECEIPT_TEMPLATES);
}
