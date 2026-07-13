import type { Receipt } from "@/types/receipt";
import { getReceiptTemplate } from "@/components/templates/receipt-registry";
import { resolveReceiptVisibility } from "@/lib/document-visibility";

interface ReceiptDocumentProps {
  receipt: Receipt;
  mode: "preview" | "print";
}

export function ReceiptDocument({ receipt, mode }: ReceiptDocumentProps) {
  const template = getReceiptTemplate(receipt.templateId);
  const visibility = resolveReceiptVisibility(receipt);
  const Template = template.component;

  return <Template receipt={receipt} visibility={visibility} mode={mode} />;
}
