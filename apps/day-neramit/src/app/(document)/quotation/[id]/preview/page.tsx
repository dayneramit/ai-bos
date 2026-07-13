"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { QuotationDocument } from "@/components/quotation/QuotationDocument";
import { quotationRepository } from "@/services/document.service";
import type { Quotation } from "@/types/quotation";

export default function QuotationPrintPreviewPage() {
  const params = useParams<{ id: string }>();
  const [quotation, setQuotation] = useState<Quotation | null | undefined>(undefined);

  useEffect(() => {
    quotationRepository.get(params.id).then(setQuotation);
  }, [params.id]);

  if (quotation === undefined) {
    return (
      <div className="flex h-screen items-center justify-center text-doc-text-muted">
        กำลังโหลดเอกสาร...
      </div>
    );
  }

  if (quotation === null) {
    return (
      <div className="flex h-screen items-center justify-center text-doc-text-muted">
        ไม่พบเอกสารนี้
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#525659] pb-16">
      <div className="no-print sticky top-0 z-50 flex items-center justify-between bg-[#0a0a0a] px-5 py-3 text-white">
        <Link
          href={`/quotation/${quotation.id}`}
          className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับไปแก้ไข
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium text-doc-ink"
          style={{ background: "var(--doc-gold-gradient)" }}
        >
          <Printer className="h-4 w-4" />
          พิมพ์ / บันทึกเป็น PDF
        </button>
      </div>

      <div className="flex flex-col items-center gap-8 pt-10">
        <QuotationDocument quotation={quotation} mode="print" />
      </div>
    </div>
  );
}
