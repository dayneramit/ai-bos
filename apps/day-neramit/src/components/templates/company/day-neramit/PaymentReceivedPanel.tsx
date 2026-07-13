import { BadgeCheck, CalendarClock, Landmark, ReceiptText } from "lucide-react";
import type { PaymentDetails } from "@/types/receipt";
import { PAYMENT_METHOD_LABEL } from "@/types/receipt";
import { formatThaiBuddhistDate } from "@/lib/thai-calendar/thai-calendar";

interface PaymentReceivedPanelProps {
  payment: PaymentDetails;
  showReferenceDocument: boolean;
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-doc-ink/80">
      <span style={{ color: "var(--doc-gold-500)" }}>{icon}</span>
      <span className="text-doc-text-muted">{label}</span>
      <span className="font-medium text-doc-ink">{value}</span>
    </div>
  );
}

export function PaymentReceivedPanel({ payment, showReferenceDocument }: PaymentReceivedPanelProps) {
  return (
    <div className="flex gap-5 px-10 pt-5">
      <div className="flex-1 rounded-xl border border-doc-border bg-doc-paper p-5">
        <div className="mb-2 flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-white"
            style={{ background: "var(--doc-gold-500)" }}
          >
            <BadgeCheck className="h-4 w-4" />
          </span>
          <h3 className="font-heading text-sm font-semibold text-doc-ink">รายละเอียดการชำระเงิน</h3>
        </div>
        <div className="space-y-1.5">
          <Row
            icon={<Landmark className="h-3.5 w-3.5" />}
            label="ช่องทางชำระเงิน"
            value={PAYMENT_METHOD_LABEL[payment.method]}
          />
          <Row
            icon={<CalendarClock className="h-3.5 w-3.5" />}
            label="วันที่ชำระเงิน"
            value={formatThaiBuddhistDate(payment.paidAt)}
          />
          {payment.bankName ? (
            <Row icon={<Landmark className="h-3.5 w-3.5" />} label="ธนาคาร" value={payment.bankName} />
          ) : null}
          {payment.chequeNumber ? (
            <Row icon={<ReceiptText className="h-3.5 w-3.5" />} label="เลขที่เช็ค" value={payment.chequeNumber} />
          ) : null}
          {showReferenceDocument ? (
            <Row
              icon={<ReceiptText className="h-3.5 w-3.5" />}
              label="อ้างอิงเอกสาร"
              value={payment.referenceDocumentNumber}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
