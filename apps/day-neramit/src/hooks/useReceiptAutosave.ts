import { useEffect, useRef, useState } from "react";
import type { Receipt } from "@/types/receipt";
import { receiptRepository } from "@/services/receipt.service";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_DEBOUNCE_MS = 800;

export function useReceiptAutosave(receipt: Receipt | null, enabled: boolean) {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !receipt) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      setStatus("saving");
      try {
        await receiptRepository.save(receipt);
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receipt, enabled]);

  return status;
}
