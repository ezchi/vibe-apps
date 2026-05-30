import { describe, it, expect } from 'vitest';
import { formatMoney, sanitizeFilename, buildPdfFilename } from './formatting';

describe('formatMoney', () => {
  it('formats with 2 decimal places', () => {
    expect(formatMoney(0)).toBe('0.00');
    expect(formatMoney(1234.5)).toBe('1,234.50');
    expect(formatMoney(1234.56)).toBe('1,234.56');
  });

  it('adds comma separators for thousands', () => {
    expect(formatMoney(1000000)).toBe('1,000,000.00');
    expect(formatMoney(999.99)).toBe('999.99');
  });

  it('handles negative numbers', () => {
    expect(formatMoney(-1234.56)).toBe('-1,234.56');
  });
});

describe('sanitizeFilename', () => {
  it('replaces invalid characters with hyphens', () => {
    expect(sanitizeFilename('INV/2026/001')).toBe('INV-2026-001');
    expect(sanitizeFilename('INV\\001')).toBe('INV-001');
    expect(sanitizeFilename('INV:001*test')).toBe('INV-001-test');
  });

  it('preserves valid characters', () => {
    expect(sanitizeFilename('INV-001')).toBe('INV-001');
    expect(sanitizeFilename('simple')).toBe('simple');
  });
});

describe('buildPdfFilename', () => {
  it('builds correct filename pattern', () => {
    expect(buildPdfFilename('2026-03-29', 'INV-001'))
      .toBe('2026-03-29.Pike.Silicon.INV-001.pdf');
  });

  it('sanitizes invoice number in filename', () => {
    expect(buildPdfFilename('2026-03-29', 'INV/2026/001'))
      .toBe('2026-03-29.Pike.Silicon.INV-2026-001.pdf');
  });

  it('handles empty values', () => {
    expect(buildPdfFilename('', '')).toBe('undated.Pike.Silicon.no-number.pdf');
  });
});
