import { useState } from 'react';
import type { ReactElement } from 'react';
import { createDefaultRecipeRequestState, type IngredientFormRow, type IngredientFormRows } from '../model/defaults';
import type { Ingredient } from '../model/recipe';
import { validateIngredients } from '../model/validation';
import { generateRecipe } from '../services/ai';
import IngredientForm from './IngredientForm';
import RecipeRequestPanel from './RecipeRequestPanel';
import RecipeResult from './RecipeResult';

type RecipeGeneratorPageView = ReactElement;

type ReadyIngredientRow = IngredientFormRow & {
  quantity: number;
};

const normalizeIngredientNotes = (notes: unknown): string | undefined => {
  return typeof notes === 'string' && notes.trim().length > 0 ? notes.trim() : undefined;
};

const isReadyIngredientRow = (row: IngredientFormRow): row is ReadyIngredientRow => {
  return row.quantity !== null;
};

const areReadyIngredientRows = (rows: IngredientFormRows): rows is [ReadyIngredientRow, ...ReadyIngredientRow[]] => {
  return rows.every(isReadyIngredientRow);
};

const mapRowsToIngredients = (rows: ReadonlyArray<ReadyIngredientRow>): Ingredient[] => {
  return rows.map((row) => ({
    name: row.name.trim(),
    quantity: row.quantity,
    unit: row.unit,
    notes: normalizeIngredientNotes(row.notes),
  }));
};

const getRecipeGenerationErrorMessage = (caught: unknown): string => {
  if (caught instanceof Error && caught.message.trim().length > 0) {
    return caught.message;
  }

  if (typeof caught === 'string' && caught.trim().length > 0) {
    return caught.trim();
  }

  if (typeof caught === 'object' && caught !== null) {
    const maybeMessage = 'message' in caught ? (caught as { message?: unknown }).message : undefined;

    if (typeof maybeMessage === 'string' && maybeMessage.trim().length > 0) {
      return maybeMessage.trim();
    }
  }

  return 'No pudimos generar la receta en este momento. Revisá tu conexión e intentá nuevamente.';
};

const RecipeGeneratorPage = (): RecipeGeneratorPageView => {
  const [formState, setFormState] = useState(createDefaultRecipeRequestState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Awaited<ReturnType<typeof generateRecipe>> | null>(null);

  const handleIngredientsChange = (ingredients: IngredientFormRows) => {
    setFormState((prev) => {
      return { ...prev, ingredients };
    });
  };

  const handleServingsChange = (servings: number | null) => {
    setFormState((prev) => {
      return { ...prev, servings };
    });
  };

  const handleNotesChange = (notes: string) => {
    setFormState((prev) => {
      return { ...prev, notes };
    });
  };

  const handleSubmit = async () => {
    const { ingredients, notes, servings } = formState;
    const validationResults = validateIngredients(ingredients);
    const hasErrors = validationResults.some((item) => item.name || item.quantity || item.unit);

    if (hasErrors) {
      console.error('Recipe generation blocked by ingredient validation errors:', validationResults);
      setError('Revisá los ingredientes marcados antes de generar la receta.');
      return;
    }

    if (servings === null || !Number.isInteger(servings) || servings <= 0) {
      setError('Revisá las porciones antes de generar la receta.');
      return;
    }

    if (!areReadyIngredientRows(ingredients)) {
      setError('Revisá los ingredientes marcados antes de generar la receta.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const generated = await generateRecipe({
        ingredients: mapRowsToIngredients(ingredients),
        servings,
        notes,
      });
      setRecipe(generated);
    } catch (caught) {
      console.error('Recipe generation failed:', caught);
      setError(getRecipeGenerationErrorMessage(caught));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Generador de Recetas</h1>
          <p className="text-sm text-slate-600">Ingresa ingredientes y preferencias para obtener una receta sugerida.</p>
        </header>

        <IngredientForm rows={formState.ingredients} onChange={handleIngredientsChange} />
        <RecipeRequestPanel
          servings={formState.servings}
          notes={formState.notes}
          onServingsChange={handleServingsChange}
          onNotesChange={handleNotesChange}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Generando...' : 'Generar receta'}
          </button>
          {error ? <span className="text-sm text-rose-600">{error}</span> : null}
        </div>

        {recipe ? <RecipeResult recipe={recipe} /> : null}
      </div>
    </main>
  );
};

export default RecipeGeneratorPage;
