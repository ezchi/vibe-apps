'use client';

import { useState } from 'react';
import type { LineItem } from '@/lib/types';
import { isValidNumeric, parseNumericOrZero } from '@/lib/validation';
import { formatMoney } from '@/lib/formatting';

interface LineItemRowProps {
  item: LineItem;
  index: number;
  amount: number;
  currency: string;
  onUpdate: (id: string, field: keyof LineItem, value: string | number) => void;
  onRemove: (id: string) => void;
  rowClassName?: string;
}

export default function LineItemRow({ item, index, amount, currency, onUpdate, onRemove, rowClassName }: LineItemRowProps) {
  const [qtyRaw, setQtyRaw] = useState(item.quantity === 0 ? '' : String(item.quantity));
  const [priceRaw, setPriceRaw] = useState(item.unitPrice === 0 ? '' : String(item.unitPrice));

  const qtyValid = qtyRaw === '' || isValidNumeric(qtyRaw);
  const priceValid = priceRaw === '' || isValidNumeric(priceRaw);

  function handleQtyChange(val: string) {
    setQtyRaw(val);
    const parsed = parseNumericOrZero(val);
    onUpdate(item.id, 'quantity', parsed);
  }

  function handlePriceChange(val: string) {
    setPriceRaw(val);
    const parsed = parseNumericOrZero(val);
    onUpdate(item.id, 'unitPrice', parsed);
  }

  const inputBase = 'w-full rounded border px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-[var(--color-blue-accent)]';
  const validBorder = 'border-gray-300 focus:border-[var(--color-blue-accent)]';
  const invalidBorder = 'border-red-500 focus:border-red-500 focus:ring-red-300';

  return (
    <tr className={rowClassName}>
      <td className="px-2 py-1.5 text-center text-sm text-gray-500 w-10">
        {index + 1}
      </td>
      <td className="px-2 py-1.5">
        <input
          type="text"
          value={item.description}
          onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-[var(--color-blue-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-blue-accent)]"
          placeholder="Item description"
          aria-label={`Item ${index + 1} description`}
        />
      </td>
      <td className="px-2 py-1.5 w-24">
        <input
          type="text"
          inputMode="decimal"
          value={qtyRaw}
          onChange={(e) => handleQtyChange(e.target.value)}
          className={`${inputBase} ${qtyValid ? validBorder : invalidBorder}`}
          placeholder="0"
          aria-label={`Item ${index + 1} quantity`}
        />
      </td>
      <td className="px-2 py-1.5 w-28">
        <input
          type="text"
          inputMode="decimal"
          value={priceRaw}
          onChange={(e) => handlePriceChange(e.target.value)}
          className={`${inputBase} ${priceValid ? validBorder : invalidBorder}`}
          placeholder="0.00"
          aria-label={`Item ${index + 1} unit price`}
        />
      </td>
      <td className="px-2 py-1.5 w-28 text-right text-sm font-mono">
        {currency} {formatMoney(amount)}
      </td>
      <td className="px-2 py-1.5 w-10 text-center">
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-red-400 hover:text-red-600 text-lg leading-none min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
          title="Remove item"
          aria-label={`Remove item ${index + 1}`}
        >
          &times;
        </button>
      </td>
    </tr>
  );
}
