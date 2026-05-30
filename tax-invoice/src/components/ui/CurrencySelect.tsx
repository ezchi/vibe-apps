'use client';

import { useEffect } from 'react';

const COMMON_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'SGD'] as const;

const CURRENCY_PRESETS = [
  'AED', 'ARS', 'AUD', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'COP', 'CZK',
  'DKK', 'EGP', 'EUR', 'GBP', 'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'JPY',
  'KES', 'KRW', 'MXN', 'MYR', 'NGN', 'NOK', 'NZD', 'PHP', 'PLN', 'RUB',
  'SAR', 'SEK', 'SGD', 'THB', 'TRY', 'TWD', 'USD', 'VND', 'ZAR',
];

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  variant?: 'default' | 'inverted';
  id?: string;
}

export default function CurrencySelect({ value, onChange, variant = 'default', id }: CurrencySelectProps) {
  useEffect(() => {
    if (!CURRENCY_PRESETS.includes(value)) {
      onChange('USD');
    }
  }, [value, onChange]);

  const selectClass = variant === 'inverted'
    ? 'w-24 h-11 rounded border border-white/30 bg-white/10 px-2 py-1 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white'
    : 'w-24 h-11 rounded border border-gray-300 px-2 py-1 text-sm focus:border-[var(--color-blue-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-blue-accent)]';

  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={selectClass}
    >
      <optgroup label="Common">
        {COMMON_CURRENCIES.map((c) => (
          <option key={`common-${c}`} value={c}>{c}</option>
        ))}
      </optgroup>
      <optgroup label="All Currencies">
        {CURRENCY_PRESETS.map((c) => (
          <option key={`all-${c}`} value={c}>{c}</option>
        ))}
      </optgroup>
    </select>
  );
}
