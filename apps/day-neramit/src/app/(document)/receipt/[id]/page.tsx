"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { ReceiptEditor } from "@/components/receipt/ReceiptEditor";
import { receiptRepository } from "@/services/receipt.service";
import type { Receipt } from "@/types/receipt";

export default function EditReceiptPage() {
  const params = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<Receipt | null | undefined>(undefined);

  useEffect(() => {
    receiptRepository.get(params.id).then(setReceipt);
  }, [params.id]);

  if (receipt === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white/60">
        กำลังโหลดเอกสาร...
      </div>
    );
  }

  if (receipt === null) {
    notFound();
  }

  return <ReceiptEditor initialReceipt={receipt} />;
}
