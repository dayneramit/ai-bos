import type { ReactNode } from "react";
import type { PaperSpec } from "@/types/document";
import { cn } from "@/lib/utils";

const PAPER_DIMENSIONS_MM: Record<PaperSpec["size"], { w: number; h: number }> = {
  A4: { w: 210, h: 297 },
  A5: { w: 148, h: 210 },
  Letter: { w: 215.9, h: 279.4 },
  Legal: { w: 215.9, h: 355.6 },
};

interface DocumentShellProps {
  paper: PaperSpec;
  mode: "preview" | "print";
  children: ReactNode;
  className?: string;
}

/**
 * Renders a single physical page at true paper dimensions (mm -> px @ 96dpi
 * on screen; @page CSS takes over for print). The SAME markup is used for
 * live preview and for the exported PDF, so the export is never a
 * screenshot — it's the real DOM, paginated.
 */
export function DocumentShell({ paper, mode, children, className }: DocumentShellProps) {
  const dims = PAPER_DIMENSIONS_MM[paper.size];
  const width = paper.orientation === "portrait" ? dims.w : dims.h;
  const height = paper.orientation === "portrait" ? dims.h : dims.w;

  return (
    <div
      className={cn(
        "doc-page relative overflow-hidden bg-doc-paper text-doc-ink",
        mode === "preview" && "shadow-xl ring-1 ring-doc-border",
        className
      )}
      style={{
        width: `${width}mm`,
        height: `${height}mm`,
        fontFamily: "var(--font-sarabun)",
      }}
    >
      {children}
    </div>
  );
}
