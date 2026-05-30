import { describe, it, expect } from 'vitest';
import {
  roundMoney,
  calculateLineAmount,
  calculateSubtotal,
  calculateDiscount,
  calculateTax,
  calculateTotal,
  calculateAll,
} from './calculations';
import type { InvoiceState } from './types';

describe('roundMoney', () => {
  it('rounds to 2 decimal places', () => {
    expect(roundMoney(1.005)).toBe(1.01);
    expect(roundMoney(1.004)).toBe(1);
    expect(roundMoney(0.1 + 0.2)).toBe(0.3);
  });

  it('handles whole numbers', () => {
    expect(roundMoney(100)).toBe(100);
  });
});

describe('calculateLineAmount', () => {
  it('multiplies quantity by unit price', () => {
    expect(calculateLineAmount(5, 100)).toBe(500);
    expect(calculateLineAmount(1.5, 200)).toBe(300);
  });

  it('rounds result', () => {
    expect(calculateLineAmount(3, 33.33)).toBe(99.99);
    expect(calculateLineAmount(1, 0.1 + 0.2)).toBe(0.3);
  });

  it('returns 0 for zero quantity', () => {
    expect(calculateLineAmount(0, 100)).toBe(0);
  });
});

describe('calculateSubtotal', () => {
  it('sums all line amounts', () => {
    expect(calculateSubtotal([100, 200, 300])).toBe(600);
  });

  it('returns 0 for empty array', () => {
    expect(calculateSubtotal([])).toBe(0);
  });
});

describe('calculateDiscount', () => {
  it('calculates percentage of subtotal', () => {
    expect(calculateDiscount(1000, 10)).toBe(100);
    expect(calculateDiscount(1000, 0)).toBe(0);
  });

  it('rounds result', () => {
    expect(calculateDiscount(333, 10)).toBe(33.3);
  });
});

describe('calculateTax', () => {
  it('calculates tax on subtotal minus discount', () => {
    expect(calculateTax(1000, 100, 7)).toBe(63);
  });

  it('returns 0 for 0% tax', () => {
    expect(calculateTax(1000, 100, 0)).toBe(0);
  });
});

describe('calculateTotal', () => {
  it('computes subtotal - discount + tax', () => {
    expect(calculateTotal(1000, 100, 63)).toBe(963);
  });

  it('handles zero discount and tax', () => {
    expect(calculateTotal(500, 0, 0)).toBe(500);
  });
});

describe('calculateAll', () => {
  it('computes full invoice calculations', () => {
    const state: InvoiceState = {
      invoiceNumber: 'INV-001',
      invoiceDate: '2026-03-29',
      dueDate: '2026-04-28',
      currency: 'USD',
      companyInfo: '',
      billTo: '',
      bankInfo: '',
      notesTerms: '',
      discountPercent: 10,
      taxPercent: 7,
      lineItems: [
        { id: '1', description: 'Service A', quantity: 2, unitPrice: 300 },
        { id: '2', description: 'Service B', quantity: 1, unitPrice: 400 },
      ],
    };

    const calc = calculateAll(state);
    expect(calc.lineAmounts).toEqual([600, 400]);
    expect(calc.subtotal).toBe(1000);
    expect(calc.discountAmount).toBe(100);
    expect(calc.taxAmount).toBe(63);
    expect(calc.total).toBe(963);
  });

  it('handles empty line items', () => {
    const state: InvoiceState = {
      invoiceNumber: '',
      invoiceDate: '2026-03-29',
      dueDate: '2026-04-28',
      currency: 'USD',
      companyInfo: '',
      billTo: '',
      bankInfo: '',
      notesTerms: '',
      discountPercent: 0,
      taxPercent: 0,
      lineItems: [],
    };

    const calc = calculateAll(state);
    expect(calc.subtotal).toBe(0);
    expect(calc.total).toBe(0);
  });
});
