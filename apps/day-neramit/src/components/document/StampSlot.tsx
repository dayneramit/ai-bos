import { cn } from "@/lib/utils";

interface StampSlotProps {
  stampUrl?: string;
  className?: string;
}

export function StampSlot({ stampUrl, className }: StampSlotProps) {
  if (!stampUrl) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={stampUrl}
      alt="ตราประทับบริษัท"
      className={cn(
        "pointer-events-none absolute h-24 w-24 -rotate-6 object-contain opacity-90 mix-blend-multiply",
        className
      )}
    />
  );
}
