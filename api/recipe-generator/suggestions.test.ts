import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './suggestions';

const mocks = vi.hoisted(() => ({
    generateObject: vi.fn(),
    resolveRecipeModel: vi.fn(() => 'recipe-model'),
}));

vi.mock('ai', async () => {
    const actual = await vi.importActual<typeof import('ai')>('ai');

    return {
        ...actual,
        generateObject: mocks.generateObject,
    };
});

vi.mock('./_provider', () => ({
    resolveRecipeModel: mocks.resolveRecipeModel,
    isMissingAiProviderError: (error: unknown) => error instanceof Error && error.message.includes('Falta configurar'),
}));

describe('GET /api/recipe-generator/suggestions', () => {
    beforeEach(() => {
        mocks.generateObject.mockReset();
        mocks.resolveRecipeModel.mockReset();
        mocks.resolveRecipeModel.mockReturnValue('recipe-model');
    });

    it('returns suggestions from the provider model', async () => {
        mocks.generateObject.mockResolvedValue({
            object: { suggestions: ['Usar arroz', 'Agregar hierbas'] },
        });

        const response = await GET(
            new Request('http://localhost/api/recipe-generator/suggestions?diet=vegan&maxPreparationTimeMinutes=30')
        );

        expect(mocks.resolveRecipeModel).toHaveBeenCalled();
        expect(mocks.generateObject).toHaveBeenCalled();
        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({
            suggestions: ['Usar arroz', 'Agregar hierbas'],
        });
    });

    it('returns 503 when provider credentials are missing', async () => {
        mocks.resolveRecipeModel.mockImplementation(() => {
            throw new Error('Falta configurar GOOGLE_GENERATIVE_AI_API_KEY.');
        });

        const response = await GET(new Request('http://localhost/api/recipe-generator/suggestions'));

        expect(response.status).toBe(503);
        await expect(response.json()).resolves.toMatchObject({
            error: 'Falta configurar GOOGLE_GENERATIVE_AI_API_KEY.',
        });
        expect(mocks.generateObject).not.toHaveBeenCalled();
    });

    it('returns 502 when the provider fails unexpectedly', async () => {
        mocks.resolveRecipeModel.mockReturnValue('recipe-model');
        mocks.generateObject.mockRejectedValue(new Error('provider exploded'));

        const response = await GET(new Request('http://localhost/api/recipe-generator/suggestions'));

        expect(response.status).toBe(502);
        await expect(response.json()).resolves.toMatchObject({
            error: 'No pudimos obtener sugerencias por ahora.',
        });
    });
});