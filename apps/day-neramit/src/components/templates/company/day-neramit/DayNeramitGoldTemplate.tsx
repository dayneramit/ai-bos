import { Droplet, Flame, Hammer, PaintRoller, Snowflake, Video } from "lucide-react";
import { DocumentShell } from "@/components/document/DocumentShell";
import { WatermarkLayer } from "@/components/document/WatermarkLayer";
import { PageFooter } from "@/components/document/PageFooter";
import { HeaderBanner, type CategoryChip } from "./HeaderBanner";
import { InfoCards } from "./InfoCards";
import { ItemsTable } from "./ItemsTable";
import { SummaryPanel } from "./SummaryPanel";
import { ContactAndPayment } from "./ContactAndPayment";
import { FooterBand } from "./FooterBand";
import type { QuotationTemplateProps } from "@/types/template";
import { formatThaiBuddhistDate } from "@/lib/thai-calendar/thai-calendar";
import { calculateQuotationTotals } from "@/lib/calculations/quotation-calculations";
import { nonEmptyItems } from "@/lib/document-visibility";

const SERVICE_CATEGORY_CHIPS: CategoryChip[] = [
  { icon: <Snowflake className="h-5 w-5" />, label: "แอร์" },
  { icon: <Video className="h-5 w-5" />, label: "กล้องวงจรปิด" },
  { icon: <Flame className="h-5 w-5" />, label: "ไฟฟ้า" },
  { icon: <Droplet className="h-5 w-5" />, label: "ประปา" },
  { icon: <Hammer className="h-5 w-5" />, label: "รีโนเวท" },
  { icon: <PaintRoller className="h-5 w-5" />, label: "ทาสี" },
];

const FIRST_PAGE_ROW_CAPACITY = 5;
const NEXT_PAGE_ROW_CAPACITY = 12;

function chunkItemsIntoPages<T>(items: T[]): T[][] {
  if (items.length <= FIRST_PAGE_ROW_CAPACITY) return [items];

  const pages: T[][] = [items.slice(0, FIRST_PAGE_ROW_CAPACITY)];
  let cursor = FIRST_PAGE_ROW_CAPACITY;
  while (cursor < items.length) {
    pages.push(items.slice(cursor, cursor + NEXT_PAGE_ROW_CAPACITY));
    cursor += NEXT_PAGE_ROW_CAPACITY;
  }
  return pages;
}

export function DayNeramitGoldTemplate({ quotation, visibility, mode }: QuotationTemplateProps) {
  const items = nonEmptyItems(quotation);
  const pages = chunkItemsIntoPages(items);
  const pageCount = pages.length;

  const totals = calculateQuotationTotals(items, {
    vatEnabled: quotation.vatEnabled,
    vatRate: quotation.vatRate,
    withholdingTaxEnabled: quotation.withholdingTaxEnabled,
    withholdingTaxRate: quotation.withholdingTaxRate,
  });

  let rowsSoFar = 0;

  return (
    <>
      {pages.map((pageItems, pageIndex) => {
        const isLastPage = pageIndex === pageCount - 1;
        const startIndex = rowsSoFar;
        rowsSoFar += pageItems.length;

        return (
          <DocumentShell key={pageIndex} paper={quotation.paper} mode={mode} className="mb-8 flex flex-col">
            <WatermarkLayer watermark={quotation.watermark} />

            <HeaderBanner
              company={quotation.company}
              documentTitle="ใบเสนอราคา"
              dateLabel="วันที่เสนอราคา"
              dateValue={formatThaiBuddhistDate(quotation.issueDate)}
              showLogo={visibility.showLogo}
              categoryChips={pageIndex === 0 ? SERVICE_CATEGORY_CHIPS : undefined}
            />

            {pageIndex === 0 ? (
              <InfoCards
                company={quotation.company}
                customer={quotation.customer}
                project={quotation.project}
                showCustomerTaxId={visibility.showCustomerTaxId}
                showProject={visibility.showProject}
              />
            ) : null}

            <div className="px-10 pt-5">
              <ItemsTable
                items={pageItems}
                showDiscountColumn={visibility.showDiscountColumn}
                startIndex={startIndex}
              />
            </div>

            {isLastPage ? (
              <>
                <SummaryPanel
                  remarkBullets={quotation.conditions?.remarkBullets ?? []}
                  totals={totals}
                  showVat={visibility.showVat}
                  vatRatePercent={Math.round(quotation.vatRate * 100)}
                />
                <ContactAndPayment
                  company={quotation.company}
                  paymentTerms={quotation.conditions?.paymentTerms ?? []}
                />
                <FooterBand
                  signature={quotation.signature}
                  showSignature={visibility.showSignature}
                  showStamp={visibility.showStamp}
                  showPromptPay={visibility.showPromptPay}
                  promptPayId={quotation.company.promptPayId}
                  grandTotal={totals.grandTotal}
                />
              </>
            ) : null}

            <div className="mt-auto">
              <PageFooter
                pageNumber={pageIndex + 1}
                pageCount={pageCount}
                documentNumber={quotation.documentNumber}
              />
            </div>
          </DocumentShell>
        );
      })}
    </>
  );
}
