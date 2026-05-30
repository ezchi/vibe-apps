import { describe, it, expect } from 'vitest';
import { isValidNumeric, parseNumericOrZero } from './validation';

describe('isValidNumeric', () => {
  it('accepts valid numbers', () => {
    expect(isValidNumeric('123')).toBe(true);
    expect(isValidNumeric('12.50')).toBe(true);
    expect(isValidNumeric('0')).toBe(true);
    expect(isValidNumeric('0.01')).toBe(true);
  });

  it('rejects invalid input', () => {
    expect(isValidNumeric('')).toBe(false);
    expect(isValidNumeric('abc')).toBe(false);
    expect(isValidNumeric('-1')).toBe(false);
    expect(isValidNumeric('-0.5')).toBe(false);
  });

  it('rejects more than 2 decimal places', () => {
    expect(isValidNumeric('12.345')).toBe(false);
    expect(isValidNumeric('1.999')).toBe(false);
  });
});

describe('parseNumericOrZero', () => {
  it('parses valid numbers', () => {
    expect(parseNumericOrZero('123')).toBe(123);
    expect(parseNumericOrZero('12.50')).toBe(12.5);
  });

  it('returns 0 for invalid input', () => {
    expect(parseNumericOrZero('')).toBe(0);
    expect(parseNumericOrZero('abc')).toBe(0);
    expect(parseNumericOrZero('-5')).toBe(0);
  });
});
