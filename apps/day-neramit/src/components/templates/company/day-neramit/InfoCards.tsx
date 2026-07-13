import { Mail, MapPin, Phone, User } from "lucide-react";
import type { CompanyProfile, CustomerProfile, ProjectInfo } from "@/types/party";
import { cn } from "@/lib/utils";

function CardShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 rounded-xl border border-doc-border bg-doc-paper p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 border-b border-doc-border pb-3">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-white"
          style={{ background: "var(--doc-gold-500)" }}
        >
          <User className="h-4 w-4" />
        </span>
        <h2 className="font-heading text-base font-semibold text-doc-ink">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm text-doc-ink/80">
      <span className="text-doc-gold-500" style={{ color: "var(--doc-gold-500)" }}>
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}

function LabelValueRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex text-sm">
      <span className="w-24 shrink-0 text-doc-text-muted">{label}</span>
      <span className="text-doc-ink">: {value && value.length > 0 ? value : "-"}</span>
    </div>
  );
}

interface InfoCardsProps {
  company: CompanyProfile;
  customer: CustomerProfile;
  project?: ProjectInfo;
  showCustomerTaxId: boolean;
  showProject: boolean;
}

export function InfoCards({
  company,
  customer,
  project,
  showCustomerTaxId,
  showProject,
}: InfoCardsProps) {
  return (
    <div className="flex gap-5 px-10 pt-6">
      <CardShell title="ข้อมูลผู้เสนอราคา">
        <p className="font-heading text-base font-semibold text-doc-ink">{company.name}</p>
        {company.description ? (
          <p className="mb-2 text-xs text-doc-text-muted">{company.description}</p>
        ) : null}
        <div className={cn("mt-2 space-y-1")}>
          {company.phone ? <InfoRow icon={<Phone className="h-3.5 w-3.5" />}>{company.phone}</InfoRow> : null}
          {company.email ? <InfoRow icon={<Mail className="h-3.5 w-3.5" />}>{company.email}</InfoRow> : null}
          {company.address ? <InfoRow icon={<MapPin className="h-3.5 w-3.5" />}>{company.address}</InfoRow> : null}
        </div>
      </CardShell>

      <CardShell title="ข้อมูลลูกค้า">
        <div className="space-y-1.5">
          <LabelValueRow label="ชื่อ" value={customer.name} />
          <LabelValueRow label="เบอร์โทร" value={customer.phone} />
          <LabelValueRow label="ที่อยู่" value={customer.address} />
          {showCustomerTaxId ? <LabelValueRow label="เลขผู้เสียภาษี" value={customer.taxId} /> : null}
          {showProject ? (
            <>
              <LabelValueRow label="ชื่อโครงการ" value={project?.name} />
              <LabelValueRow label="สถานที่" value={project?.address} />
            </>
          ) : null}
        </div>
      </CardShell>
    </div>
  );
}
