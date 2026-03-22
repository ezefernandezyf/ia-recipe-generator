import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './generate';

const mocks = vi.hoisted(() => ({
    generateText: vi.fn(),
    resolveRecipeModel: vi.fn(() => 'recipe-model'),
}));

vi.mock('ai', async () => {
    const actual = await vi.importActual<typeof import('ai')>('ai');

    return {
        ...actual,
        generateText: mocks.generateText,
    };
});

vi.mock('./_provider', () => ({
    resolveRecipeModel: mocks.resolveRecipeModel,
    isMissingAiProviderError: (error: unknown) => error instanceof Error && error.message.includes('Falta configurar'),
}));

describe('POST /api/recipe-generator/generate', () => {
    beforeEach(() => {
        mocks.generateText.mockReset();
        mocks.resolveRecipeModel.mockReset();
        mocks.resolveRecipeModel.mockReturnValue('recipe-model');
    });

    it('returns a recipe payload using the provider model', async () => {
        mocks.generateText.mockResolvedValue({
            output: {
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
        });

        const response = await POST(
            new Request('http://localhost/api/recipe-generator/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ingredients: [{ name: 'Tomate', quantity: 2, unit: 'unit' }],
                    servings: 2,
                    notes: '',
                }),
            })
        );

        expect(mocks.resolveRecipeModel).toHaveBeenCalled();
        expect(mocks.generateText).toHaveBeenCalled();
        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toMatchObject({
            recipe: expect.objectContaining({
                title: 'Sopa de tomate',
            }),
        });
    });

    it('returns 503 when provider credentials are missing', async () => {
        mocks.resolveRecipeModel.mockImplementation(() => {
            throw new Error('Falta configurar GROQ_API_KEY.');
        });

        const response = await POST(
            new Request('http://localhost/api/recipe-generator/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ingredients: [{ name: 'Tomate', quantity: 2, unit: 'unit' }],
                    servings: 2,
                    notes: '',
                }),
            })
        );

        expect(response.status).toBe(503);
        await expect(response.json()).resolves.toMatchObject({
            error: 'Falta configurar GROQ_API_KEY.',
        });
        expect(mocks.generateText).not.toHaveBeenCalled();
    });

    it('returns 502 when the provider fails unexpectedly', async () => {
        mocks.resolveRecipeModel.mockReturnValue('recipe-model');
        mocks.generateText.mockRejectedValue(new Error('provider exploded'));

        const response = await POST(
            new Request('http://localhost/api/recipe-generator/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ingredients: [{ name: 'Tomate', quantity: 2, unit: 'unit' }],
                    servings: 2,
                    notes: '',
                }),
            })
        );

        expect(response.status).toBe(502);
        await expect(response.json()).resolves.toMatchObject({
            error: 'No pudimos generar la receta en este momento.',
        });
    });

    it('returns 400 for invalid payloads', async () => {
        const response = await POST(
            new Request('http://localhost/api/recipe-generator/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ servings: 2 }),
            })
        );

        expect(response.status).toBe(400);
        expect(mocks.generateText).not.toHaveBeenCalled();
    });
});