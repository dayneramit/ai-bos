import type { TemplateDefinition } from "@/types/template";
import { DayNeramitGoldTemplate } from "./company/day-neramit/DayNeramitGoldTemplate";

/**
 * Every template plugs in here. To add a new template (Personal, Government,
 * School, Foundation, ...): build a component matching `QuotationTemplateProps`
 * and register it below. Nothing else in the app needs to change.
 */
export const QUOTATION_TEMPLATES: Record<string, TemplateDefinition> = {
  "day-neramit-gold": {
    id: "day-neramit-gold",
    label: "Day Neramit — Gold (บริษัท)",
    entityType: "company",
    documentType: "quotation",
    paperDefaults: { size: "A4", orientation: "portrait" },
    component: DayNeramitGoldTemplate,
  },
};

export const DEFAULT_QUOTATION_TEMPLATE_ID = "day-neramit-gold";

export function getQuotationTemplate(templateId: string): TemplateDefinition {
  const template = QUOTATION_TEMPLATES[templateId];
  if (!template) {
    throw new Error(`Unknown quotation template: "${templateId}"`);
  }
  return template;
}

export function listQuotationTemplates(): TemplateDefinition[] {
  return Object.values(QUOTATION_TEMPLATES);
}
