import { SignatureBlock } from "@/components/document/SignatureBlock";
import { StampSlot } from "@/components/document/StampSlot";
import { QRPromptPay } from "@/components/document/QRPromptPay";
import type { SignatureInfo } from "@/types/document";

interface FooterBandProps {
  signature?: SignatureInfo;
  showSignature: boolean;
  showStamp: boolean;
  showPromptPay: boolean;
  promptPayId?: string;
  grandTotal: number;
}

export function FooterBand({
  signature,
  showSignature,
  showStamp,
  showPromptPay,
  promptPayId,
  grandTotal,
}: FooterBandProps) {
  const signers = [];
  if (showSignature) {
    signers.push({
      role: "ผู้เสนอราคา",
      name: signature?.preparedByName,
      signatureUrl: signature?.preparedBySignatureUrl,
    });
  }
  if (signature?.customerSignatureUrl) {
    signers.push({
      role: "ผู้อนุมัติ / ลูกค้า",
      name: undefined,
      signatureUrl: signature.customerSignatureUrl,
    });
  }

  return (
    <div className="relative mt-6 px-10 pb-6">
      <div className="flex items-start justify-between">
        {showPromptPay ? (
          <QRPromptPay promptPayId={promptPayId} amount={grandTotal} />
        ) : (
          <div />
        )}

        <div className="relative">
          <SignatureBlock signers={signers} />
          {showStamp ? (
            <StampSlot stampUrl={signature?.companyStampUrl} className="right-4 top-0" />
          ) : null}
        </div>
      </div>

      {/* Decorative gold/black curve mirroring the header banner */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 -z-10 h-16"
        style={{
          background: "var(--doc-header-gradient)",
          clipPath: "ellipse(70% 100% at 50% 100%)",
          opacity: 0.06,
        }}
        aria-hidden
      />
    </div>
  );
}
