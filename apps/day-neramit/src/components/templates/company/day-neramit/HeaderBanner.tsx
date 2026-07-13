import { CalendarDays } from "lucide-react";
import type { CompanyProfile } from "@/types/party";

export interface CategoryChip {
  icon: React.ReactNode;
  label: string;
}

interface HeaderBannerProps {
  company: CompanyProfile;
  documentTitle: string;
  dateLabel: string;
  dateValue: string;
  showLogo: boolean;
  categoryChips?: CategoryChip[];
}

export function HeaderBanner({
  company,
  documentTitle,
  dateLabel,
  dateValue,
  showLogo,
  categoryChips,
}: HeaderBannerProps) {
  return (
    <div className="relative overflow-hidden" style={{ background: "var(--doc-header-gradient)" }}>
      {/* Gold diagonal accent, top-left corner */}
      <div
        className="pointer-events-none absolute -left-6 -top-6 h-24 w-24"
        style={{
          background: "var(--doc-gold-gradient)",
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
        }}
        aria-hidden
      />

      <div className="flex items-start justify-between px-10 pb-6 pt-8">
        <div className="flex items-center gap-4">
          {showLogo && company.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.logoUrl}
              alt={company.name}
              className="h-20 w-20 object-contain"
            />
          ) : (
            <div
              className="flex h-20 w-20 items-center justify-center rounded-md text-2xl font-heading font-bold text-doc-ink"
              style={{ background: "var(--doc-gold-gradient)" }}
              aria-hidden
            >
              {company.name.slice(0, 2).toLocaleUpperCase("th-TH")}
            </div>
          )}
          <div>
            <p
              className="font-heading text-2xl font-bold leading-none tracking-wide"
              style={{
                background: "var(--doc-gold-gradient)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {company.name}
            </p>
            {company.description ? (
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/70">
                {company.description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="text-right">
          <h1 className="font-heading text-4xl font-bold text-white">{documentTitle}</h1>
          <div className="mt-3 flex items-center justify-end gap-2 text-white/85">
            <CalendarDays className="h-4 w-4" style={{ color: "var(--doc-gold-400)" }} />
            <div className="text-sm">
              <p className="leading-tight text-white/60">{dateLabel}</p>
              <p className="font-medium leading-tight">{dateValue}</p>
            </div>
          </div>
        </div>
      </div>

      {categoryChips && categoryChips.length > 0 ? (
        <div className="flex items-center justify-start gap-0 border-t border-white/10 px-10 py-3">
          {categoryChips.map((chip, index) => (
            <div key={chip.label} className="flex items-center">
              {index > 0 ? <span className="mx-4 h-6 w-px bg-white/15" /> : null}
              <div className="flex flex-col items-center gap-1 text-white/85">
                <span style={{ color: "var(--doc-gold-400)" }}>{chip.icon}</span>
                <span className="text-[11px]">{chip.label}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Gold hairline separating header from paper body */}
      <div className="h-[3px] w-full" style={{ background: "var(--doc-gold-gradient)" }} />
    </div>
  );
}
