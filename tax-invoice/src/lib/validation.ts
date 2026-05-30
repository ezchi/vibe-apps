export function isValidNumeric(value: string): boolean {
  if (value === '') return false;
  const num = Number(value);
  if (isNaN(num) || num < 0) return false;
  // Check max 2 decimal places
  const parts = value.split('.');
  if (parts.length > 1 && parts[1].length > 2) return false;
  return true;
}

export function parseNumericOrZero(value: string): number {
  const num = Number(value);
  if (isNaN(num) || num < 0) return 0;
  return Math.round(num * 100) / 100;
}
