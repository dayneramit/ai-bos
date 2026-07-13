"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { QuotationEditor } from "@/components/quotation/QuotationEditor";
import { quotationRepository } from "@/services/document.service";
import type { Quotation } from "@/types/quotation";

/**
 * Client component: today's persistence layer (localStorage) only exists
 * in the browser. When the Firestore-backed repository lands, this can
 * become a server component using a server-side fetch instead.
 */
export default function EditQuotationPage() {
  const params = useParams<{ id: string }>();
  const [quotation, setQuotation] = useState<Quotation | null | undefined>(undefined);

  useEffect(() => {
    quotationRepository.get(params.id).then(setQuotation);
  }, [params.id]);

  if (quotation === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white/60">
        กำลังโหลดเอกสาร...
      </div>
    );
  }

  if (quotation === null) {
    notFound();
  }

  return <QuotationEditor initialQuotation={quotation} />;
}
