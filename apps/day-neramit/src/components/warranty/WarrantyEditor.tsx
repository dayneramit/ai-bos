"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { warrantyFormSchema, type WarrantyFormValues } from "@/lib/validation/warranty-schema";
import {
  createDefaultWarrantyFormValues,
  formValuesToWarranty,
  warrantyToFormValues,
} from "@/lib/warranty-mapper";
import type { WarrantyCertificate } from "@/types/warranty";
import { WarrantyForm } from "./WarrantyForm";
import { WarrantyDocument } from "./WarrantyDocument";
import { EditorToolbar } from "@/components/quotation/EditorToolbar";
import { useWarrantyAutosave } from "@/hooks/useWarrantyAutosave";
import { useDocumentHistory } from "@/hooks/useDocumentHistory";
import { warrantyRepository, createBlankWarrantyId } from "@/services/warranty.service";

const ZOOM_STEP = 0.1;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;

interface WarrantyEditorProps {
  initialWarranty?: WarrantyCertificate;
}

export function WarrantyEditor({ initialWarranty }: WarrantyEditorProps) {
  const router = useRouter();
  const [zoom, setZoom] = useState(0.75);

  const warrantyId = useMemo(
    () => initialWarranty?.id ?? createBlankWarrantyId(),
    [initialWarranty]
  );
  const [documentNumber, setDocumentNumber] = useState(initialWarranty?.documentNumber ?? "");
  const createdAt = useMemo(
    () => initialWarranty?.createdAt ?? new Date().toISOString(),
    [initialWarranty]
  );

  const form = useForm<WarrantyFormValues>({
    resolver: zodResolver(warrantyFormSchema),
    defaultValues: initialWarranty
      ? warrantyToFormValues(initialWarranty)
      : createDefaultWarrantyFormValues(),
    mode: "onBlur",
  });

  useEffect(() => {
    if (initialWarranty) return;
    warrantyRepository
      .nextDocumentNumber(new Date())
      .then(setDocumentNumber)
      .catch(() => setDocumentNumber(""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const values = form.watch();

  const warranty: WarrantyCertificate | null = documentNumber
    ? formValuesToWarranty(values, {
        id: warrantyId,
        documentNumber,
        createdAt,
        paper: initialWarranty?.paper ?? { size: "A4", orientation: "portrait" },
        attachments: initialWarranty?.attachments,
      })
    : null;

  const autosaveStatus = useWarrantyAutosave(warranty, Boolean(warranty));

  const history = useDocumentHistory<WarrantyFormValues>({
    onRestore: (snapshot) => form.reset(snapshot, { keepDefaultValues: false }),
  });

  function handlePrint() {
    if (!warranty) return;
    warrantyRepository.save(warranty).then(() => {
      router.push(`/warranty/${warranty.id}/preview`);
    });
  }

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0a]">
      <EditorToolbar
        documentNumber={documentNumber || "กำลังสร้างเลขที่เอกสาร..."}
        autosaveStatus={autosaveStatus}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
        onZoomOut={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
        onUndo={() => history.undo(form.getValues())}
        onRedo={() => history.redo(form.getValues())}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onPrint={handlePrint}
      />

      <div className="flex flex-1 overflow-hidden">
        <div
          className="w-[420px] shrink-0 overflow-y-auto bg-[#0a0a0a]"
          onBlurCapture={() => history.push(form.getValues())}
        >
          <WarrantyForm form={form} />
        </div>

        <div className="flex-1 overflow-auto bg-[#2b2b2b] p-10">
          <div
            className="mx-auto origin-top transition-transform"
            style={{ transform: `scale(${zoom})`, width: "210mm" }}
          >
            {warranty ? <WarrantyDocument warranty={warranty} mode="preview" /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
