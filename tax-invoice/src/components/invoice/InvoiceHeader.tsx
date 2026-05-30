'use client';

import DatePicker from '@/components/ui/DatePicker';
import CurrencySelect from '@/components/ui/CurrencySelect';

interface InvoiceHeaderProps {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  companyInfo: string;
  onInvoiceNumberChange: (value: string) => void;
  onInvoiceDateChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
}

export default function InvoiceHeader({
  invoiceNumber,
  invoiceDate,
  dueDate,
  currency,
  companyInfo,
  onInvoiceNumberChange,
  onInvoiceDateChange,
  onDueDateChange,
  onCurrencyChange,
}: InvoiceHeaderProps) {
  const companyName = (companyInfo ?? '').split('\n')[0] || 'Company';

  return (
    <div>
      {/* Teal header bar */}
      <div className="bg-[var(--color-navy)] rounded-t-lg px-6 py-4 flex items-center justify-between -mx-4 md:-mx-10 -mt-8">
        <div className="flex items-center gap-3">
          <img
            src="/Pike.Silicon.Icon.png"
            alt="Company Icon"
            className="h-8 w-auto"
          />
          <span className="text-white font-bold text-lg">{companyName}</span>
        </div>
        <span className="text-white text-2xl font-semibold tracking-wider">INVOICE</span>
      </div>

      {/* Metadata box */}
      <div className="mt-6 flex flex-col md:flex-row md:justify-end">
        <div className="bg-[var(--color-navy)] rounded-lg px-5 py-4 text-white w-full md:w-auto md:min-w-[280px]">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-white/80 mb-0.5">Invoice #</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => onInvoiceNumberChange(e.target.value)}
                className="w-full rounded border border-white/30 bg-white/10 px-2 py-1 text-sm text-white placeholder-white/50 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                placeholder="INV-001"
              />
            </div>
            <DatePicker
              label="Invoice Date"
              value={invoiceDate}
              onChange={onInvoiceDateChange}
              variant="inverted"
            />
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={onDueDateChange}
              variant="inverted"
            />
            <div className="col-span-2">
              <label htmlFor="currency-select" className="block text-xs font-medium text-white/80 mb-0.5">Currency</label>
              <CurrencySelect id="currency-select" value={currency} onChange={onCurrencyChange} variant="inverted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
