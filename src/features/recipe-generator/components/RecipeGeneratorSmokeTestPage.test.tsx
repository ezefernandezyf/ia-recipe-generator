import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RecipeGeneratorSmokeTestPage from './RecipeGeneratorSmokeTestPage';

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

describe('RecipeGeneratorSmokeTestPage', () => {
  it('runs a direct fetch and renders the raw and parsed response', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          recipe: {
            id: 'recipe-1',
            title: 'Sopa de tomate',
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
          },
        }),
        {
          status: 200,
          statusText: 'OK',
        }
      )
    );

    const user = userEvent.setup();

    render(<RecipeGeneratorSmokeTestPage />);

    await user.type(screen.getByLabelText('API key'), 'test-api-key');
    const modelInput = screen.getByLabelText('Model');
    await user.clear(modelInput);
    await user.type(modelInput, 'openai/gpt-oss-20b');

    await user.click(screen.getByRole('button', { name: 'Run smoke test' }));

    expect(await screen.findByText('200 OK')).toBeInTheDocument();
    expect(screen.getByText(/"title": "Sopa de tomate"/)).toBeInTheDocument();
    expect(screen.getAllByText(/"recipe"/)).toHaveLength(2);

    const [calledUrl, calledInit] = fetchMock.mock.calls[0] ?? [];

    expect(calledUrl).toBe('/api/recipe-generator/debug/generate');
    expect(calledInit).toEqual(
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(JSON.parse(String(calledInit?.body))).toEqual({
      provider: 'groq',
      apiKey: 'test-api-key',
      model: 'openai/gpt-oss-20b',
      request: {
        ingredients: [
          { name: 'Tomate', quantity: 2, unit: 'unit', notes: '' },
          { name: 'Cebolla', quantity: 1, unit: 'unit', notes: '' },
          { name: 'Aceite de oliva', quantity: 1, unit: 'tbsp', notes: '' },
        ],
        servings: 2,
        notes: 'Prueba de extremo a extremo desde el navegador.',
      },
    });
  });
});