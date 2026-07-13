"use client";

import { useEffect } from "react";

/** Registers /sw.js once the app has mounted in the browser. No-op during SSR and in dev-friendly failure cases. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Offline support is a progressive enhancement — safe to ignore registration failures.
      });
    });
  }, []);

  return null;
}
