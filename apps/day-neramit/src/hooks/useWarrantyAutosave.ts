import { useEffect, useRef, useState } from "react";
import type { WarrantyCertificate } from "@/types/warranty";
import { warrantyRepository } from "@/services/warranty.service";

export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_DEBOUNCE_MS = 800;

export function useWarrantyAutosave(warranty: WarrantyCertificate | null, enabled: boolean) {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !warranty) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      setStatus("saving");
      try {
        await warrantyRepository.save(warranty);
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warranty, enabled]);

  return status;
}
