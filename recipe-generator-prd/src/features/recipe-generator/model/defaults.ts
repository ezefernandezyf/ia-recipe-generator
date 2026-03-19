import { IngredientUnit } from './recipe';

export interface IngredientFormRow {
    id: string;
    name: string;
    quantity: number | null;
    unit: IngredientUnit;
    notes: string;
}

export type IngredientFormRows = [IngredientFormRow, ...IngredientFormRow[]];

export interface RecipeRequestFormState {
    ingredients: IngredientFormRows;
    servings: number | null;
    notes: string;
}

const DEFAULT_UNIT: IngredientUnit = 'unit';

const createRowId = (): string => {
    return `ingredient-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const createEmptyIngredientRow = (): IngredientFormRow => {
    return {
        id: createRowId(),
        name: '',
        quantity: null,
        unit: DEFAULT_UNIT,
        notes: '',
    };
};

export const createDefaultRecipeRequestState = (): RecipeRequestFormState => {
    return {
        ingredients: [createEmptyIngredientRow()],
        servings: 2,
        notes: '',
    };
};
