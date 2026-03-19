import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateRecipe } from '../services/ai';
import RecipeGeneratorPage from './RecipeGeneratorPage';

vi.mock('../services/ai', () => ({
  generateRecipe: vi.fn(),
}));

describe('RecipeGeneratorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits ingredient data and renders generated recipe', async () => {
    const user = userEvent.setup();
    const generateRecipeMock = vi.mocked(generateRecipe);

    generateRecipeMock.mockResolvedValue({
      id: 'recipe-1',
      title: 'Sopa de tomate',
      ingredients: [
        { name: 'Tomate', quantity: 2, unit: 'unit' },
      ],
      instructions: ['Cortar', 'Cocinar'],
      preparationTimeMinutes: 15,
      totalTimeMinutes: 25,
      servings: 2,
      difficulty: 'easy',
      macros: {
        calories: 250,
        protein: 6,
        carbohydrates: 30,
        fats: 8,
      },
    });

    render(<RecipeGeneratorPage />);

    await user.type(screen.getByPlaceholderText('Ej: Tomate'), ' Tomate ');
    const quantityInput = screen.getByRole('spinbutton', { name: /cantidad/i });
    await user.clear(quantityInput);
    await user.type(quantityInput, '2');

    await user.click(screen.getByRole('button', { name: 'Generar receta' }));

    await waitFor(() => {
      expect(generateRecipeMock).toHaveBeenCalledWith({
        ingredients: [
          {
            name: 'Tomate',
            quantity: 2,
            unit: 'unit',
            notes: undefined,
          },
        ],
        servings: 2,
        notes: '',
      });
    });

    expect(await screen.findByText('Sopa de tomate')).toBeInTheDocument();
    expect(screen.getByText('1. Cortar')).toBeInTheDocument();
  });

  it('blocks generation when servings are invalid', async () => {
    const user = userEvent.setup();
    const generateRecipeMock = vi.mocked(generateRecipe);

    render(<RecipeGeneratorPage />);

    await user.type(screen.getByPlaceholderText('Ej: Tomate'), ' Tomate ');
    const quantityInput = screen.getByRole('spinbutton', { name: /cantidad/i });
    await user.clear(quantityInput);
    await user.type(quantityInput, '2');

    const servingsInput = screen.getByRole('spinbutton', { name: /porciones/i });
    await user.clear(servingsInput);
    await user.click(screen.getByRole('button', { name: 'Generar receta' }));

    expect(generateRecipeMock).not.toHaveBeenCalled();
    expect(screen.getByText('Revisá las porciones antes de generar la receta.')).toBeInTheDocument();
  });
});
