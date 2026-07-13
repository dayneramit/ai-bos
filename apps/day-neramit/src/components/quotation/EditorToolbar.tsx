"use client";

import { Printer, Redo2, Undo2, ZoomIn, ZoomOut } from "lucide-react";
import type { AutosaveStatus } from "@/hooks/useDocumentAutosave";

const AUTOSAVE_LABEL: Record<AutosaveStatus, string> = {
  idle: "",
  saving: "กำลังบันทึก...",
  saved: "บันทึกอัตโนมัติแล้ว",
  error: "บันทึกไม่สำเร็จ",
};

interface EditorToolbarProps {
  documentNumber: string;
  autosaveStatus: AutosaveStatus;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onPrint: () => void;
}

export function EditorToolbar({
  documentNumber,
  autosaveStatus,
  zoom,
  onZoomIn,
  onZoomOut,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onPrint,
}: EditorToolbarProps) {
  return (
    <div className="no-print flex items-center justify-between border-b border-white/10 bg-[#0a0a0a] px-5 py-2.5 text-white">
      <div className="flex items-center gap-3">
        <span className="font-heading text-sm font-semibold" style={{ color: "var(--doc-gold-400)" }}>
          AI-BOS Document Engine
        </span>
        <span className="text-xs text-white/40">{documentNumber}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="rounded p-1.5 text-white/70 hover:bg-white/10 disabled:opacity-30"
          aria-label="ย้อนกลับ"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="rounded p-1.5 text-white/70 hover:bg-white/10 disabled:opacity-30"
          aria-label="ทำซ้ำ"
        >
          <Redo2 className="h-4 w-4" />
        </button>

        <div className="mx-1 h-4 w-px bg-white/15" />

        <button
          type="button"
          onClick={onZoomOut}
          className="rounded p-1.5 text-white/70 hover:bg-white/10"
          aria-label="ซูมออก"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="w-10 text-center text-xs text-white/60">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={onZoomIn}
          className="rounded p-1.5 text-white/70 hover:bg-white/10"
          aria-label="ซูมเข้า"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        <div className="mx-1 h-4 w-px bg-white/15" />

        <span className="w-32 text-xs text-white/40">{AUTOSAVE_LABEL[autosaveStatus]}</span>

        <button
          type="button"
          onClick={onPrint}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-doc-ink"
          style={{ background: "var(--doc-gold-gradient)" }}
        >
          <Printer className="h-3.5 w-3.5" />
          พิมพ์ / ส่งออก PDF
        </button>
      </div>
    </div>
  );
}
