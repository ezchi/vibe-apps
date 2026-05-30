import { useReducer, useMemo } from 'react';
import type { InvoiceState, InvoiceAction, InvoiceCalculations } from '@/lib/types';
import { calculateAll } from '@/lib/calculations';
import { createDefaultState, createEmptyLineItem } from '@/lib/defaults';

function invoiceReducer(state: InvoiceState, action: InvoiceAction): InvoiceState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };

    case 'SET_LINE_ITEM':
      return {
        ...state,
        lineItems: state.lineItems.map((item) =>
          item.id === action.id ? { ...item, [action.field]: action.value } : item
        ),
      };

    case 'ADD_LINE_ITEM':
      return {
        ...state,
        lineItems: [...state.lineItems, createEmptyLineItem()],
      };

    case 'REMOVE_LINE_ITEM':
      return {
        ...state,
        lineItems: state.lineItems.filter((item) => item.id !== action.id),
      };

    case 'LOAD_STATE':
      return { ...action.state };

    case 'RESET': {
      const defaults = createDefaultState();
      return { ...defaults, companyInfo: action.companyInfo };
    }

    default:
      return state;
  }
}

export function useInvoice() {
  const [state, dispatch] = useReducer(invoiceReducer, undefined, createDefaultState);

  const calculations: InvoiceCalculations = useMemo(
    () => calculateAll(state),
    [state]
  );

  return { state, calculations, dispatch };
}
