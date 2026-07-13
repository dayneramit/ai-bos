import { cn } from "@/lib/utils";

interface SignerProps {
  role: string;
  name?: string;
  signatureUrl?: string;
  dateLabel?: string;
}

export function Signer({ role, name, signatureUrl, dateLabel }: SignerProps) {
  return (
    <div className="flex w-56 flex-col items-center text-center">
      <div className="flex h-16 items-end justify-center">
        {signatureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={signatureUrl}
            alt={`ลายเซ็น ${role}`}
            className="max-h-16 max-w-full object-contain"
          />
        ) : null}
      </div>
      <div className="w-full border-t border-doc-ink/60 pt-2">
        <p className="text-sm font-semibold text-doc-ink">{name || "\u00A0"}</p>
        <p className="text-xs text-doc-text-muted">{role}</p>
        {dateLabel ? (
          <p className="mt-1 text-[11px] text-doc-text-muted">{dateLabel}</p>
        ) : null}
      </div>
    </div>
  );
}

interface SignatureBlockProps {
  signers: SignerProps[];
  className?: string;
}

export function SignatureBlock({ signers, className }: SignatureBlockProps) {
  if (signers.length === 0) return null;

  return (
    <div className={cn("flex items-start justify-center gap-12", className)}>
      {signers.map((signer) => (
        <Signer key={signer.role} {...signer} />
      ))}
    </div>
  );
}
