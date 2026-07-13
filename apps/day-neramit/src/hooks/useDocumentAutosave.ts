import { useEffect, useRef, useState } from "react";
import type { Quotation } from "@/types/quotation";
import { quotationRepository } from "@/services/document.service";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_DEBOUNCE_MS = 800;

export function useDocumentAutosave(quotation: Quotation | null, enabled: boolean) {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !quotation) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      setStatus("saving");
      try {
        await quotationRepository.save(quotation);
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotation, enabled]);

  return status;
}
