import { DocumentShell } from "@/components/document/DocumentShell";
import { WatermarkLayer } from "@/components/document/WatermarkLayer";
import { PageFooter } from "@/components/document/PageFooter";
import { HeaderBanner } from "./HeaderBanner";
import { InfoCards } from "./InfoCards";
import { WarrantyDetails } from "./WarrantyDetails";
import { FooterBand } from "./FooterBand";
import type { WarrantyTemplateProps } from "@/types/template";
import { formatThaiBuddhistDate } from "@/lib/thai-calendar/thai-calendar";

export function WarrantyGoldTemplate({ warranty, visibility, mode }: WarrantyTemplateProps) {
  return (
    <DocumentShell paper={warranty.paper} mode={mode} className="mb-8 flex flex-col">
      <WatermarkLayer watermark={warranty.watermark} />

      <HeaderBanner
        company={warranty.company}
        documentTitle="ใบรับประกัน"
        dateLabel="วันที่ออกเอกสาร"
        dateValue={formatThaiBuddhistDate(warranty.issueDate)}
        showLogo={visibility.showLogo}
      />

      <InfoCards
        company={warranty.company}
        customer={warranty.customer}
        showCustomerTaxId={visibility.showCustomerTaxId}
        showProject={false}
      />

      <WarrantyDetails
        coverageItems={warranty.coverageItems}
        installDate={warranty.installDate}
        warrantyStartDate={warranty.warrantyStartDate}
        warrantyEndDate={warranty.warrantyEndDate}
        warrantyPeriodLabel={warranty.warrantyPeriodLabel}
        coverageBullets={warranty.coverageBullets}
        exclusionBullets={warranty.exclusionBullets}
        showExclusions={visibility.showExclusions}
      />

      {visibility.showRelatedDocument && warranty.relatedDocumentNumber ? (
        <p className="px-10 pt-4 text-xs text-doc-text-muted">
          อ้างอิงเอกสาร: <span className="font-medium text-doc-ink">{warranty.relatedDocumentNumber}</span>
        </p>
      ) : null}

      <FooterBand
        signature={warranty.signature}
        showSignature={visibility.showSignature}
        showStamp={visibility.showStamp}
        showPromptPay={false}
        grandTotal={0}
      />

      <div className="mt-auto">
        <PageFooter pageNumber={1} pageCount={1} documentNumber={warranty.documentNumber} />
      </div>
    </DocumentShell>
  );
}
