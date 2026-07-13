"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  quotationFormSchema,
  type QuotationFormValues,
} from "@/lib/validation/quotation-schema";
import {
  createDefaultQuotationFormValues,
  formValuesToQuotation,
  quotationToFormValues,
} from "@/lib/quotation-mapper";
import type { Quotation } from "@/types/quotation";
import { QuotationForm } from "./QuotationForm";
import { QuotationDocument } from "./QuotationDocument";
import { EditorToolbar } from "./EditorToolbar";
import { useDocumentAutosave } from "@/hooks/useDocumentAutosave";
import { useDocumentHistory } from "@/hooks/useDocumentHistory";
import { quotationRepository, createBlankQuotationId } from "@/services/document.service";

const ZOOM_STEP = 0.1;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;

interface QuotationEditorProps {
  initialQuotation?: Quotation;
}

export function QuotationEditor({ initialQuotation }: QuotationEditorProps) {
  const router = useRouter();
  const [zoom, setZoom] = useState(0.75);

  const quotationId = useMemo(
    () => initialQuotation?.id ?? createBlankQuotationId(),
    [initialQuotation]
  );
  const [documentNumber, setDocumentNumber] = useState(
    initialQuotation?.documentNumber ?? ""
  );
  const createdAt = useMemo(
    () => initialQuotation?.createdAt ?? new Date().toISOString(),
    [initialQuotation]
  );

  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: initialQuotation
      ? quotationToFormValues(initialQuotation)
      : createDefaultQuotationFormValues(),
    mode: "onBlur",
  });

  // Assign a running document number on first mount for brand-new quotations.
  useEffect(() => {
    if (initialQuotation) return;
    quotationRepository
      .nextDocumentNumber(new Date())
      .then(setDocumentNumber)
      .catch(() => setDocumentNumber(""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const values = form.watch();

  const quotation: Quotation | null = documentNumber
    ? formValuesToQuotation(values, {
        id: quotationId,
        documentNumber,
        createdAt,
        paper: initialQuotation?.paper ?? { size: "A4", orientation: "portrait" },
        attachments: initialQuotation?.attachments,
        quotationAttachments: initialQuotation?.quotationAttachments,
      })
    : null;

  const autosaveStatus = useDocumentAutosave(quotation, Boolean(quotation));

  const history = useDocumentHistory<QuotationFormValues>({
    onRestore: (snapshot) => form.reset(snapshot, { keepDefaultValues: false }),
  });

  function handlePrint() {
    if (!quotation) return;
    quotationRepository.save(quotation).then(() => {
      router.push(`/quotation/${quotation.id}/preview`);
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
          <QuotationForm form={form} />
        </div>

        <div className="flex-1 overflow-auto bg-[#2b2b2b] p-10">
          <div
            className="mx-auto origin-top transition-transform"
            style={{ transform: `scale(${zoom})`, width: "210mm" }}
          >
            {quotation ? <QuotationDocument quotation={quotation} mode="preview" /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
