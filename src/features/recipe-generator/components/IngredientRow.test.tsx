import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { IngredientFormRow } from '../model/defaults';
import IngredientRow from './IngredientRow';

const buildRow = (overrides: Partial<IngredientFormRow> = {}): IngredientFormRow => {
  return {
    id: 'row-1',
    name: 'Tomate',
    quantity: 2,
    unit: 'unit',
    notes: '',
    ...overrides,
  };
};

describe('IngredientRow', () => {
  it('keeps the remove action readable on desktop breakpoints', () => {
    render(
      <IngredientRow
        row={buildRow()}
        errors={{}}
        disableRemove={false}
        onChange={vi.fn()}
        onRemove={vi.fn()}
      />
    );

    const removeButton = screen.getByRole('button', { name: 'Quitar' });

    expect(removeButton).toHaveClass('md:w-auto');
    expect(removeButton).toHaveClass('md:min-w-28');
  });
});