'use client';

import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label: string;
  variant?: 'default' | 'inverted';
}

function toDate(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function DatePicker({ value, onChange, label, variant = 'default' }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selected = toDate(value);

  const labelClass = variant === 'inverted'
    ? 'block text-xs font-medium text-white/80 mb-0.5'
    : 'block text-xs font-medium text-gray-600 mb-0.5';

  const buttonClass = variant === 'inverted'
    ? 'w-full rounded border border-white/30 bg-white/10 px-2 py-1 text-left text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white min-h-[44px]'
    : 'w-full rounded border border-gray-300 bg-white px-2 py-1 text-left text-sm focus:border-[var(--color-blue-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-blue-accent)] min-h-[44px]';

  return (
    <div ref={containerRef} className="relative">
      <label className={labelClass}>{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={buttonClass}
        aria-label={`${label}: ${value || 'Select date'}`}
      >
        {value || 'Select date'}
      </button>
      {open && (
        <div className="absolute z-50 mt-1 rounded border border-gray-200 bg-white shadow-lg text-gray-900">
          <DayPicker
            mode="single"
            selected={selected}
            defaultMonth={selected}
            onSelect={(day) => {
              if (day) {
                onChange(toDateString(day));
              }
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
