import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CurrencySelect from './CurrencySelect';

describe('CurrencySelect', () => {
  it('renders a select element', () => {
    render(<CurrencySelect value="USD" onChange={vi.fn()} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('has two optgroup elements', () => {
    const { container } = render(<CurrencySelect value="USD" onChange={vi.fn()} />);
    const groups = container.querySelectorAll('optgroup');
    expect(groups).toHaveLength(2);
    expect(groups[0]).toHaveAttribute('label', 'Common');
    expect(groups[1]).toHaveAttribute('label', 'All Currencies');
  });

  it('Common group has 5 options', () => {
    const { container } = render(<CurrencySelect value="USD" onChange={vi.fn()} />);
    const commonGroup = container.querySelector('optgroup[label="Common"]');
    const options = commonGroup!.querySelectorAll('option');
    expect(options).toHaveLength(5);
    expect(Array.from(options).map((o) => o.value)).toEqual(['USD', 'EUR', 'GBP', 'JPY', 'SGD']);
  });

  it('All Currencies group has 39 options', () => {
    const { container } = render(<CurrencySelect value="USD" onChange={vi.fn()} />);
    const allGroup = container.querySelector('optgroup[label="All Currencies"]');
    expect(allGroup!.querySelectorAll('option')).toHaveLength(39);
  });

  it('calls onChange with selected value', () => {
    const onChange = vi.fn();
    render(<CurrencySelect value="USD" onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'EUR' } });
    expect(onChange).toHaveBeenCalledWith('EUR');
  });

  it('falls back to USD for invalid currency value', () => {
    const onChange = vi.fn();
    render(<CurrencySelect value="BTC" onChange={onChange} />);
    expect(onChange).toHaveBeenCalledWith('USD');
  });

  it('passes id prop to select element', () => {
    render(<CurrencySelect value="USD" onChange={vi.fn()} id="test-currency" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'test-currency');
  });
});
