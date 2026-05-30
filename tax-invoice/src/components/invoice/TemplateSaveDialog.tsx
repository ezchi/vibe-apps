'use client';

import { useState, useEffect } from 'react';

interface TemplateSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  existingNames: string[];
}

export default function TemplateSaveDialog({
  isOpen,
  onClose,
  onSave,
  existingNames,
}: TemplateSaveDialogProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) setName('');
  }, [isOpen]);

  if (!isOpen) return null;

  const nameExists = existingNames.includes(name.trim());
  const canSave = name.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    onSave(name.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-[var(--color-navy)] mb-4">Save Template</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-blue-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-blue-accent)]"
            placeholder="My Template"
            autoFocus
          />
          {nameExists && (
            <p className="mt-1 text-sm text-amber-600 font-medium">
              Template exists. Overwrite?
            </p>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className={`rounded px-4 py-2 text-sm text-white ${
              canSave
                ? 'bg-[var(--color-blue-accent)] hover:bg-[var(--color-navy-light)]'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {nameExists ? 'Overwrite' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
