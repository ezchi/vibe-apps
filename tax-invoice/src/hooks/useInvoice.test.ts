import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInvoice } from './useInvoice';

describe('useInvoice', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useInvoice());
    expect(result.current.state.currency).toBe('USD');
    expect(result.current.state.discountPercent).toBe(0);
    expect(result.current.state.lineItems.length).toBe(1);
    expect(result.current.calculations.subtotal).toBe(0);
  });

  it('SET_FIELD updates a field', () => {
    const { result } = renderHook(() => useInvoice());
    act(() => {
      result.current.dispatch({ type: 'SET_FIELD', field: 'invoiceNumber', value: 'INV-001' });
    });
    expect(result.current.state.invoiceNumber).toBe('INV-001');
  });

  it('SET_LINE_ITEM updates a line item and recalculates', () => {
    const { result } = renderHook(() => useInvoice());
    const itemId = result.current.state.lineItems[0].id;

    act(() => {
      result.current.dispatch({ type: 'SET_LINE_ITEM', id: itemId, field: 'quantity', value: 5 });
      result.current.dispatch({ type: 'SET_LINE_ITEM', id: itemId, field: 'unitPrice', value: 100 });
    });

    expect(result.current.calculations.subtotal).toBe(500);
    expect(result.current.calculations.total).toBe(500);
  });

  it('ADD_LINE_ITEM adds a new row', () => {
    const { result } = renderHook(() => useInvoice());
    act(() => {
      result.current.dispatch({ type: 'ADD_LINE_ITEM' });
    });
    expect(result.current.state.lineItems.length).toBe(2);
  });

  it('REMOVE_LINE_ITEM removes a row', () => {
    const { result } = renderHook(() => useInvoice());
    const itemId = result.current.state.lineItems[0].id;
    act(() => {
      result.current.dispatch({ type: 'REMOVE_LINE_ITEM', id: itemId });
    });
    expect(result.current.state.lineItems.length).toBe(0);
  });

  it('LOAD_STATE replaces entire state', () => {
    const { result } = renderHook(() => useInvoice());
    const newState = {
      ...result.current.state,
      invoiceNumber: 'LOADED-001',
      currency: 'EUR',
    };
    act(() => {
      result.current.dispatch({ type: 'LOAD_STATE', state: newState });
    });
    expect(result.current.state.invoiceNumber).toBe('LOADED-001');
    expect(result.current.state.currency).toBe('EUR');
  });

  it('RESET preserves companyInfo', () => {
    const { result } = renderHook(() => useInvoice());
    act(() => {
      result.current.dispatch({ type: 'SET_FIELD', field: 'invoiceNumber', value: 'INV-999' });
    });
    act(() => {
      result.current.dispatch({ type: 'RESET', companyInfo: 'My Company' });
    });
    expect(result.current.state.invoiceNumber).toBe(`INV-${new Date().getFullYear()}-0001`);
    expect(result.current.state.companyInfo).toBe('My Company');
  });

  it('calculates discount and tax correctly', () => {
    const { result } = renderHook(() => useInvoice());
    const itemId = result.current.state.lineItems[0].id;

    act(() => {
      result.current.dispatch({ type: 'SET_LINE_ITEM', id: itemId, field: 'quantity', value: 2 });
      result.current.dispatch({ type: 'SET_LINE_ITEM', id: itemId, field: 'unitPrice', value: 500 });
      result.current.dispatch({ type: 'SET_FIELD', field: 'discountPercent', value: 10 });
      result.current.dispatch({ type: 'SET_FIELD', field: 'taxPercent', value: 7 });
    });

    expect(result.current.calculations.subtotal).toBe(1000);
    expect(result.current.calculations.discountAmount).toBe(100);
    expect(result.current.calculations.taxAmount).toBe(63);
    expect(result.current.calculations.total).toBe(963);
  });
});
