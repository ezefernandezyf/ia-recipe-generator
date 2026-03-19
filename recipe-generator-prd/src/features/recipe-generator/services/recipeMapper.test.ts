import { describe, expect, it } from 'vitest';
import { mapApiRecipeToDomain } from './recipeMapper';

describe('mapApiRecipeToDomain', () => {
  it('maps a complete API payload into the domain model', () => {
    const result = mapApiRecipeToDomain({
      id: 'recipe-1',
      title: 'Pasta casera',
      ingredients: [
        { name: 'Harina', quantity: 200, unit: 'g', notes: '0000' },
        { name: 'Agua', quantity: 100, unit: 'ml' },
      ],
      instructions: ['Mezclar', 'Amasar'],
      preparationTimeMinutes: 20,
      totalTimeMinutes: 35,
      servings: 4,
      difficulty: 'hard',
      macros: {
        calories: 520,
        protein: 18,
        carbohydrates: 95,
        fats: 8,
      },
    });

    expect(result).toEqual({
      id: 'recipe-1',
      title: 'Pasta casera',
      ingredients: [
        { name: 'Harina', quantity: 200, unit: 'g', notes: '0000' },
        { name: 'Agua', quantity: 100, unit: 'ml', notes: '' },
      ],
      instructions: ['Mezclar', 'Amasar'],
      preparationTimeMinutes: 20,
      totalTimeMinutes: 35,
      servings: 4,
      difficulty: 'hard',
      macros: {
        calories: 520,
        protein: 18,
        carbohydrates: 95,
        fats: 8,
      },
    });
  });

  it('applies safe defaults for partial payloads', () => {
    const result = mapApiRecipeToDomain({
      difficulty: 'unknown-level',
      ingredients: [{ name: 5, quantity: 'x', unit: 'invalid' }],
      macros: null,
      instructions: [1, 'Paso valido', false],
    });

    expect(result).toEqual({
      id: undefined,
      title: 'Untitled recipe',
      ingredients: [
        { name: '', quantity: 0, unit: 'unit', notes: '' },
      ],
      instructions: ['Paso valido'],
      preparationTimeMinutes: 0,
      totalTimeMinutes: undefined,
      servings: undefined,
      difficulty: 'medium',
      macros: {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fats: 0,
      },
    });
  });
});
