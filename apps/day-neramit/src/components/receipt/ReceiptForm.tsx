"use client";

import { Controller, FormProvider, type UseFormReturn } from "react-hook-form";
import type { ReceiptFormValues } from "@/lib/validation/receipt-schema";
import { ReceiptItemsFieldArray } from "./ReceiptItemsFieldArray";
import { listReceiptTemplates } from "@/components/templates/receipt-registry";
import { RECEIPT_KIND_LABEL, PAYMENT_METHOD_LABEL } from "@/types/receipt";

function LineListTextarea({
  name,
  placeholder,
  control,
}: {
  name: "remarkBullets";
  placeholder: string;
  control: UseFormReturn<ReceiptFormValues>["control"];
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <textarea
          value={(field.value ?? []).join("\n")}
          onChange={(e) =>
            field.onChange(e.target.value.split("\n").map((line) => line.trim()).filter(Boolean))
          }
          className={inputClass}
          rows={3}
          placeholder={placeholder}
        />
      )}
    />
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 border-b border-white/10 pb-6">
      <h2
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--doc-gold-300)" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  span = 1,
}: {
  label: string;
  children: React.ReactNode;
  span?: 1 | 2;
}) {
  return (
    <div className={span === 2 ? "col-span-2" : "col-span-1"}>
      <label className="mb-1 block text-[11px] text-white/60">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-md bg-white/10 px-2.5 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-1 focus:ring-[var(--doc-gold-400)]";

interface ReceiptFormProps {
  form: UseFormReturn<ReceiptFormValues>;
}

export function ReceiptForm({ form }: ReceiptFormProps) {
  const { register, watch } = form;
  const templates = listReceiptTemplates();

  return (
    <FormProvider {...form}>
      <form className="space-y-6 p-6 text-white">
        <Section title="ประเภทเอกสาร">
          <select {...register("receiptKind")} className={inputClass}>
            {Object.entries(RECEIPT_KIND_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Section>

        <Section title="เทมเพลตเอกสาร">
          <select {...register("templateId")} className={inputClass}>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </Section>

        <Section title="ข้อมูลผู้ออกเอกสาร (บริษัท)">
          <div className="grid grid-cols-2 gap-3">
            <Field label="ชื่อบริษัท / ร้าน" span={2}>
              <input {...register("company.name")} className={inputClass} />
            </Field>
            <Field label="โทรศัพท์">
              <input {...register("company.phone")} className={inputClass} />
            </Field>
            <Field label="อีเมล">
              <input {...register("company.email")} className={inputClass} />
            </Field>
            <Field label="ที่อยู่" span={2}>
              <input {...register("company.address")} className={inputClass} />
            </Field>
            <Field label="PromptPay ID" span={2}>
              <input {...register("company.promptPayId")} className={inputClass} placeholder="เบอร์โทร หรือ เลขผู้เสียภาษี" />
            </Field>
          </div>
        </Section>

        <Section title="ข้อมูลลูกค้า">
          <div className="grid grid-cols-2 gap-3">
            <Field label="ชื่อลูกค้า" span={2}>
              <input {...register("customer.name")} className={inputClass} />
            </Field>
            <Field label="เบอร์โทร">
              <input {...register("customer.phone")} className={inputClass} />
            </Field>
            <Field label="เลขผู้เสียภาษี">
              <input {...register("customer.taxId")} className={inputClass} />
            </Field>
            <Field label="ที่อยู่" span={2}>
              <input {...register("customer.address")} className={inputClass} />
            </Field>
          </div>
        </Section>

        <Section title="ข้อมูลเอกสาร">
          <div className="grid grid-cols-2 gap-3">
            <Field label="วันที่ออกเอกสาร">
              <input type="date" {...register("issueDate")} className={inputClass} />
            </Field>
            <Field label="พนักงาน">
              <input {...register("salesPerson")} className={inputClass} />
            </Field>
            <Field label="สถานะเอกสาร">
              <select {...register("status")} className={inputClass}>
                <option value="draft">ฉบับร่าง (Draft)</option>
                <option value="approved">อนุมัติแล้ว (Approved)</option>
                <option value="cancelled">ยกเลิก (Cancelled)</option>
              </select>
            </Field>
            <Field label="ลายน้ำ (Watermark)">
              <Controller
                name="watermark"
                control={form.control}
                render={({ field }) => (
                  <select
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.value)}
                    className={inputClass}
                  >
                    <option value="">ไม่มี</option>
                    <option value="draft">ฉบับร่าง</option>
                    <option value="cancelled">ยกเลิก</option>
                  </select>
                )}
              />
            </Field>
          </div>
        </Section>

        <Section title="ภาษี">
          <div className="flex items-center gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("vatEnabled")} />
              คิดภาษีมูลค่าเพิ่ม (VAT)
            </label>
            {watch("vatEnabled") ? (
              <div className="flex items-center gap-2">
                <span className="text-white/60">อัตรา VAT</span>
                <input
                  type="number"
                  step="0.01"
                  {...register("vatRate", { valueAsNumber: true })}
                  className="w-20 rounded-md bg-white/10 px-2 py-1 text-sm"
                />
              </div>
            ) : null}
          </div>
        </Section>

        <Section title="รายการ">
          <ReceiptItemsFieldArray />
        </Section>

        <Section title="รายละเอียดการชำระเงิน">
          <div className="grid grid-cols-2 gap-3">
            <Field label="ช่องทางชำระเงิน">
              <select {...register("payment.method")} className={inputClass}>
                {Object.entries(PAYMENT_METHOD_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="วันที่ชำระเงิน">
              <input type="date" {...register("payment.paidAt")} className={inputClass} />
            </Field>
            <Field label="จำนวนเงินที่รับ">
              <input
                type="number"
                step="any"
                {...register("payment.amountReceived", { valueAsNumber: true })}
                className={inputClass}
              />
            </Field>
            <Field label="อ้างอิงเอกสาร (เช่น เลขที่ใบเสนอราคา)">
              <input {...register("payment.referenceDocumentNumber")} className={inputClass} />
            </Field>
            {watch("payment.method") === "transfer" ? (
              <Field label="ธนาคาร">
                <input {...register("payment.bankName")} className={inputClass} />
              </Field>
            ) : null}
            {watch("payment.method") === "cheque" ? (
              <Field label="เลขที่เช็ค">
                <input {...register("payment.chequeNumber")} className={inputClass} />
              </Field>
            ) : null}
            <Field label="ผู้รับเงิน">
              <input {...register("payment.receivedByName")} className={inputClass} />
            </Field>
          </div>
        </Section>

        <Section title="หมายเหตุ">
          <LineListTextarea
            name="remarkBullets"
            control={form.control}
            placeholder="ได้รับเงินจำนวนดังกล่าวถูกต้องครบถ้วนแล้ว"
          />
        </Section>

        <Section title="ลายเซ็นผู้รับเงิน">
          <Field label="ชื่อผู้รับเงิน / ผู้ออกเอกสาร">
            <input {...register("signature.preparedByName")} className={inputClass} />
          </Field>
        </Section>
      </form>
    </FormProvider>
  );
}
