"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { QuotationFormValues } from "@/lib/validation/quotation-schema";

export function QuotationItemsFieldArray() {
  const { control, register, formState } = useFormContext<QuotationFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">รายการเสนอราคา (ไม่จำกัดจำนวน)</h3>
        <button
          type="button"
          onClick={() =>
            append({
              id: uuidv4(),
              description: "",
              detail: "",
              quantity: 1,
              unit: "งาน",
              unitPrice: 0,
              discount: 0,
            })
          }
          className="flex items-center gap-1 rounded-md bg-doc-gold-500 px-3 py-1.5 text-xs font-medium text-doc-ink hover:brightness-110"
          style={{ background: "var(--doc-gold-500)" }}
        >
          <Plus className="h-3.5 w-3.5" />
          เพิ่มรายการ
        </button>
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-12 gap-2 rounded-md border border-white/10 bg-white/5 p-3"
          >
            <div className="col-span-12">
              <input
                {...register(`items.${index}.description`)}
                placeholder="รายการ เช่น งานปรับปรุงท่อน้ำ"
                className="w-full rounded bg-white/10 px-2 py-1.5 text-sm text-white placeholder:text-white/40"
              />
            </div>
            <div className="col-span-12">
              <input
                {...register(`items.${index}.detail`)}
                placeholder="รายละเอียดเพิ่มเติม"
                className="w-full rounded bg-white/10 px-2 py-1.5 text-sm text-white placeholder:text-white/40"
              />
            </div>
            <div className="col-span-3">
              <label className="mb-1 block text-[10px] text-white/50">จำนวน</label>
              <input
                type="number"
                step="any"
                {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                className="w-full rounded bg-white/10 px-2 py-1.5 text-sm text-white"
              />
            </div>
            <div className="col-span-3">
              <label className="mb-1 block text-[10px] text-white/50">หน่วย</label>
              <input
                {...register(`items.${index}.unit`)}
                className="w-full rounded bg-white/10 px-2 py-1.5 text-sm text-white"
              />
            </div>
            <div className="col-span-3">
              <label className="mb-1 block text-[10px] text-white/50">ราคาต่อหน่วย</label>
              <input
                type="number"
                step="any"
                {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                className="w-full rounded bg-white/10 px-2 py-1.5 text-sm text-white"
              />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-[10px] text-white/50">ส่วนลด</label>
              <input
                type="number"
                step="any"
                {...register(`items.${index}.discount`, { valueAsNumber: true })}
                className="w-full rounded bg-white/10 px-2 py-1.5 text-sm text-white"
              />
            </div>
            <div className="col-span-1 flex items-end justify-end">
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="ลบรายการ"
                className="rounded p-1.5 text-white/50 hover:bg-red-500/20 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {formState.errors.items?.[index] ? (
              <p className="col-span-12 text-[11px] text-red-400">
                {formState.errors.items[index]?.description?.message ||
                  formState.errors.items[index]?.quantity?.message ||
                  formState.errors.items[index]?.unitPrice?.message}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {formState.errors.items?.root ? (
        <p className="text-xs text-red-400">{formState.errors.items.root.message}</p>
      ) : null}
    </div>
  );
}
