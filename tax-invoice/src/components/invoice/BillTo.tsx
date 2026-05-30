'use client';

interface BillToProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BillTo({ value, onChange }: BillToProps) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
        Bill To
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm leading-relaxed focus:border-[var(--color-blue-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-blue-accent)] resize-y"
        placeholder="Client name and address..."
      />
    </div>
  );
}
