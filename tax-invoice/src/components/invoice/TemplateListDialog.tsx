'use client';

import type { Template } from '@/lib/types';

interface TemplateListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  onLoad: (name: string) => void;
  onDelete: (name: string) => void;
}

export default function TemplateListDialog({
  isOpen,
  onClose,
  templates,
  onLoad,
  onDelete,
}: TemplateListDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-[var(--color-navy)] mb-4">Load Template</h2>
        {templates.length === 0 ? (
          <p className="text-sm text-gray-500 mb-4">No saved templates.</p>
        ) : (
          <ul className="mb-4 max-h-64 overflow-y-auto divide-y divide-gray-200">
            {templates.map((t) => (
              <li key={t.name} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onLoad(t.name)}
                    className="rounded bg-[var(--color-blue-accent)] px-3 py-1 text-xs text-white hover:bg-[var(--color-navy-light)] min-h-[44px] min-w-[44px]"
                    aria-label={`Load template ${t.name}`}
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(t.name)}
                    className="rounded border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50 min-h-[44px] min-w-[44px]"
                    aria-label={`Delete template ${t.name}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
