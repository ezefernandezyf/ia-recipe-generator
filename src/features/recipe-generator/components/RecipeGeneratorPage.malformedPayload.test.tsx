import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RecipeGeneratorPage from './RecipeGeneratorPage';

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('RecipeGeneratorPage malformed payload regression', () => {
  it('shows a safe error when the server returns an invalid recipe payload', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          recipe: {
            title: 'Incomplete recipe',
            ingredients: [],
          },
        }),
        { status: 200 }
      )
    );

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RecipeGeneratorPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText('Ej: Tomate'), ' Tomate ');
    const quantityInput = screen.getByRole('spinbutton', { name: /cantidad/i });
    await user.clear(quantityInput);
    await user.type(quantityInput, '2');

    await user.click(screen.getByRole('button', { name: 'Generar receta' }));

    expect(await screen.findByText('No pudimos generar la receta. Intentalo nuevamente.')).toBeInTheDocument();
    expect(screen.queryByText('Sopa de tomate')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/recipe-generator/generate',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ingredients: [{ name: 'Tomate', quantity: 2, unit: 'unit' }],
            servings: 2,
            notes: '',
          }),
        })
      );
    });
  });
});