import type { Receipt } from "@/types/receipt";
import type { ReceiptFormValues } from "@/lib/validation/receipt-schema";
import { DEFAULT_RECEIPT_TEMPLATE_ID } from "@/components/templates/receipt-registry";

export function receiptToFormValues(receipt: Receipt): ReceiptFormValues {
  return {
    templateId: receipt.templateId,
    receiptKind: receipt.receiptKind,
    status: receipt.status,
    issueDate: receipt.issueDate.slice(0, 10),
    salesPerson: receipt.salesPerson ?? "",
    company: receipt.company,
    customer: receipt.customer,
    project: receipt.project ?? { name: "", address: "" },
    items: receipt.items,
    vatEnabled: receipt.vatEnabled,
    vatRate: receipt.vatRate,
    withholdingTaxEnabled: receipt.withholdingTaxEnabled,
    withholdingTaxRate: receipt.withholdingTaxRate,
    payment: {
      ...receipt.payment,
      paidAt: receipt.payment.paidAt.slice(0, 10),
    },
    remarkBullets: receipt.remarkBullets ?? [],
    signature: receipt.signature,
    watermark: receipt.watermark ?? null,
  };
}

export function formValuesToReceipt(
  values: ReceiptFormValues,
  base: Pick<Receipt, "id" | "documentNumber" | "createdAt" | "paper" | "attachments">
): Receipt {
  return {
    ...base,
    type: "receipt",
    receiptKind: values.receiptKind,
    templateId: values.templateId,
    status: values.status,
    documentNumber: base.documentNumber,
    issueDate: values.issueDate,
    salesPerson: values.salesPerson || undefined,
    company: values.company,
    customer: values.customer,
    project: values.project,
    items: values.items,
    vatEnabled: values.vatEnabled,
    vatRate: values.vatRate,
    withholdingTaxEnabled: values.withholdingTaxEnabled,
    withholdingTaxRate: values.withholdingTaxRate,
    payment: values.payment,
    remarkBullets: values.remarkBullets,
    signature: values.signature,
    watermark: values.watermark ?? null,
    updatedAt: new Date().toISOString(),
  };
}

/** Seed values for a brand-new receipt, using Day Neramit's own published business profile. */
export function createDefaultReceiptFormValues(): ReceiptFormValues {
  const today = new Date().toISOString().slice(0, 10);

  return {
    templateId: DEFAULT_RECEIPT_TEMPLATE_ID,
    receiptKind: "receipt",
    status: "draft",
    issueDate: today,
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
    payment: {
      method: "cash",
      amountReceived: 0,
      paidAt: today,
      referenceDocumentNumber: "",
      bankName: "",
      chequeNumber: "",
      receivedByName: "",
    },
    remarkBullets: ["ได้รับเงินจำนวนดังกล่าวถูกต้องครบถ้วนแล้ว"],
    signature: {
      preparedByName: "",
    },
    watermark: "draft",
  };
}
