"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { WarrantyEditor } from "@/components/warranty/WarrantyEditor";
import { warrantyRepository } from "@/services/warranty.service";
import type { WarrantyCertificate } from "@/types/warranty";

export default function EditWarrantyPage() {
  const params = useParams<{ id: string }>();
  const [warranty, setWarranty] = useState<WarrantyCertificate | null | undefined>(undefined);

  useEffect(() => {
    warrantyRepository.get(params.id).then(setWarranty);
  }, [params.id]);

  if (warranty === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white/60">
        กำลังโหลดเอกสาร...
      </div>
    );
  }

  if (warranty === null) {
    notFound();
  }

  return <WarrantyEditor initialWarranty={warranty} />;
}
