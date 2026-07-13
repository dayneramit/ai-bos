import { CalendarRange, CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import type { WarrantyCoverageItem } from "@/types/warranty";
import { formatThaiBuddhistDate } from "@/lib/thai-calendar/thai-calendar";

interface WarrantyDetailsProps {
  coverageItems: WarrantyCoverageItem[];
  installDate: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyPeriodLabel: string;
  coverageBullets: string[];
  exclusionBullets: string[];
  showExclusions: boolean;
}

export function WarrantyDetails({
  coverageItems,
  installDate,
  warrantyStartDate,
  warrantyEndDate,
  warrantyPeriodLabel,
  coverageBullets,
  exclusionBullets,
  showExclusions,
}: WarrantyDetailsProps) {
  return (
    <div className="space-y-5 px-10 pt-6">
      <div className="overflow-hidden rounded-xl border border-doc-border">
        <div className="bg-doc-ink px-5 py-2.5">
          <h3 className="font-heading text-sm font-semibold text-white">
            รายการสินค้า / บริการที่รับประกัน
          </h3>
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr style={{ background: "var(--doc-gold-gradient)" }}>
              <th className="w-12 py-2.5 text-center font-heading font-semibold text-doc-ink">ลำดับ</th>
              <th className="py-2.5 text-left font-heading font-semibold text-doc-ink">รายการ</th>
              <th className="w-40 py-2.5 text-left font-heading font-semibold text-doc-ink">
                รุ่น / Serial
              </th>
              <th className="w-20 py-2.5 text-center font-heading font-semibold text-doc-ink">จำนวน</th>
            </tr>
          </thead>
          <tbody>
            {coverageItems.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-doc-paper-muted"}>
                <td className="px-2 py-3 text-center text-doc-ink">{index + 1}</td>
                <td className="px-2 py-3 font-medium text-doc-ink">{item.productOrService}</td>
                <td className="px-2 py-3 text-doc-text-muted">{item.modelOrSerial || "-"}</td>
                <td className="px-2 py-3 text-center text-doc-ink">{item.quantity ?? 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-doc-border bg-doc-paper p-5">
        <div className="mb-3 flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-white"
            style={{ background: "var(--doc-gold-500)" }}
          >
            <CalendarRange className="h-4 w-4" />
          </span>
          <h3 className="font-heading text-sm font-semibold text-doc-ink">ระยะเวลารับประกัน</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-doc-text-muted">วันที่ส่งมอบ/ติดตั้ง</p>
            <p className="font-medium text-doc-ink">{formatThaiBuddhistDate(installDate)}</p>
          </div>
          <div>
            <p className="text-doc-text-muted">เริ่มความคุ้มครอง</p>
            <p className="font-medium text-doc-ink">{formatThaiBuddhistDate(warrantyStartDate)}</p>
          </div>
          <div>
            <p className="text-doc-text-muted">สิ้นสุดความคุ้มครอง</p>
            <p className="font-medium text-doc-ink">{formatThaiBuddhistDate(warrantyEndDate)}</p>
          </div>
        </div>
        <div
          className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-doc-ink"
          style={{ background: "var(--doc-gold-gradient)" }}
        >
          <ShieldCheck className="h-4 w-4" />
          รับประกัน {warrantyPeriodLabel}
        </div>
      </div>

      <div className="flex gap-5">
        <div className="flex-1 rounded-xl border border-doc-border bg-doc-paper p-5">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" style={{ color: "var(--doc-gold-500)" }} />
            <h3 className="font-heading text-sm font-semibold text-doc-ink">ความคุ้มครอง</h3>
          </div>
          <ul className="space-y-1 text-xs text-doc-text-muted">
            {coverageBullets.map((line) => (
              <li key={line} className="flex gap-1.5">
                <span aria-hidden>•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        {showExclusions ? (
          <div className="flex-1 rounded-xl border border-doc-border bg-doc-paper p-5">
            <div className="mb-2 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <h3 className="font-heading text-sm font-semibold text-doc-ink">
                ข้อยกเว้น / เงื่อนไขที่ทำให้การรับประกันสิ้นสุด
              </h3>
            </div>
            <ul className="space-y-1 text-xs text-doc-text-muted">
              {exclusionBullets.map((line) => (
                <li key={line} className="flex gap-1.5">
                  <span aria-hidden>•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
