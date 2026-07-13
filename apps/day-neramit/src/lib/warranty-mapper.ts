import { v4 as uuidv4 } from "uuid";
import type { WarrantyCertificate } from "@/types/warranty";
import type { WarrantyFormValues } from "@/lib/validation/warranty-schema";
import { DEFAULT_WARRANTY_TEMPLATE_ID } from "@/components/templates/warranty-registry";

export function warrantyToFormValues(warranty: WarrantyCertificate): WarrantyFormValues {
  return {
    templateId: warranty.templateId,
    status: warranty.status,
    issueDate: warranty.issueDate.slice(0, 10),
    company: warranty.company,
    customer: warranty.customer,
    coverageItems: warranty.coverageItems,
    installDate: warranty.installDate.slice(0, 10),
    warrantyStartDate: warranty.warrantyStartDate.slice(0, 10),
    warrantyEndDate: warranty.warrantyEndDate.slice(0, 10),
    warrantyPeriodLabel: warranty.warrantyPeriodLabel,
    coverageBullets: warranty.coverageBullets,
    exclusionBullets: warranty.exclusionBullets,
    relatedDocumentNumber: warranty.relatedDocumentNumber ?? "",
    signature: warranty.signature,
    watermark: warranty.watermark ?? null,
  };
}

export function formValuesToWarranty(
  values: WarrantyFormValues,
  base: Pick<WarrantyCertificate, "id" | "documentNumber" | "createdAt" | "paper" | "attachments">
): WarrantyCertificate {
  return {
    ...base,
    type: "warranty_certificate",
    templateId: values.templateId,
    status: values.status,
    documentNumber: base.documentNumber,
    issueDate: values.issueDate,
    company: values.company,
    customer: values.customer,
    coverageItems: values.coverageItems,
    installDate: values.installDate,
    warrantyStartDate: values.warrantyStartDate,
    warrantyEndDate: values.warrantyEndDate,
    warrantyPeriodLabel: values.warrantyPeriodLabel,
    coverageBullets: values.coverageBullets ?? [],
    exclusionBullets: values.exclusionBullets ?? [],
    relatedDocumentNumber: values.relatedDocumentNumber || undefined,
    signature: values.signature,
    watermark: values.watermark ?? null,
    updatedAt: new Date().toISOString(),
  };
}

/** Seed values for a brand-new warranty certificate. */
export function createDefaultWarrantyFormValues(): WarrantyFormValues {
  const today = new Date().toISOString().slice(0, 10);
  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  return {
    templateId: DEFAULT_WARRANTY_TEMPLATE_ID,
    status: "draft",
    issueDate: today,
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
    coverageItems: [{ id: uuidv4(), productOrService: "", modelOrSerial: "", quantity: 1 }],
    installDate: today,
    warrantyStartDate: today,
    warrantyEndDate: oneYearLater.toISOString().slice(0, 10),
    warrantyPeriodLabel: "1 ปี",
    coverageBullets: [
      "ครอบคลุมความเสียหายจากความบกพร่องของวัสดุและฝีมือการติดตั้ง",
      "บริการตรวจเช็คและซ่อมแซมโดยไม่มีค่าใช้จ่ายภายในระยะเวลารับประกัน",
    ],
    exclusionBullets: [
      "ความเสียหายจากการใช้งานผิดวิธีหรือภัยธรรมชาติ",
      "การแก้ไข ดัดแปลง หรือซ่อมแซมโดยช่างภายนอกที่ไม่ได้รับอนุญาต",
    ],
    relatedDocumentNumber: "",
    signature: {
      preparedByName: "",
    },
    watermark: "draft",
  };
}
