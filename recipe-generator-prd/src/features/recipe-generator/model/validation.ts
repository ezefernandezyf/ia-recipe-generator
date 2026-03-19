import { ALLOWED_INGREDIENT_UNITS, Ingredient, IngredientUnit } from './recipe';

export type IngredientValidationInput = Omit<Partial<Ingredient>, 'quantity'> & {
    quantity?: number | null;
};

export interface IngredientValidationErrors {
    name?: string;
    quantity?: string;
    unit?: string;
}

const ALLOWED_UNITS = new Set<string>(ALLOWED_INGREDIENT_UNITS);

export const isAllowedIngredientUnit = (unit: string): unit is IngredientUnit => {
    return ALLOWED_UNITS.has(unit);
};

export const validateIngredient = (
    ingredient: IngredientValidationInput
): IngredientValidationErrors => {
    const errors: IngredientValidationErrors = {};

    if (!ingredient.name || ingredient.name.trim().length === 0) {
        errors.name = 'Ingredient name is required.';
    }

    if (
        typeof ingredient.quantity !== 'number' ||
        !Number.isFinite(ingredient.quantity) ||
        ingredient.quantity <= 0
    ) {
        errors.quantity = 'Quantity must be a number greater than 0.';
    }

    if (!ingredient.unit || !isAllowedIngredientUnit(ingredient.unit)) {
        errors.unit = `Unit must be one of: ${ALLOWED_INGREDIENT_UNITS.join(', ')}.`;
    }

    return errors;
};

export const hasIngredientErrors = (
    errors: IngredientValidationErrors
): boolean => {
    return Boolean(errors.name || errors.quantity || errors.unit);
};

export const validateIngredients = (
    ingredients: ReadonlyArray<IngredientValidationInput>
): IngredientValidationErrors[] => {
    return ingredients.map(validateIngredient);
};
