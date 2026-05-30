import { describe, it, expect, beforeEach } from 'vitest';
import { loadTemplates, saveTemplates } from './storage';
import type { Template } from './types';

const mockTemplate: Template = {
  name: 'Test Template',
  createdAt: '2026-03-29T00:00:00.000Z',
  state: {
    invoiceNumber: 'INV-001',
    invoiceDate: '2026-03-29',
    dueDate: '2026-04-28',
    currency: 'USD',
    companyInfo: 'Test Company',
    billTo: 'Client',
    bankInfo: 'Bank details',
    notesTerms: 'Net 30',
    discountPercent: 0,
    taxPercent: 0,
    lineItems: [],
  },
};

beforeEach(() => {
  localStorage.clear();
});

describe('loadTemplates', () => {
  it('returns empty array when no templates saved', () => {
    expect(loadTemplates()).toEqual([]);
  });

  it('returns saved templates', () => {
    localStorage.setItem('pike-silicon-invoice-templates', JSON.stringify([mockTemplate]));
    expect(loadTemplates()).toEqual([mockTemplate]);
  });

  it('returns empty array on corrupt data', () => {
    localStorage.setItem('pike-silicon-invoice-templates', 'not-json');
    expect(loadTemplates()).toEqual([]);
  });
});

describe('saveTemplates', () => {
  it('saves and returns ok', () => {
    const result = saveTemplates([mockTemplate]);
    expect(result.ok).toBe(true);
    expect(loadTemplates()).toEqual([mockTemplate]);
  });
});
