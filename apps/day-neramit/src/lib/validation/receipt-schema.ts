import { z } from "zod";
import { quotationItemSchema, companyProfileSchema, customerProfileSchema } from "./quotation-schema";

export const paymentDetailsSchema = z.object({
  method: z.enum(["cash", "transfer", "promptpay", "card", "cheque"]),
  amountReceived: z.coerce.number().min(0, "จำนวนเงินต้องไม่ติดลบ"),
  paidAt: z.string().min(1, "กรุณาระบุวันที่ชำระเงิน"),
  referenceDocumentNumber: z.string().trim().optional(),
  bankName: z.string().trim().optional(),
  chequeNumber: z.string().trim().optional(),
  receivedByName: z.string().trim().optional(),
});

export const receiptFormSchema = z.object({
  templateId: z.string().min(1),
  receiptKind: z.enum(["receipt", "payment_voucher"]),
  status: z.enum(["draft", "approved", "cancelled"]),
  issueDate: z.string().min(1, "กรุณาระบุวันที่ออกเอกสาร"),
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

  payment: paymentDetailsSchema,
  remarkBullets: z.array(z.string()).optional(),

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

export type ReceiptFormValues = z.infer<typeof receiptFormSchema>;
