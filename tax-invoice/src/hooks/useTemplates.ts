import { useState, useCallback } from 'react';
import type { InvoiceState, Template } from '@/lib/types';
import { loadTemplates, saveTemplates } from '@/lib/storage';

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>(() => loadTemplates());
  const [error, setError] = useState<string | null>(null);

  const refreshTemplates = useCallback(() => {
    setTemplates(loadTemplates());
  }, []);

  const saveTemplate = useCallback(
    (name: string, state: InvoiceState): { needsConfirm: boolean } => {
      const existing = templates.find((t) => t.name === name);
      if (existing) {
        return { needsConfirm: true };
      }
      const newTemplate: Template = {
        name,
        createdAt: new Date().toISOString(),
        state,
      };
      const updated = [...templates, newTemplate];
      const result = saveTemplates(updated);
      if (!result.ok) {
        setError(result.error ?? 'Failed to save');
        return { needsConfirm: false };
      }
      setTemplates(updated);
      setError(null);
      return { needsConfirm: false };
    },
    [templates]
  );

  const overwriteTemplate = useCallback(
    (name: string, state: InvoiceState) => {
      const updated = templates.map((t) =>
        t.name === name
          ? { ...t, state, createdAt: new Date().toISOString() }
          : t
      );
      const result = saveTemplates(updated);
      if (!result.ok) {
        setError(result.error ?? 'Failed to save');
        return;
      }
      setTemplates(updated);
      setError(null);
    },
    [templates]
  );

  const deleteTemplate = useCallback(
    (name: string) => {
      const updated = templates.filter((t) => t.name !== name);
      const result = saveTemplates(updated);
      if (!result.ok) {
        setError(result.error ?? 'Failed to delete');
        return;
      }
      setTemplates(updated);
      setError(null);
    },
    [templates]
  );

  const getTemplate = useCallback(
    (name: string): Template | undefined => {
      return templates.find((t) => t.name === name);
    },
    [templates]
  );

  return {
    templates,
    error,
    saveTemplate,
    overwriteTemplate,
    deleteTemplate,
    getTemplate,
    refreshTemplates,
  };
}
