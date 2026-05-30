import type { Template } from './types';

const STORAGE_KEY = 'pike-silicon-invoice-templates';

export function loadTemplates(): Template[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Template[];
  } catch {
    return [];
  }
}

export function saveTemplates(templates: Template[]): { ok: boolean; error?: string } {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    return { ok: true };
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      return { ok: false, error: 'Storage is full. Please delete unused templates and try again.' };
    }
    return { ok: false, error: 'Failed to save templates.' };
  }
}
