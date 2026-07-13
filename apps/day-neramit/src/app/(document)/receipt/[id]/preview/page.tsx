"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { ReceiptDocument } from "@/components/receipt/ReceiptDocument";
import { receiptRepository } from "@/services/receipt.service";
import type { Receipt } from "@/types/receipt";

export default function ReceiptPrintPreviewPage() {
  const params = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<Receipt | null | undefined>(undefined);

  useEffect(() => {
    receiptRepository.get(params.id).then(setReceipt);
  }, [params.id]);

  if (receipt === undefined) {
    return (
      <div className="flex h-screen items-center justify-center text-doc-text-muted">
        กำลังโหลดเอกสาร...
      </div>
    );
  }

  if (receipt === null) {
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
          href={`/receipt/${receipt.id}`}
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
        <ReceiptDocument receipt={receipt} mode="print" />
      </div>
    </div>
  );
}
