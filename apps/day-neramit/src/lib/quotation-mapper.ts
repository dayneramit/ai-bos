import type { Quotation } from "@/types/quotation";
import type { QuotationFormValues } from "@/lib/validation/quotation-schema";
import { DEFAULT_QUOTATION_TEMPLATE_ID } from "@/components/templates/registry";

export function quotationToFormValues(quotation: Quotation): QuotationFormValues {
  return {
    templateId: quotation.templateId,
    status: quotation.status,
    referenceNumber: quotation.referenceNumber ?? "",
    issueDate: quotation.issueDate.slice(0, 10),
    dueDate: quotation.dueDate?.slice(0, 10) ?? "",
    salesPerson: quotation.salesPerson ?? "",
    company: quotation.company,
    customer: quotation.customer,
    project: quotation.project ?? { name: "", address: "" },
    items: quotation.items,
    vatEnabled: quotation.vatEnabled,
    vatRate: quotation.vatRate,
    withholdingTaxEnabled: quotation.withholdingTaxEnabled,
    withholdingTaxRate: quotation.withholdingTaxRate,
    conditions: quotation.conditions ?? { paymentTerms: [], remarkBullets: [], warranty: "" },
    signature: quotation.signature,
    watermark: quotation.watermark ?? null,
  };
}

export function formValuesToQuotation(
  values: QuotationFormValues,
  base: Pick<Quotation, "id" | "documentNumber" | "createdAt" | "paper" | "attachments" | "quotationAttachments">
): Quotation {
  return {
    ...base,
    type: "quotation",
    templateId: values.templateId,
    status: values.status,
    documentNumber: base.documentNumber,
    referenceNumber: values.referenceNumber || undefined,
    issueDate: values.issueDate,
    dueDate: values.dueDate || undefined,
    salesPerson: values.salesPerson || undefined,
    company: values.company,
    customer: values.customer,
    project: values.project,
    items: values.items,
    vatEnabled: values.vatEnabled,
    vatRate: values.vatRate,
    withholdingTaxEnabled: values.withholdingTaxEnabled,
    withholdingTaxRate: values.withholdingTaxRate,
    conditions: values.conditions,
    signature: values.signature,
    watermark: values.watermark ?? null,
    updatedAt: new Date().toISOString(),
  };
}

/** Seed values for a brand-new quotation, using Day Neramit's own published business profile. */
export function createDefaultQuotationFormValues(): QuotationFormValues {
  const today = new Date().toISOString().slice(0, 10);

  return {
    templateId: DEFAULT_QUOTATION_TEMPLATE_ID,
    status: "draft",
    referenceNumber: "",
    issueDate: today,
    dueDate: "",
    salesPerson: "",
    company: {
      name: "ช่างเดย์ เนรมิต",
      description: "บริการติดตั้ง ซ่อมบำรุง ล้างแอร์ และงานระบบ",
      branch: "",
      taxId: "",
      address: "กรุงเทพมหานคร, ประเทศไทย",
      phone: "",
      email: "dayneramit.service@gmail.com",
      website: "",
      facebook: "Day Neramit",
      line: "@dayneramit",
      promptPayId: "",
    },
    customer: {
      name: "",
      address: "",
      taxId: "",
      phone: "",
      email: "",
    },
    project: { name: "", address: "" },
    items: [],
    vatEnabled: true,
    vatRate: 0.07,
    withholdingTaxEnabled: false,
    withholdingTaxRate: 0,
    conditions: {
      paymentTerms: ["มัดจำ 50% ก่อนเริ่มงาน", "ชำระงวดที่ 2 จำนวน 50% เมื่อส่งมอบงาน"],
      remarkBullets: ["ราคานี้รวมค่าแรงและวัสดุอุปกรณ์แล้ว"],
      warranty: "รับประกันงาน 6 เดือน นับจากวันที่ส่งมอบงาน",
    },
    signature: {
      preparedByName: "",
    },
    watermark: "draft",
  };
}
