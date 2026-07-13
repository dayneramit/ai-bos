import { FileText, Mail, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";
import type { CompanyProfile } from "@/types/party";

function IconRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs text-doc-ink/80">
      <span style={{ color: "var(--doc-gold-500)" }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}

interface ContactAndPaymentProps {
  company: CompanyProfile;
  paymentTerms: string[];
}

export function ContactAndPayment({ company, paymentTerms }: ContactAndPaymentProps) {
  return (
    <div className="flex gap-5 px-10 pt-5">
      <div className="flex-1 rounded-xl border border-doc-border bg-doc-paper p-5">
        <div className="mb-2 flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-white"
            style={{ background: "var(--doc-gold-500)" }}
          >
            <Share2 className="h-4 w-4" />
          </span>
          <h3 className="font-heading text-sm font-semibold text-doc-ink">
            ช่องทางการติดต่อ
          </h3>
        </div>
        <div className="space-y-1.5">
          {company.phone ? <IconRow icon={<Phone className="h-3.5 w-3.5" />}>{company.phone}</IconRow> : null}
          {company.email ? <IconRow icon={<Mail className="h-3.5 w-3.5" />}>{company.email}</IconRow> : null}
          {company.address ? <IconRow icon={<MapPin className="h-3.5 w-3.5" />}>{company.address}</IconRow> : null}
          {company.facebook ? (
            <IconRow icon={<Share2 className="h-3.5 w-3.5" />}>Facebook / {company.facebook}</IconRow>
          ) : null}
          {company.line ? (
            <IconRow icon={<MessageCircle className="h-3.5 w-3.5" />}>LINE / {company.line}</IconRow>
          ) : null}
        </div>
      </div>

      {paymentTerms.length > 0 ? (
        <div className="flex-1 rounded-xl border border-doc-border bg-doc-paper p-5">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-white"
              style={{ background: "var(--doc-gold-500)" }}
            >
              <FileText className="h-4 w-4" />
            </span>
            <h3 className="font-heading text-sm font-semibold text-doc-ink">
              เงื่อนไขการชำระเงิน
            </h3>
          </div>
          <ul className="space-y-1 text-xs text-doc-text-muted">
            {paymentTerms.map((line) => (
              <li key={line} className="flex gap-1.5">
                <span aria-hidden>•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
