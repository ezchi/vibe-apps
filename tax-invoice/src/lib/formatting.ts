export function formatMoney(value: number): string {
  const fixed = value.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${withCommas}.${decPart}`;
}

export function formatDate(date: string): string {
  return date; // Already YYYY-MM-DD
}

export function sanitizeFilename(invoiceNumber: string): string {
  return invoiceNumber.replace(/[/\\:*?"<>|]/g, '-');
}

export function buildPdfFilename(invoiceDate: string, invoiceNumber: string): string {
  const sanitized = sanitizeFilename(invoiceNumber);
  const datePart = invoiceDate || 'undated';
  const numberPart = sanitized || 'no-number';
  return `${datePart}.Pike.Silicon.${numberPart}.pdf`;
}
