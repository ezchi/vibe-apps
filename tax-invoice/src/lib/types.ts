export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceState {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  companyInfo: string;
  billTo: string;
  bankInfo: string;
  notesTerms: string;
  discountPercent: number;
  taxPercent: number;
  lineItems: LineItem[];
}

export interface InvoiceCalculations {
  lineAmounts: number[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

export interface Template {
  name: string;
  createdAt: string;
  state: InvoiceState;
}

export type InvoiceAction =
  | { type: 'SET_FIELD'; field: keyof InvoiceState; value: string | number }
  | { type: 'SET_LINE_ITEM'; id: string; field: keyof LineItem; value: string | number }
  | { type: 'ADD_LINE_ITEM' }
  | { type: 'REMOVE_LINE_ITEM'; id: string }
  | { type: 'LOAD_STATE'; state: InvoiceState }
  | { type: 'RESET'; companyInfo: string };
