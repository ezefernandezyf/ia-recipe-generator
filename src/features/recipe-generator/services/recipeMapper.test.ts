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
        { name: 'Agua', quantity: 100, unit: 'ml', notes: undefined },
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

  it('throws on malformed payloads instead of fabricating a default recipe', () => {
    expect(() =>
      mapApiRecipeToDomain({
        title: '',
        ingredients: [{ name: 5, quantity: 'x', unit: 'invalid' }],
        instructions: [1, 'Paso valido', false],
        preparationTimeMinutes: -10,
        difficulty: 'unknown-level',
        macros: null,
      })
    ).toThrow('La respuesta de la receta no es valida.');
  });
});
