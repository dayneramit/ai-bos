"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { buildPromptPayPayload } from "@/lib/promptpay/promptpay";
import { cn } from "@/lib/utils";

interface QRPromptPayProps {
  promptPayId?: string;
  amount?: number;
  className?: string;
}

export function QRPromptPay({ promptPayId, amount, className }: QRPromptPayProps) {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    if (!promptPayId) {
      setSvg(null);
      return;
    }

    const payload = buildPromptPayPayload({ promptPayId, amount });

    QRCode.toString(payload, { type: "svg", margin: 0, width: 120 })
      .then(setSvg)
      .catch(() => setSvg(null));
  }, [promptPayId, amount]);

  if (!promptPayId || !svg) return null;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className="h-24 w-24 [&>svg]:h-full [&>svg]:w-full"
        // Vector SVG generated locally from a real PromptPay payload — not a placeholder image.
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="text-[10px] text-doc-text-muted">สแกนจ่ายผ่าน PromptPay</p>
    </div>
  );
}
