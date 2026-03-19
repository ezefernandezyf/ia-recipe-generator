import { describe, expect, it } from 'vitest';
import { validateIngredient } from './validation';

describe('validateIngredient', () => {
  it('returns quantity error when quantity is zero or negative', () => {
    const missingQuantity = validateIngredient({
      name: 'Tomate',
      quantity: null,
      unit: 'g',
    });

    const zeroQuantity = validateIngredient({
      name: 'Tomate',
      quantity: 0,
      unit: 'g',
    });

    const negativeQuantity = validateIngredient({
      name: 'Tomate',
      quantity: -2,
      unit: 'g',
    });

    expect(missingQuantity.quantity).toBe('Quantity must be a number greater than 0.');
    expect(zeroQuantity.quantity).toBe('Quantity must be a number greater than 0.');
    expect(negativeQuantity.quantity).toBe('Quantity must be a number greater than 0.');
  });

  it('returns name error when ingredient name is missing', () => {
    const result = validateIngredient({
      quantity: 1,
      unit: 'unit',
    });

    expect(result.name).toBe('Ingredient name is required.');
  });

  it('returns unit error when unit is outside allowed catalog', () => {
    const result = validateIngredient({
      name: 'Tomate',
      quantity: 1,
      unit: 'invalid-unit' as never,
    });

    expect(result.unit).toContain('Unit must be one of:');
  });

  it('returns no errors for a valid ingredient', () => {
    const result = validateIngredient({
      name: 'Harina',
      quantity: 2,
      unit: 'cup',
      notes: 'Integral',
    });

    expect(result).toEqual({});
  });
});
