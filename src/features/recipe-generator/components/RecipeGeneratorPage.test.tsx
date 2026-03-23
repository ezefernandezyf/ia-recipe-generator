import { render, screen, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { generateRecipe } from '../services/ai';
import RecipeGeneratorPage from './RecipeGeneratorPage';

vi.mock('../services/ai', () => ({
  generateRecipe: vi.fn(),
}));

describe('RecipeGeneratorPage', () => {
  const renderPage = (): void => {
    render(
      <MemoryRouter>
        <RecipeGeneratorPage />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits ingredient data and renders generated recipe', async () => {
    const user = userEvent.setup();
    const generateRecipeMock = vi.mocked(generateRecipe);
    let resolveRecipe!: (value: Awaited<ReturnType<typeof generateRecipe>>) => void;
    const pendingRecipe = new Promise<Awaited<ReturnType<typeof generateRecipe>>>((resolve) => {
      resolveRecipe = resolve;
    });

    generateRecipeMock.mockReturnValue(pendingRecipe);

    renderPage();

    await user.type(screen.getByPlaceholderText('Ej: Tomate'), ' Tomate ');
    const quantityInput = screen.getByRole('spinbutton', { name: /cantidad/i });
    await user.clear(quantityInput);
    await user.type(quantityInput, '2');

    await user.click(screen.getByRole('button', { name: 'Generar receta' }));

    expect(screen.getByRole('button', { name: 'Generando...' })).toBeInTheDocument();

    resolveRecipe({
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
      }, expect.objectContaining({ signal: expect.anything() }));
    });

    expect(await screen.findByText('Sopa de tomate')).toBeInTheDocument();
    expect(screen.getByText('1. Cortar')).toBeInTheDocument();
  });

  it('blocks generation when servings are invalid', async () => {
    const user = userEvent.setup();
    const generateRecipeMock = vi.mocked(generateRecipe);

    renderPage();

    await user.type(screen.getByPlaceholderText('Ej: Tomate'), ' Tomate ');
    const quantityInput = screen.getByRole('spinbutton', { name: /cantidad/i });
    await user.clear(quantityInput);
    await user.type(quantityInput, '2');

    const servingsInput = screen.getByRole('spinbutton', { name: /porciones/i });
    await user.clear(servingsInput);
    await user.click(screen.getByRole('button', { name: 'Generar receta' }));

    expect(generateRecipeMock).not.toHaveBeenCalled();
    expect(screen.getAllByText('Ingresá un número de porciones mayor que 0.')).toHaveLength(2);
  });

  it('shows a safe error when the recipe request fails on the server', async () => {
    const user = userEvent.setup();
    const generateRecipeMock = vi.mocked(generateRecipe);

    generateRecipeMock.mockRejectedValue(new Error('No pudimos generar la receta. Intentalo nuevamente.'));

    renderPage();

    await user.type(screen.getByPlaceholderText('Ej: Tomate'), ' Tomate ');
    const quantityInput = screen.getByRole('spinbutton', { name: /cantidad/i });
    await user.clear(quantityInput);
    await user.type(quantityInput, '2');

    await user.click(screen.getByRole('button', { name: 'Generar receta' }));

    expect(await screen.findByText('No pudimos generar la receta. Intentalo nuevamente.')).toBeInTheDocument();
    expect(screen.queryByText('Sopa de tomate')).not.toBeInTheDocument();
  });

  it('keeps only the latest submitted recipe result when requests resolve out of order', async () => {
    const user = userEvent.setup();
    const generateRecipeMock = vi.mocked(generateRecipe);
    let resolveFirst!: (value: Awaited<ReturnType<typeof generateRecipe>>) => void;
    let resolveSecond!: (value: Awaited<ReturnType<typeof generateRecipe>>) => void;

    generateRecipeMock
      .mockReturnValueOnce(new Promise((resolve) => {
        resolveFirst = resolve;
      }))
      .mockReturnValueOnce(new Promise((resolve) => {
        resolveSecond = resolve;
      }));

    renderPage();

    await user.type(screen.getByPlaceholderText('Ej: Tomate'), ' Tomate ');
    const quantityInput = screen.getByRole('spinbutton', { name: /cantidad/i });
    await user.clear(quantityInput);
    await user.type(quantityInput, '2');

    const submitButton = screen.getByRole('button', { name: 'Generar receta' });
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    expect(generateRecipeMock).toHaveBeenCalledTimes(2);

    resolveSecond({
      id: 'recipe-2',
      title: 'Sopa de tomate renovada',
      ingredients: [{ name: 'Tomate', quantity: 2, unit: 'unit' }],
      instructions: ['Picar', 'Cocinar'],
      preparationTimeMinutes: 12,
      totalTimeMinutes: 22,
      servings: 2,
      difficulty: 'easy',
      macros: {
        calories: 240,
        protein: 5,
        carbohydrates: 28,
        fats: 7,
      },
    });

    expect(await screen.findByText('Sopa de tomate renovada')).toBeInTheDocument();

    resolveFirst({
      id: 'recipe-1',
      title: 'Sopa de tomate antigua',
      ingredients: [{ name: 'Tomate', quantity: 2, unit: 'unit' }],
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

    expect(screen.queryByText('Sopa de tomate antigua')).not.toBeInTheDocument();
  });
});
