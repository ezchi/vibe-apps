'use client';

interface ToolbarProps {
  onExportPdf: () => void;
  onNewInvoice: () => void;
  onSaveTemplate: () => void;
  onLoadTemplate: () => void;
  pdfReady: boolean;
}

export default function Toolbar({
  onExportPdf,
  onNewInvoice,
  onSaveTemplate,
  onLoadTemplate,
  pdfReady,
}: ToolbarProps) {
  const btnBase =
    'rounded px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px]';

  return (
    <div className="no-print flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onNewInvoice}
        className={`${btnBase} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300`}
      >
        New Invoice
      </button>
      <button
        type="button"
        onClick={onSaveTemplate}
        className={`${btnBase} border border-[var(--color-blue-accent)] bg-white text-[var(--color-blue-accent)] hover:bg-blue-50 focus:ring-[var(--color-blue-accent)]`}
      >
        Save Template
      </button>
      <button
        type="button"
        onClick={onLoadTemplate}
        className={`${btnBase} border border-[var(--color-blue-accent)] bg-white text-[var(--color-blue-accent)] hover:bg-blue-50 focus:ring-[var(--color-blue-accent)]`}
      >
        Load Template
      </button>
      <button
        type="button"
        onClick={onExportPdf}
        disabled={!pdfReady}
        className={`${btnBase} text-white ${
          pdfReady
            ? 'bg-[var(--color-navy)] hover:bg-[var(--color-navy-light)] focus:ring-[var(--color-navy)]'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Export PDF
      </button>
    </div>
  );
}
