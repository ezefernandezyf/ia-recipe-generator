export const ALLOWED_INGREDIENT_UNITS = [
    'g',
    'kg',
    'ml',
    'l',
    'cup',
    'tbsp',
    'tsp',
    'unit',
] as const;

export type IngredientUnit = (typeof ALLOWED_INGREDIENT_UNITS)[number];
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Macros {
    calories: number;
    protein: number;
    carbohydrates: number;
    fats: number;
}

export interface Ingredient {
    name: string;
    quantity: number;
    unit: IngredientUnit;
    notes?: string;
}

export interface Recipe {
    id?: string;
    title: string;
    ingredients: Ingredient[];
    instructions: string[];
    preparationTimeMinutes: number;
    totalTimeMinutes?: number;
    servings?: number;
    difficulty: DifficultyLevel;
    macros: Macros;
}