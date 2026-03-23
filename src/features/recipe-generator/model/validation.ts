import { z } from 'zod';
import { ALLOWED_INGREDIENT_UNITS, Ingredient, IngredientUnit } from './recipe';

export type IngredientValidationInput = Omit<Partial<Ingredient>, 'quantity'> & {
    quantity?: number | null;
};

export interface IngredientValidationErrors {
    name?: string;
    quantity?: string;
    unit?: string;
}

const ingredientUnitSchema = z.enum(ALLOWED_INGREDIENT_UNITS);

const ALLOWED_UNITS = new Set<string>(ALLOWED_INGREDIENT_UNITS);

const ingredientValidationSchema = z.object({
    name: z.string({ error: 'Ingredient name is required.' }).trim().min(1, { error: 'Ingredient name is required.' }),
    quantity: z.union([z.number(), z.null()]).refine(
        (value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0,
        { error: 'Quantity must be a number greater than 0.' }
    ),
    unit: ingredientUnitSchema,
    notes: z.string().optional(),
});

const servingsSchema = z.union([
    z.number({ error: 'Ingresá un número de porciones mayor que 0.' })
        .int({ error: 'Ingresá un número de porciones mayor que 0.' })
        .positive({ error: 'Ingresá un número de porciones mayor que 0.' }),
    z.null(),
]).refine(
    (value): value is number => typeof value === 'number',
    { error: 'Ingresá un número de porciones mayor que 0.' }
);

export const isAllowedIngredientUnit = (unit: string): unit is IngredientUnit => {
    return ALLOWED_UNITS.has(unit);
};

export const validateIngredient = (
    ingredient: IngredientValidationInput
): IngredientValidationErrors => {
    const errors: IngredientValidationErrors = {};

    const parsedIngredient = ingredientValidationSchema.safeParse(ingredient);

    if (parsedIngredient.success) {
        return errors;
    }

    for (const issue of parsedIngredient.error.issues) {
        const fieldName = issue.path[0];

        if (fieldName === 'name') {
            errors.name = issue.message;
            continue;
        }

        if (fieldName === 'quantity') {
            errors.quantity = issue.message;
            continue;
        }

        if (fieldName === 'unit') {
            errors.unit = `Unit must be one of: ${ALLOWED_INGREDIENT_UNITS.join(', ')}.`;
        }
    }

    return errors;
};

export const validateServings = (servings: number | null): string | null => {
    const parsedServings = servingsSchema.safeParse(servings);

    return parsedServings.success ? null : parsedServings.error.issues[0]?.message ?? 'Ingresá un número de porciones mayor que 0.';
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
