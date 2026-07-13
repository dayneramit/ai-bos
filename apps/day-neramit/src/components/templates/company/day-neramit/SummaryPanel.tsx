import { ClipboardList } from "lucide-react";
import type { QuotationTotals } from "@/types/quotation";
import { formatThb } from "@/lib/utils";

interface SummaryPanelProps {
  remarkBullets: string[];
  totals: QuotationTotals;
  showVat: boolean;
  vatRatePercent: number;
}

export function SummaryPanel({
  remarkBullets,
  totals,
  showVat,
  vatRatePercent,
}: SummaryPanelProps) {
  return (
    <div className="flex gap-5 px-10 pt-5">
      {remarkBullets.length > 0 ? (
        <div className="flex-1 rounded-xl border border-doc-border bg-doc-paper p-5">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-white"
              style={{ background: "var(--doc-gold-500)" }}
            >
              <ClipboardList className="h-4 w-4" />
            </span>
            <h3 className="font-heading text-sm font-semibold text-doc-ink">หมายเหตุ</h3>
          </div>
          <ul className="space-y-1 text-xs text-doc-text-muted">
            {remarkBullets.map((line) => (
              <li key={line} className="flex gap-1.5">
                <span aria-hidden>•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="w-80 shrink-0 overflow-hidden rounded-xl border border-doc-border">
        <div className="flex items-center justify-between bg-doc-paper px-5 py-2.5 text-sm">
          <span className="text-doc-text-muted">รวมราคาสินค้า/บริการ</span>
          <span className="font-medium text-doc-ink">{formatThb(totals.subtotal)}</span>
        </div>
        {showVat ? (
          <div className="flex items-center justify-between bg-doc-paper-muted px-5 py-2.5 text-sm">
            <span className="text-doc-text-muted">ภาษีมูลค่าเพิ่ม {vatRatePercent}%</span>
            <span className="font-medium text-doc-ink">{formatThb(totals.vatAmount)}</span>
          </div>
        ) : null}
        {totals.withholdingTaxAmount > 0 ? (
          <div className="flex items-center justify-between bg-doc-paper px-5 py-2.5 text-sm">
            <span className="text-doc-text-muted">หัก ณ ที่จ่าย</span>
            <span className="font-medium text-doc-ink">
              -{formatThb(totals.withholdingTaxAmount)}
            </span>
          </div>
        ) : null}
        <div className="flex items-center justify-between bg-doc-ink px-5 py-3">
          <span className="font-heading text-sm font-semibold text-white">
            รวมเป็นเงินทั้งสิ้น
          </span>
          <span
            className="font-heading text-lg font-bold"
            style={{ color: "var(--doc-gold-400)" }}
          >
            {formatThb(totals.grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
