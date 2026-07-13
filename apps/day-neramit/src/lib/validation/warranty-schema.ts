import { z } from "zod";
import { companyProfileSchema, customerProfileSchema } from "./quotation-schema";

export const warrantyCoverageItemSchema = z.object({
  id: z.string().min(1),
  productOrService: z.string().trim().min(1, "กรุณาระบุรายการ"),
  modelOrSerial: z.string().trim().optional(),
  quantity: z.coerce.number().min(1).optional(),
});

export const warrantyFormSchema = z.object({
  templateId: z.string().min(1),
  status: z.enum(["draft", "approved", "cancelled"]),
  issueDate: z.string().min(1, "กรุณาระบุวันที่ออกเอกสาร"),

  company: companyProfileSchema,
  customer: customerProfileSchema,

  coverageItems: z.array(warrantyCoverageItemSchema).min(1, "ต้องมีรายการอย่างน้อย 1 รายการ"),

  installDate: z.string().min(1, "กรุณาระบุวันที่ส่งมอบ/ติดตั้ง"),
  warrantyStartDate: z.string().min(1, "กรุณาระบุวันเริ่มความคุ้มครอง"),
  warrantyEndDate: z.string().min(1, "กรุณาระบุวันสิ้นสุดความคุ้มครอง"),
  warrantyPeriodLabel: z.string().trim().min(1, "กรุณาระบุระยะเวลารับประกัน"),

  coverageBullets: z.array(z.string()).optional(),
  exclusionBullets: z.array(z.string()).optional(),

  relatedDocumentNumber: z.string().trim().optional(),

  signature: z
    .object({
      preparedByName: z.string().trim().optional(),
      preparedBySignatureUrl: z.string().optional(),
      approvedByName: z.string().trim().optional(),
      approvedBySignatureUrl: z.string().optional(),
      customerSignatureUrl: z.string().optional(),
      companyStampUrl: z.string().optional(),
    })
    .optional(),

  watermark: z.enum(["draft", "cancelled"]).nullable().optional(),
});

export type WarrantyFormValues = z.infer<typeof warrantyFormSchema>;
