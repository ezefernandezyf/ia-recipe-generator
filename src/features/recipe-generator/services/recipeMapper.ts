import type { DifficultyLevel, Ingredient, IngredientUnit, Macros, Recipe } from '../model/recipe';

interface ValidApiIngredient {
    name: string;
    quantity: number;
    unit: IngredientUnit;
    notes?: string;
}

interface ValidApiMacros {
    calories: number;
    protein: number;
    carbohydrates: number;
    fats: number;
}

interface ValidApiRecipe {
    id?: string;
    title: string;
    ingredients: ValidApiIngredient[];
    instructions: string[];
    preparationTimeMinutes: number;
    totalTimeMinutes?: number;
    servings?: number;
    difficulty: DifficultyLevel;
    macros: ValidApiMacros;
}

class InvalidRecipePayloadError extends Error {
    constructor() {
        super('La respuesta de la receta no es valida.');
        this.name = 'InvalidRecipePayloadError';
    }
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

const isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null;
};

const isValidIngredient = (value: unknown): value is ValidApiIngredient => {
    if (!isObject(value)) {
        return false;
    }

    const maybeUnit = value.unit;

    return (
        typeof value.name === 'string' &&
        value.name.trim().length > 0 &&
        typeof value.quantity === 'number' &&
        Number.isFinite(value.quantity) &&
        value.quantity > 0 &&
        typeof maybeUnit === 'string' &&
        ALLOWED_UNITS.has(maybeUnit as IngredientUnit) &&
        (typeof value.notes === 'undefined' || typeof value.notes === 'string')
    );
};

const isValidMacros = (value: unknown): value is ValidApiMacros => {
    if (!isObject(value)) {
        return false;
    }

    return ['calories', 'protein', 'carbohydrates', 'fats'].every((key) => {
        const maybeValue = value[key as keyof ValidApiMacros];
        return typeof maybeValue === 'number' && Number.isFinite(maybeValue) && maybeValue >= 0;
    });
};

const isValidRecipePayload = (input: unknown): input is ValidApiRecipe => {
    if (!isObject(input)) {
        return false;
    }

    return (
        (typeof input.id === 'undefined' || typeof input.id === 'string') &&
        typeof input.title === 'string' &&
        input.title.trim().length > 0 &&
        Array.isArray(input.ingredients) &&
        input.ingredients.length > 0 &&
        input.ingredients.every(isValidIngredient) &&
        Array.isArray(input.instructions) &&
        input.instructions.length > 0 &&
        input.instructions.every((step) => typeof step === 'string' && step.trim().length > 0) &&
        typeof input.preparationTimeMinutes === 'number' &&
        Number.isInteger(input.preparationTimeMinutes) &&
        input.preparationTimeMinutes >= 0 &&
        (typeof input.totalTimeMinutes === 'undefined' || (typeof input.totalTimeMinutes === 'number' && Number.isInteger(input.totalTimeMinutes) && input.totalTimeMinutes >= 0)) &&
        (typeof input.servings === 'undefined' || (typeof input.servings === 'number' && Number.isInteger(input.servings) && input.servings > 0)) &&
        typeof input.difficulty === 'string' &&
        ALLOWED_DIFFICULTIES.has(input.difficulty) &&
        isValidMacros(input.macros)
    );
};

const throwInvalidRecipePayload = (): never => {
    throw new InvalidRecipePayloadError();
};

const toIngredient = (input: ValidApiIngredient): Ingredient => {
    const unit = input.unit;

    return {
        name: input.name,
        quantity: input.quantity,
        unit,
        notes: typeof input.notes === 'string' && input.notes.trim().length > 0 ? input.notes.trim() : undefined,
    };
};

const toMacros = (input: ValidApiMacros): Macros => {
    return {
        calories: input.calories,
        protein: input.protein,
        carbohydrates: input.carbohydrates,
        fats: input.fats,
    };
};

export const mapApiRecipeToDomain = (input: unknown): Recipe => {
    if (!isValidRecipePayload(input)) {
        throwInvalidRecipePayload();
    }

    const data = input as ValidApiRecipe;

    return {
        id: data.id || undefined,
        title: data.title,
        ingredients: data.ingredients.map(toIngredient),
        instructions: data.instructions,
        preparationTimeMinutes: data.preparationTimeMinutes,
        totalTimeMinutes: data.totalTimeMinutes,
        servings: data.servings,
        difficulty: data.difficulty,
        macros: toMacros(data.macros),
    };
};
