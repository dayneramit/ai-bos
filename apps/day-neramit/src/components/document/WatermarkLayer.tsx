interface WatermarkLayerProps {
  watermark?: "draft" | "cancelled" | null;
}

const WATERMARK_LABEL: Record<"draft" | "cancelled", string> = {
  draft: "ฉบับร่าง",
  cancelled: "ยกเลิก",
};

const WATERMARK_COLOR: Record<"draft" | "cancelled", string> = {
  draft: "rgba(160, 160, 160, 0.28)",
  cancelled: "rgba(200, 40, 40, 0.28)",
};

export function WatermarkLayer({ watermark }: WatermarkLayerProps) {
  if (!watermark) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center select-none"
      aria-hidden
    >
      <span
        className="whitespace-nowrap font-heading font-bold uppercase tracking-widest"
        style={{
          fontSize: "8rem",
          color: WATERMARK_COLOR[watermark],
          transform: "rotate(-28deg)",
        }}
      >
        {WATERMARK_LABEL[watermark]}
      </span>
    </div>
  );
}
