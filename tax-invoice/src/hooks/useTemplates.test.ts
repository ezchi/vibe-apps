import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTemplates } from './useTemplates';
import type { InvoiceState } from '@/lib/types';

const mockState: InvoiceState = {
  invoiceNumber: 'INV-001',
  invoiceDate: '2026-03-29',
  dueDate: '2026-04-28',
  currency: 'USD',
  companyInfo: 'Test Co',
  billTo: 'Client',
  bankInfo: 'Bank',
  notesTerms: 'Net 30',
  discountPercent: 0,
  taxPercent: 0,
  lineItems: [],
};

beforeEach(() => {
  localStorage.clear();
});

describe('useTemplates', () => {
  it('starts with empty templates', () => {
    const { result } = renderHook(() => useTemplates());
    expect(result.current.templates).toEqual([]);
  });

  it('saves a new template', () => {
    const { result } = renderHook(() => useTemplates());
    act(() => {
      result.current.saveTemplate('Client A', mockState);
    });
    expect(result.current.templates.length).toBe(1);
    expect(result.current.templates[0].name).toBe('Client A');
  });

  it('returns needsConfirm for duplicate name', () => {
    const { result } = renderHook(() => useTemplates());
    act(() => {
      result.current.saveTemplate('Client A', mockState);
    });
    let response: { needsConfirm: boolean } = { needsConfirm: false };
    act(() => {
      response = result.current.saveTemplate('Client A', mockState);
    });
    expect(response.needsConfirm).toBe(true);
  });

  it('overwrites existing template', () => {
    const { result } = renderHook(() => useTemplates());
    act(() => {
      result.current.saveTemplate('Client A', mockState);
    });
    const updatedState = { ...mockState, invoiceNumber: 'INV-002' };
    act(() => {
      result.current.overwriteTemplate('Client A', updatedState);
    });
    expect(result.current.templates.length).toBe(1);
    expect(result.current.templates[0].state.invoiceNumber).toBe('INV-002');
  });

  it('deletes a template', () => {
    const { result } = renderHook(() => useTemplates());
    act(() => {
      result.current.saveTemplate('Client A', mockState);
      result.current.saveTemplate('Client B', mockState);
    });
    act(() => {
      result.current.deleteTemplate('Client A');
    });
    expect(result.current.templates.length).toBe(1);
    expect(result.current.templates[0].name).toBe('Client B');
  });

  it('gets a template by name', () => {
    const { result } = renderHook(() => useTemplates());
    act(() => {
      result.current.saveTemplate('Client A', mockState);
    });
    const found = result.current.getTemplate('Client A');
    expect(found?.name).toBe('Client A');
    expect(result.current.getTemplate('nonexistent')).toBeUndefined();
  });
});
