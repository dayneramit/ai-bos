import type { QuotationItem, QuotationTotals } from "@/types/quotation";
import { numberToThaiBahtText } from "@/lib/thai-baht-text/thai-baht-text";

/** Round to 2 decimal places using standard rounding (THB has satang). */
function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateLineAmount(item: QuotationItem): number {
  const gross = item.quantity * item.unitPrice;
  const discount = item.discount ?? 0;
  return round2(Math.max(gross - discount, 0));
}

export interface CalculateTotalsOptions {
  vatEnabled: boolean;
  vatRate: number;
  withholdingTaxEnabled: boolean;
  withholdingTaxRate?: number;
}

export function calculateQuotationTotals(
  items: QuotationItem[],
  options: CalculateTotalsOptions
): QuotationTotals {
  const lineAmounts = items.map(calculateLineAmount);
  const subtotal = round2(lineAmounts.reduce((sum, v) => sum + v, 0));
  const totalDiscount = round2(
    items.reduce((sum, item) => sum + (item.discount ?? 0), 0)
  );

  const vatAmount = options.vatEnabled ? round2(subtotal * options.vatRate) : 0;

  const withholdingTaxAmount =
    options.withholdingTaxEnabled && options.withholdingTaxRate
      ? round2(subtotal * options.withholdingTaxRate)
      : 0;

  const grandTotal = round2(subtotal + vatAmount - withholdingTaxAmount);

  return {
    subtotal,
    totalDiscount,
    vatAmount,
    withholdingTaxAmount,
    grandTotal,
    grandTotalText: numberToThaiBahtText(grandTotal),
  };
}
