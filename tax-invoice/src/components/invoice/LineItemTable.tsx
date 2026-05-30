'use client';

import type { LineItem } from '@/lib/types';
import LineItemRow from './LineItemRow';

interface LineItemTableProps {
  lineItems: LineItem[];
  lineAmounts: number[];
  currency: string;
  onUpdateItem: (id: string, field: keyof LineItem, value: string | number) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: () => void;
}

export default function LineItemTable({
  lineItems,
  lineAmounts,
  currency,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
}: LineItemTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[540px]">
        <thead>
          <tr className="bg-[var(--color-navy)] text-white text-sm">
            <th className="px-2 py-2 text-center w-10">#</th>
            <th className="px-2 py-2 text-left">Description</th>
            <th className="px-2 py-2 text-right w-24">Qty</th>
            <th className="px-2 py-2 text-right w-28">Unit Price</th>
            <th className="px-2 py-2 text-right w-28">Amount</th>
            <th className="px-2 py-2 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, i) => (
            <LineItemRow
              key={item.id}
              item={item}
              index={i}
              amount={lineAmounts[i] ?? 0}
              currency={currency}
              onUpdate={onUpdateItem}
              onRemove={onRemoveItem}
              rowClassName={i % 2 === 0 ? 'bg-[var(--color-row-even)]' : 'bg-[var(--color-row-odd)]'}
            />
          ))}
        </tbody>
      </table>
      <div className="mt-2">
        <button
          type="button"
          onClick={onAddItem}
          className="rounded bg-[var(--color-blue-accent)] px-4 py-1.5 text-sm text-white hover:bg-[var(--color-navy-light)] transition-colors min-h-[44px]"
          aria-label="Add new line item"
        >
          + Add Item
        </button>
      </div>
    </div>
  );
}
