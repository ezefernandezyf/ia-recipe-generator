import type { DifficultyLevel, Ingredient, IngredientUnit, Macros, Recipe } from '../model/recipe';

interface PartialApiIngredient {
    name?: unknown;
    quantity?: unknown;
    unit?: unknown;
    notes?: unknown;
}

interface PartialApiMacros {
    calories?: unknown;
    protein?: unknown;
    carbohydrates?: unknown;
    fats?: unknown;
}

interface PartialApiRecipe {
    id?: unknown;
    title?: unknown;
    ingredients?: unknown;
    instructions?: unknown;
    preparationTimeMinutes?: unknown;
    totalTimeMinutes?: unknown;
    servings?: unknown;
    difficulty?: unknown;
    macros?: unknown;
}

const DIFFICULTY = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
} as const;

const ALLOWED_DIFFICULTIES = new Set<string>(Object.values(DIFFICULTY));

const ALLOWED_UNITS = new Set<IngredientUnit>(['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'unit']);

const asString = (value: unknown, fallback = ''): string => {
    return typeof value === 'string' ? value : fallback;
};

const asNumber = (value: unknown, fallback = 0): number => {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
};

const asStringArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.filter((entry): entry is string => typeof entry === 'string');
};

const toIngredient = (input: PartialApiIngredient): Ingredient => {
    const maybeUnit = asString(input.unit, 'unit');
    const unit: IngredientUnit = ALLOWED_UNITS.has(maybeUnit as IngredientUnit)
        ? (maybeUnit as IngredientUnit)
        : 'unit';

    return {
        name: asString(input.name),
        quantity: asNumber(input.quantity),
        unit,
        notes: asString(input.notes),
    };
};

const toMacros = (input: PartialApiMacros): Macros => {
    return {
        calories: asNumber(input.calories),
        protein: asNumber(input.protein),
        carbohydrates: asNumber(input.carbohydrates),
        fats: asNumber(input.fats),
    };
};

const toDifficulty = (value: unknown): DifficultyLevel => {
    const maybeDifficulty = asString(value, DIFFICULTY.MEDIUM);
    return ALLOWED_DIFFICULTIES.has(maybeDifficulty)
        ? (maybeDifficulty as DifficultyLevel)
        : DIFFICULTY.MEDIUM;
};

export const mapApiRecipeToDomain = (input: unknown): Recipe => {
    const data: PartialApiRecipe =
        typeof input === 'object' && input !== null ? (input as PartialApiRecipe) : {};

    const ingredientsRaw = Array.isArray(data.ingredients)
        ? (data.ingredients as PartialApiIngredient[])
        : [];

    const macrosRaw: PartialApiMacros =
        typeof data.macros === 'object' && data.macros !== null
            ? (data.macros as PartialApiMacros)
            : {};

    return {
        id: asString(data.id) || undefined,
        title: asString(data.title, 'Untitled recipe'),
        ingredients: ingredientsRaw.map(toIngredient),
        instructions: asStringArray(data.instructions),
        preparationTimeMinutes: asNumber(data.preparationTimeMinutes),
        totalTimeMinutes: asNumber(data.totalTimeMinutes) || undefined,
        servings: asNumber(data.servings) || undefined,
        difficulty: toDifficulty(data.difficulty),
        macros: toMacros(macrosRaw),
    };
};
