'use client';

import type { InvoiceCalculations } from '@/lib/types';
import { formatMoney } from '@/lib/formatting';

interface TotalsSectionProps {
  calculations: InvoiceCalculations;
  discountPercent: number;
  taxPercent: number;
  currency: string;
  onDiscountChange: (value: number) => void;
  onTaxChange: (value: number) => void;
}

export default function TotalsSection({
  calculations,
  discountPercent,
  taxPercent,
  currency,
  onDiscountChange,
  onTaxChange,
}: TotalsSectionProps) {
  const inputClass =
    'w-20 rounded border border-gray-300 px-2 py-1 text-sm text-right focus:border-[var(--color-blue-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-blue-accent)]';

  return (
    <div className="flex justify-end">
      <div className="w-80">
        <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
          <span className="text-sm text-gray-600">Subtotal</span>
          <span className="text-sm font-mono">
            {currency} {formatMoney(calculations.subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Discount</span>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={discountPercent}
              onChange={(e) => onDiscountChange(Number(e.target.value))}
              className={inputClass}
              aria-label="Discount percentage"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
          <span className="text-sm font-mono text-red-600">
            -{currency} {formatMoney(calculations.discountAmount)}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Tax</span>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={taxPercent}
              onChange={(e) => onTaxChange(Number(e.target.value))}
              className={inputClass}
              aria-label="Tax percentage"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
          <span className="text-sm font-mono">
            {currency} {formatMoney(calculations.taxAmount)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2.5 mt-1 border-t-2 border-[var(--color-navy)]">
          <span className="text-base font-bold text-[var(--color-navy)]">Total</span>
          <span className="text-base font-bold font-mono text-[var(--color-navy)]">
            {currency} {formatMoney(calculations.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
