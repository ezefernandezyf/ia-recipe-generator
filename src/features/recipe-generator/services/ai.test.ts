// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fetchRecipeSuggestions, generateRecipe } from './ai';

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

describe('recipe AI service', () => {
  it('posts recipe generation requests to the internal endpoint', async () => {
    const abortController = new AbortController();
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
        { status: 200 }
      )
    );

    await generateRecipe({
      ingredients: [{ name: 'Tomate', quantity: 2, unit: 'unit' }],
      servings: 2,
      notes: 'sin sal',
    }, {
      signal: abortController.signal,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/recipe-generator/generate',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          ingredients: [{ name: 'Tomate', quantity: 2, unit: 'unit' }],
          servings: 2,
          notes: 'sin sal',
        }),
      })
    );
  });

  it('gets recipe suggestions from the internal endpoint', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ suggestions: ['Usar arroz', 'Agregar hierbas'] }), { status: 200 })
    );

    await fetchRecipeSuggestions({ diet: 'vegan', maxPreparationTimeMinutes: 30 });

    expect(fetchMock).toHaveBeenCalledWith('/api/recipe-generator/suggestions?diet=vegan&maxPreparationTimeMinutes=30');
  });

  it('surfaces a safe error when the recipe payload is malformed', async () => {
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

    await expect(
      generateRecipe({
        ingredients: [{ name: 'Tomate', quantity: 2, unit: 'unit' }],
        servings: 2,
        notes: 'sin sal',
      })
    ).rejects.toThrow('No pudimos generar la receta. Intentalo nuevamente.');
  });

  it('does not ship provider secret names in the browser bundle', async () => {
    const { build } = await import('vite');
    const outDir = await mkdtemp(join(tmpdir(), 'ia-recipe-generator-bundle-'));

    try {
      await build({
        build: {
          outDir,
          emptyOutDir: true,
        },
      });

      const collectJavaScriptFiles = async (directory: string): Promise<string[]> => {
        const entries = await readdir(directory, { withFileTypes: true });
        const nestedFiles = await Promise.all(
          entries.map(async (entry) => {
            const fullPath = join(directory, entry.name);

            if (entry.isDirectory()) {
              return collectJavaScriptFiles(fullPath);
            }

            return fullPath.endsWith('.js') || fullPath.endsWith('.mjs') ? [fullPath] : [];
          })
        );

        return nestedFiles.flat();
      };

      const bundleFiles = await collectJavaScriptFiles(outDir);
      const bundleText = await Promise.all(bundleFiles.map((filePath) => readFile(filePath, 'utf8')));
      const concatenatedBundle = bundleText.join('\n');

      expect(concatenatedBundle).not.toContain('GROQ_API_KEY');
      expect(concatenatedBundle).not.toContain('GOOGLE_GENERATIVE_AI_API_KEY');
      expect(concatenatedBundle).not.toContain('AI_PROVIDER');
    } finally {
      await rm(outDir, { recursive: true, force: true });
    }
  });
});