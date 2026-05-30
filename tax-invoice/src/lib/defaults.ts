import type { InvoiceState } from './types';

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function thirtyDaysFromNow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

const PIKE_SILICON_DEFAULT_INFO = `Pike Silicon Pte. Ltd.
123 Tech Park Drive, #04-56
Singapore 123456
UEN: 202012345A
Tel: +65 6123 4567
Email: billing@pikesilicon.com`;

export function createDefaultState(): InvoiceState {
  return {
    invoiceNumber: `INV-${new Date().getFullYear()}-0001`,
    invoiceDate: todayString(),
    dueDate: thirtyDaysFromNow(),
    currency: 'USD',
    companyInfo: PIKE_SILICON_DEFAULT_INFO,
    billTo: '',
    bankInfo: '',
    notesTerms: '',
    discountPercent: 0,
    taxPercent: 0,
    lineItems: [
      {
        id: crypto.randomUUID(),
        description: '',
        quantity: 0,
        unitPrice: 0,
      },
    ],
  };
}

export function createEmptyLineItem() {
  return {
    id: crypto.randomUUID(),
    description: '',
    quantity: 0,
    unitPrice: 0,
  };
}
