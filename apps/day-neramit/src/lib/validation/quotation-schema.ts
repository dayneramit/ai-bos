import { z } from "zod";

export const quotationItemSchema = z.object({
  id: z.string().min(1),
  description: z.string().trim().min(1, "กรุณาระบุรายการ"),
  detail: z.string().trim().optional(),
  quantity: z.coerce.number().positive("จำนวนต้องมากกว่า 0"),
  unit: z.string().trim().min(1, "กรุณาระบุหน่วย"),
  unitPrice: z.coerce.number().min(0, "ราคาต่อหน่วยต้องไม่ติดลบ"),
  discount: z.coerce.number().min(0).optional(),
});

export const companyProfileSchema = z.object({
  logoUrl: z.string().url().optional().or(z.literal("")),
  name: z.string().trim().min(1, "กรุณาระบุชื่อผู้เสนอราคา"),
  branch: z.string().trim().optional(),
  taxId: z
    .string()
    .trim()
    .regex(/^\d{13}$/, "เลขผู้เสียภาษีต้องมี 13 หลัก")
    .optional()
    .or(z.literal("")),
  description: z.string().trim().optional(),
  address: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email("อีเมลไม่ถูกต้อง").optional().or(z.literal("")),
  website: z.string().trim().optional(),
  facebook: z.string().trim().optional(),
  line: z.string().trim().optional(),
  promptPayId: z.string().trim().optional(),
});

export const customerProfileSchema = z.object({
  name: z.string().trim().min(1, "กรุณาระบุชื่อลูกค้า"),
  logoUrl: z.string().url().optional().or(z.literal("")),
  address: z.string().trim().optional(),
  taxId: z
    .string()
    .trim()
    .regex(/^\d{13}$/, "เลขผู้เสียภาษีต้องมี 13 หลัก")
    .optional()
    .or(z.literal("")),
  phone: z.string().trim().optional(),
  email: z.string().trim().email("อีเมลไม่ถูกต้อง").optional().or(z.literal("")),
});

export const quotationFormSchema = z.object({
  templateId: z.string().min(1),
  status: z.enum(["draft", "approved", "cancelled"]),
  referenceNumber: z.string().trim().optional(),
  issueDate: z.string().min(1, "กรุณาระบุวันที่เสนอราคา"),
  dueDate: z.string().optional(),
  salesPerson: z.string().trim().optional(),

  company: companyProfileSchema,
  customer: customerProfileSchema,
  project: z
    .object({
      name: z.string().trim().optional(),
      address: z.string().trim().optional(),
    })
    .optional(),

  items: z.array(quotationItemSchema).min(1, "ต้องมีรายการอย่างน้อย 1 รายการ"),

  vatEnabled: z.boolean(),
  vatRate: z.coerce.number().min(0).max(1),
  withholdingTaxEnabled: z.boolean(),
  withholdingTaxRate: z.coerce.number().min(0).max(1).optional(),

  conditions: z
    .object({
      paymentTerms: z.array(z.string()).optional(),
      warranty: z.string().trim().optional(),
      remarkBullets: z.array(z.string()).optional(),
    })
    .optional(),

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

export type QuotationFormValues = z.infer<typeof quotationFormSchema>;
