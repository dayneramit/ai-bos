"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { receiptFormSchema, type ReceiptFormValues } from "@/lib/validation/receipt-schema";
import {
  createDefaultReceiptFormValues,
  formValuesToReceipt,
  receiptToFormValues,
} from "@/lib/receipt-mapper";
import type { Receipt } from "@/types/receipt";
import { ReceiptForm } from "./ReceiptForm";
import { ReceiptDocument } from "./ReceiptDocument";
import { EditorToolbar } from "@/components/quotation/EditorToolbar";
import { useReceiptAutosave } from "@/hooks/useReceiptAutosave";
import { useDocumentHistory } from "@/hooks/useDocumentHistory";
import { receiptRepository, createBlankReceiptId } from "@/services/receipt.service";

const ZOOM_STEP = 0.1;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;

interface ReceiptEditorProps {
  initialReceipt?: Receipt;
}

export function ReceiptEditor({ initialReceipt }: ReceiptEditorProps) {
  const router = useRouter();
  const [zoom, setZoom] = useState(0.75);

  const receiptId = useMemo(() => initialReceipt?.id ?? createBlankReceiptId(), [initialReceipt]);
  const [documentNumber, setDocumentNumber] = useState(initialReceipt?.documentNumber ?? "");
  const createdAt = useMemo(() => initialReceipt?.createdAt ?? new Date().toISOString(), [initialReceipt]);

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptFormSchema),
    defaultValues: initialReceipt ? receiptToFormValues(initialReceipt) : createDefaultReceiptFormValues(),
    mode: "onBlur",
  });

  useEffect(() => {
    if (initialReceipt) return;
    receiptRepository
      .nextDocumentNumber(new Date())
      .then(setDocumentNumber)
      .catch(() => setDocumentNumber(""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const values = form.watch();

  const receipt: Receipt | null = documentNumber
    ? formValuesToReceipt(values, {
        id: receiptId,
        documentNumber,
        createdAt,
        paper: initialReceipt?.paper ?? { size: "A4", orientation: "portrait" },
        attachments: initialReceipt?.attachments,
      })
    : null;

  const autosaveStatus = useReceiptAutosave(receipt, Boolean(receipt));

  const history = useDocumentHistory<ReceiptFormValues>({
    onRestore: (snapshot) => form.reset(snapshot, { keepDefaultValues: false }),
  });

  function handlePrint() {
    if (!receipt) return;
    receiptRepository.save(receipt).then(() => {
      router.push(`/receipt/${receipt.id}/preview`);
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
          <ReceiptForm form={form} />
        </div>

        <div className="flex-1 overflow-auto bg-[#2b2b2b] p-10">
          <div
            className="mx-auto origin-top transition-transform"
            style={{ transform: `scale(${zoom})`, width: "210mm" }}
          >
            {receipt ? <ReceiptDocument receipt={receipt} mode="preview" /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
