import type { WarrantyTemplateDefinition } from "@/types/template";
import { WarrantyGoldTemplate } from "./company/day-neramit/WarrantyGoldTemplate";

export const WARRANTY_TEMPLATES: Record<string, WarrantyTemplateDefinition> = {
  "day-neramit-gold": {
    id: "day-neramit-gold",
    label: "Day Neramit — Gold (บริษัท)",
    entityType: "company",
    documentType: "warranty_certificate",
    paperDefaults: { size: "A4", orientation: "portrait" },
    component: WarrantyGoldTemplate,
  },
};

export const DEFAULT_WARRANTY_TEMPLATE_ID = "day-neramit-gold";

export function getWarrantyTemplate(templateId: string): WarrantyTemplateDefinition {
  const template = WARRANTY_TEMPLATES[templateId];
  if (!template) {
    throw new Error(`Unknown warranty template: "${templateId}"`);
  }
  return template;
}

export function listWarrantyTemplates(): WarrantyTemplateDefinition[] {
  return Object.values(WARRANTY_TEMPLATES);
}
