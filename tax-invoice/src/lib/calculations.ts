import type { InvoiceState, InvoiceCalculations } from './types';

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateLineAmount(quantity: number, unitPrice: number): number {
  return roundMoney(quantity * unitPrice);
}

export function calculateSubtotal(lineAmounts: number[]): number {
  return roundMoney(lineAmounts.reduce((sum, amt) => sum + amt, 0));
}

export function calculateDiscount(subtotal: number, percent: number): number {
  return roundMoney(subtotal * (percent / 100));
}

export function calculateTax(subtotal: number, discount: number, percent: number): number {
  return roundMoney((subtotal - discount) * (percent / 100));
}

export function calculateTotal(subtotal: number, discount: number, tax: number): number {
  return roundMoney(subtotal - discount + tax);
}

export function calculateAll(state: InvoiceState): InvoiceCalculations {
  const lineAmounts = state.lineItems.map((item) =>
    calculateLineAmount(item.quantity, item.unitPrice)
  );
  const subtotal = calculateSubtotal(lineAmounts);
  const discountAmount = calculateDiscount(subtotal, state.discountPercent);
  const taxAmount = calculateTax(subtotal, discountAmount, state.taxPercent);
  const total = calculateTotal(subtotal, discountAmount, taxAmount);

  return { lineAmounts, subtotal, discountAmount, taxAmount, total };
}
