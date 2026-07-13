"use client";

import { Controller, FormProvider, type UseFormReturn } from "react-hook-form";
import type { QuotationFormValues } from "@/lib/validation/quotation-schema";
import { QuotationItemsFieldArray } from "./QuotationItemsFieldArray";
import { listQuotationTemplates } from "@/components/templates/registry";

/** Renders a string[] field as a multi-line textarea (one bullet per line). */
function LineListTextarea({
  name,
  placeholder,
  control,
}: {
  name: "conditions.paymentTerms" | "conditions.remarkBullets";
  placeholder: string;
  control: UseFormReturn<QuotationFormValues>["control"];
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <textarea
          value={(field.value ?? []).join("\n")}
          onChange={(e) =>
            field.onChange(
              e.target.value.split("\n").map((line) => line.trim()).filter(Boolean)
            )
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
      <h2 className="text-xs font-semibold uppercase tracking-wider text-doc-gold-300" style={{ color: "var(--doc-gold-300)" }}>
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

interface QuotationFormProps {
  form: UseFormReturn<QuotationFormValues>;
}

export function QuotationForm({ form }: QuotationFormProps) {
  const { register, watch } = form;
  const templates = listQuotationTemplates();

  return (
    <FormProvider {...form}>
      <form className="space-y-6 p-6 text-white">
        <Section title="เทมเพลตเอกสาร">
          <select {...register("templateId")} className={inputClass}>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </Section>

        <Section title="ข้อมูลผู้เสนอราคา (บริษัท)">
          <div className="grid grid-cols-2 gap-3">
            <Field label="ชื่อบริษัท / ร้าน" span={2}>
              <input {...register("company.name")} className={inputClass} />
            </Field>
            <Field label="คำอธิบาย/สโลแกน" span={2}>
              <input {...register("company.description")} className={inputClass} />
            </Field>
            <Field label="สาขา">
              <input {...register("company.branch")} className={inputClass} />
            </Field>
            <Field label="เลขผู้เสียภาษี">
              <input {...register("company.taxId")} className={inputClass} />
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
            <Field label="Facebook">
              <input {...register("company.facebook")} className={inputClass} />
            </Field>
            <Field label="LINE">
              <input {...register("company.line")} className={inputClass} />
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

        <Section title="ข้อมูลโครงการ (ถ้ามี)">
          <div className="grid grid-cols-2 gap-3">
            <Field label="ชื่อโครงการ">
              <input {...register("project.name")} className={inputClass} />
            </Field>
            <Field label="สถานที่โครงการ">
              <input {...register("project.address")} className={inputClass} />
            </Field>
          </div>
        </Section>

        <Section title="ข้อมูลเอกสาร">
          <div className="grid grid-cols-2 gap-3">
            <Field label="เลขที่อ้างอิง">
              <input {...register("referenceNumber")} className={inputClass} />
            </Field>
            <Field label="พนักงานขาย">
              <input {...register("salesPerson")} className={inputClass} />
            </Field>
            <Field label="วันที่เสนอราคา">
              <input type="date" {...register("issueDate")} className={inputClass} />
            </Field>
            <Field label="วันครบกำหนด">
              <input type="date" {...register("dueDate")} className={inputClass} />
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
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("withholdingTaxEnabled")} />
              หัก ณ ที่จ่าย
            </label>
          </div>
        </Section>

        <Section title="รายการเสนอราคา">
          <QuotationItemsFieldArray />
        </Section>

        <Section title="เงื่อนไขและหมายเหตุ">
          <Field label="เงื่อนไขการชำระเงิน (บรรทัดละ 1 ข้อ)" span={2}>
            <LineListTextarea
              name="conditions.paymentTerms"
              control={form.control}
              placeholder="มัดจำ 50% ก่อนเริ่มงาน"
            />
          </Field>
          <Field label="หมายเหตุ (บรรทัดละ 1 ข้อ)" span={2}>
            <LineListTextarea
              name="conditions.remarkBullets"
              control={form.control}
              placeholder="ราคานี้รวมค่าแรงและวัสดุอุปกรณ์แล้ว"
            />
          </Field>
          <Field label="การรับประกัน">
            <input {...register("conditions.warranty")} className={inputClass} />
          </Field>
        </Section>

        <Section title="ลายเซ็นผู้เสนอราคา">
          <Field label="ชื่อผู้เสนอราคา">
            <input {...register("signature.preparedByName")} className={inputClass} />
          </Field>
        </Section>
      </form>
    </FormProvider>
  );
}
