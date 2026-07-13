"use client";

import { Controller, FormProvider, type UseFormReturn } from "react-hook-form";
import type { WarrantyFormValues } from "@/lib/validation/warranty-schema";
import { WarrantyItemsFieldArray } from "./WarrantyItemsFieldArray";
import { listWarrantyTemplates } from "@/components/templates/warranty-registry";

function LineListTextarea({
  name,
  placeholder,
  control,
}: {
  name: "coverageBullets" | "exclusionBullets";
  placeholder: string;
  control: UseFormReturn<WarrantyFormValues>["control"];
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

interface WarrantyFormProps {
  form: UseFormReturn<WarrantyFormValues>;
}

export function WarrantyForm({ form }: WarrantyFormProps) {
  const { register } = form;
  const templates = listWarrantyTemplates();

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
            <Field label="สถานะเอกสาร">
              <select {...register("status")} className={inputClass}>
                <option value="draft">ฉบับร่าง (Draft)</option>
                <option value="approved">อนุมัติแล้ว (Approved)</option>
                <option value="cancelled">ยกเลิก (Cancelled)</option>
              </select>
            </Field>
            <Field label="อ้างอิงเอกสาร (เช่น เลขที่ใบเสนอราคา)" span={2}>
              <input {...register("relatedDocumentNumber")} className={inputClass} />
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

        <Section title="รายการที่รับประกัน">
          <WarrantyItemsFieldArray />
        </Section>

        <Section title="ระยะเวลารับประกัน">
          <div className="grid grid-cols-2 gap-3">
            <Field label="วันที่ส่งมอบ/ติดตั้ง">
              <input type="date" {...register("installDate")} className={inputClass} />
            </Field>
            <Field label="ป้ายระยะเวลา (เช่น 1 ปี)">
              <input {...register("warrantyPeriodLabel")} className={inputClass} />
            </Field>
            <Field label="เริ่มความคุ้มครอง">
              <input type="date" {...register("warrantyStartDate")} className={inputClass} />
            </Field>
            <Field label="สิ้นสุดความคุ้มครอง">
              <input type="date" {...register("warrantyEndDate")} className={inputClass} />
            </Field>
          </div>
        </Section>

        <Section title="เงื่อนไขความคุ้มครอง">
          <Field label="ความคุ้มครอง (บรรทัดละ 1 ข้อ)" span={2}>
            <LineListTextarea
              name="coverageBullets"
              control={form.control}
              placeholder="ครอบคลุมความเสียหายจากความบกพร่องของวัสดุ"
            />
          </Field>
          <Field label="ข้อยกเว้น (บรรทัดละ 1 ข้อ)" span={2}>
            <LineListTextarea
              name="exclusionBullets"
              control={form.control}
              placeholder="ความเสียหายจากการใช้งานผิดวิธี"
            />
          </Field>
        </Section>

        <Section title="ลายเซ็นผู้ออกเอกสาร">
          <Field label="ชื่อผู้ออกเอกสาร">
            <input {...register("signature.preparedByName")} className={inputClass} />
          </Field>
        </Section>
      </form>
    </FormProvider>
  );
}
