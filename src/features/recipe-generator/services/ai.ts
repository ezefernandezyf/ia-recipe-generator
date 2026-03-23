import type { Ingredient, Recipe } from '../model/recipe';
import { mapApiRecipeToDomain } from './recipeMapper';

const AI_SERVICE_BASE_URL = '/api/recipe-generator';

interface GenerateRecipeRequest {
    ingredients: Ingredient[];
    servings?: number;
    notes?: string;
}

interface GenerateRecipeOptions {
    signal?: AbortSignal;
}

interface GenerateRecipeResponse {
    recipe: unknown;
}

const DIET = {
    VEGETARIAN: 'vegetarian',
    VEGAN: 'vegan',
    GLUTEN_FREE: 'gluten-free',
    NONE: 'none',
} as const;

export type DietPreference = (typeof DIET)[keyof typeof DIET];

interface RecipeSuggestionPreferences {
    diet?: DietPreference;
    maxPreparationTimeMinutes?: number;
}

interface RecipeSuggestionsResponse {
    suggestions: string[];
}

const toUserSafeError = (fallbackMessage: string): Error => {
    return new Error(fallbackMessage);
};

const requestJson = async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
    const response = typeof init === 'undefined' ? await fetch(input) : await fetch(input, init);

    if (!response.ok) {
        throw toUserSafeError('Recipe service is unavailable right now.');
    }

    return (await response.json()) as T;
};

export const generateRecipe = async (
    request: GenerateRecipeRequest,
    options?: GenerateRecipeOptions
): Promise<Recipe> => {
    try {
        const response = await requestJson<GenerateRecipeResponse>(
            `${AI_SERVICE_BASE_URL}/generate`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
                signal: options?.signal,
            }
        );

        return mapApiRecipeToDomain(response.recipe);
    } catch {
        throw toUserSafeError('No pudimos generar la receta. Intentalo nuevamente.');
    }
};

export const fetchRecipeSuggestions = async (
    preferences: RecipeSuggestionPreferences
): Promise<string[]> => {
    try {
        const search = new URLSearchParams();

        if (preferences.diet) {
            search.set('diet', preferences.diet);
        }

        if (typeof preferences.maxPreparationTimeMinutes === 'number') {
            search.set('maxPreparationTimeMinutes', String(preferences.maxPreparationTimeMinutes));
        }

        const response = await requestJson<RecipeSuggestionsResponse>(
            `${AI_SERVICE_BASE_URL}/suggestions?${search.toString()}`
        );

        return Array.isArray(response.suggestions) ? response.suggestions : [];
    } catch {
        throw toUserSafeError('No pudimos obtener sugerencias por ahora.');
    }
};