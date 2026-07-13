import type { QuotationItem } from "@/types/quotation";
import { calculateLineAmount } from "@/lib/calculations/quotation-calculations";
import { formatThb } from "@/lib/utils";

interface ItemsTableProps {
  items: QuotationItem[];
  showDiscountColumn: boolean;
  startIndex: number;
}

export function ItemsTable({ items, showDiscountColumn, startIndex }: ItemsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-doc-border">
      <div className="bg-doc-ink px-5 py-2.5">
        <h3 className="font-heading text-sm font-semibold text-white">รายการเสนอราคา</h3>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr style={{ background: "var(--doc-gold-gradient)" }}>
            <th className="w-12 py-2.5 text-center font-heading font-semibold text-doc-ink">
              ลำดับ
            </th>
            <th className="w-40 py-2.5 text-left font-heading font-semibold text-doc-ink">
              รายการ
            </th>
            <th className="py-2.5 text-left font-heading font-semibold text-doc-ink">
              รายละเอียด
            </th>
            <th className="w-16 py-2.5 text-center font-heading font-semibold text-doc-ink">
              จำนวน
            </th>
            <th className="w-16 py-2.5 text-center font-heading font-semibold text-doc-ink">
              หน่วย
            </th>
            <th className="w-28 py-2.5 text-center font-heading font-semibold text-doc-ink">
              ราคาต่อหน่วย
              <br />
              (บาท)
            </th>
            {showDiscountColumn ? (
              <th className="w-24 py-2.5 text-center font-heading font-semibold text-doc-ink">
                ส่วนลด
                <br />
                (บาท)
              </th>
            ) : null}
            <th className="w-28 py-2.5 text-center font-heading font-semibold text-doc-ink">
              จำนวนเงิน
              <br />
              (บาท)
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.id}
              className={index % 2 === 0 ? "bg-white" : "bg-doc-paper-muted"}
            >
              <td className="px-2 py-3 text-center align-top text-doc-ink">
                {startIndex + index + 1}
              </td>
              <td className="px-2 py-3 align-top font-medium text-doc-ink">
                {item.description}
              </td>
              <td className="px-2 py-3 align-top text-doc-text-muted">{item.detail}</td>
              <td className="px-2 py-3 text-center align-top text-doc-ink">
                {item.quantity}
              </td>
              <td className="px-2 py-3 text-center align-top text-doc-ink">{item.unit}</td>
              <td className="px-2 py-3 text-right align-top text-doc-ink">
                {formatThb(item.unitPrice)}
              </td>
              {showDiscountColumn ? (
                <td className="px-2 py-3 text-right align-top text-doc-ink">
                  {item.discount ? formatThb(item.discount) : "-"}
                </td>
              ) : null}
              <td className="px-2 py-3 text-right align-top font-medium text-doc-ink">
                {formatThb(calculateLineAmount(item))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
