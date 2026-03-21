import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './generate';

const mocks = vi.hoisted(() => ({
    generateObject: vi.fn(),
    groq: vi.fn(() => 'groq-model'),
    google: vi.fn(() => 'google-model'),
}));

vi.mock('ai', async () => {
    const actual = await vi.importActual<typeof import('ai')>('ai');

    return {
        ...actual,
        generateObject: mocks.generateObject,
    };
});

vi.mock('@ai-sdk/groq', () => ({
    groq: mocks.groq,
}));

vi.mock('@ai-sdk/google', () => ({
    google: mocks.google,
}));

describe('recipe generation provider selection', () => {
    beforeEach(() => {
        vi.unstubAllEnvs();
        mocks.generateObject.mockReset();
        mocks.groq.mockClear();
        mocks.google.mockClear();
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('routes generation through Groq when configured', async () => {
        vi.stubEnv('AI_PROVIDER', 'groq');
        vi.stubEnv('GROQ_API_KEY', 'groq-key');

        mocks.generateObject.mockResolvedValue({
            object: {
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

        expect(mocks.groq).toHaveBeenCalledWith('qwen/qwen3-32b');
        expect(mocks.google).not.toHaveBeenCalled();
        expect(mocks.generateObject).toHaveBeenCalledWith(
            expect.objectContaining({
                model: 'groq-model',
            })
        );
        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toMatchObject({
            recipe: expect.objectContaining({
                title: 'Sopa de tomate',
            }),
        });
    });

    it('routes generation through Google when configured', async () => {
        vi.stubEnv('AI_PROVIDER', 'google');
        vi.stubEnv('GOOGLE_GENERATIVE_AI_API_KEY', 'google-key');

        mocks.generateObject.mockResolvedValue({
            object: {
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

        expect(mocks.google).toHaveBeenCalledWith('gemini-2.5-flash');
        expect(mocks.groq).not.toHaveBeenCalled();
        expect(mocks.generateObject).toHaveBeenCalledWith(
            expect.objectContaining({
                model: 'google-model',
            })
        );
        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toMatchObject({
            recipe: expect.objectContaining({
                title: 'Sopa de tomate',
            }),
        });
    });
});