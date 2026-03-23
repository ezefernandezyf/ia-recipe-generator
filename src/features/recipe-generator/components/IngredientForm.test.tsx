import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { IngredientFormRow, IngredientFormRows } from '../model/defaults';
import IngredientForm from './IngredientForm';

const buildRow = (overrides: Partial<IngredientFormRow> = {}): IngredientFormRow => {
  return {
    id: 'row-1',
    name: '',
    quantity: null,
    unit: 'unit',
    notes: '',
    ...overrides,
  };
};

describe('IngredientForm', () => {
  it('adds a new row when clicking "Agregar ingrediente"', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<IngredientForm rows={[buildRow()]} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Agregar ingrediente' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    const nextRows = onChange.mock.calls[0][0] as IngredientFormRows;
    expect(nextRows).toHaveLength(2);
    expect(nextRows[0].id).not.toBe('row-1');
    expect(nextRows[1].id).toBe('row-1');
  });

  it('adds a new row when the form starts empty', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<IngredientForm rows={[]} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Agregar ingrediente' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    const nextRows = onChange.mock.calls[0][0] as IngredientFormRows;
    expect(nextRows).toHaveLength(1);
    expect(nextRows[0].name).toBe('');
    expect(nextRows[0].quantity).toBeNull();
  });

  it('removes a row when multiple rows exist', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <IngredientForm
        rows={[buildRow({ id: 'row-1', name: 'Tomate', quantity: 1 }), buildRow({ id: 'row-2', name: 'Queso', quantity: 2 })]}
        onChange={onChange}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: 'Quitar' });
    await user.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalledTimes(1);
    const nextRows = onChange.mock.calls[0][0] as IngredientFormRows;
    expect(nextRows).toHaveLength(1);
    expect(nextRows[0].id).toBe('row-2');
  });

  it('renders validation feedback for invalid rows', () => {
    render(<IngredientForm rows={[buildRow()]} onChange={vi.fn()} />);

    expect(screen.getByText('Ingredient name is required.')).toBeInTheDocument();
    expect(screen.getByText('Quantity must be a number greater than 0.')).toBeInTheDocument();
  });
});
