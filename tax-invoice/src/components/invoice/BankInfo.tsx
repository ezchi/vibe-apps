'use client';

interface BankInfoProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BankInfo({ value, onChange }: BankInfoProps) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
        Bank Information
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm leading-relaxed focus:border-[var(--color-blue-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-blue-accent)] resize-y"
        placeholder="Bank name, account number, SWIFT..."
      />
    </div>
  );
}
