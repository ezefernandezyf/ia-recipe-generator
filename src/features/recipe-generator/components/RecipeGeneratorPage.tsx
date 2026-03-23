import { useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { createDefaultRecipeRequestState, type IngredientFormRow, type IngredientFormRows } from '../model/defaults';
import type { Ingredient } from '../model/recipe';
import { hasIngredientErrors, validateIngredients, validateServings } from '../model/validation';
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
  const requestSequenceRef = useRef(0);
  const activeAbortControllerRef = useRef<AbortController | null>(null);

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

    if (ingredients.length === 0) {
      setError('Agregá al menos un ingrediente antes de generar la receta.');
      return;
    }

    const validationResults = validateIngredients(ingredients);
    const hasErrors = validationResults.some(hasIngredientErrors);

    if (hasErrors) {
      console.error('Recipe generation blocked by ingredient validation errors:', validationResults);
      setError('Revisá los ingredientes marcados antes de generar la receta.');
      return;
    }

    const servingsError = validateServings(servings);

    if (servingsError) {
      setError(servingsError);
      return;
    }

    if (!areReadyIngredientRows(ingredients)) {
      setError('Revisá los ingredientes marcados antes de generar la receta.');
      return;
    }

    const requestId = requestSequenceRef.current + 1;
    requestSequenceRef.current = requestId;

    activeAbortControllerRef.current?.abort();

    const abortController = new AbortController();
    activeAbortControllerRef.current = abortController;

    setIsLoading(true);
    setError(null);
    setRecipe(null);

    const normalizedServings = servings ?? undefined;

    try {
      const generated = await generateRecipe({
        ingredients: mapRowsToIngredients(ingredients),
        servings: normalizedServings,
        notes,
      }, { signal: abortController.signal });

      if (requestSequenceRef.current !== requestId) {
        return;
      }

      setRecipe(generated);
    } catch (caught) {
      if (requestSequenceRef.current !== requestId) {
        return;
      }

      if (caught instanceof DOMException && caught.name === 'AbortError') {
        return;
      }

      console.error('Recipe generation failed:', caught);
      setError(getRecipeGenerationErrorMessage(caught));
    } finally {
      if (requestSequenceRef.current !== requestId) {
        return;
      }

      activeAbortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(217,119,6,0.12),transparent_30%),linear-gradient(180deg,#f8f5ef_0%,#f3efe6_100%)] px-4 py-8 text-stone-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-stone-200 bg-white/85 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            <span className="rounded-full bg-secondary px-3 py-1 text-white">IA Recipe Generator</span>
            <span>Reliable generation</span>
            <span>Zod 4</span>
            <span>Editorial UI</span>
          </div>
          <div className="mt-4 space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-stone-950 md:text-4xl">Generador de Recetas</h1>
            <p className="max-w-3xl text-sm leading-6 text-stone-600">Ingresá ingredientes y preferencias para obtener una receta sugerida, con cancelación de requests viejas y una interfaz más clara.</p>
          </div>
          <Link to="/debug/recipe-generator" className="mt-4 inline-flex text-sm font-semibold text-primary transition hover:text-secondary">
            Abrir smoke test de API
          </Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <IngredientForm rows={formState.ingredients} onChange={handleIngredientsChange} />
            <RecipeRequestPanel
              servings={formState.servings}
              notes={formState.notes}
              onServingsChange={handleServingsChange}
              onNotesChange={handleNotesChange}
            />
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-stone-200 bg-white/90 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {isLoading ? 'Generando...' : 'Generar receta'}
              </button>
              {error ? <span className="text-sm font-medium text-rose-600">{error}</span> : <span className="text-sm text-stone-500">La última solicitud siempre gana.</span>}
            </div>
          </div>

          <div className="space-y-6">
            {recipe ? <RecipeResult recipe={recipe} /> : <div className="rounded-3xl border border-dashed border-stone-300 bg-white/75 p-8 text-sm text-stone-500 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">Todavía no hay receta generada. Completá el formulario y ejecutá la generación para ver el resultado acá.</div>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default RecipeGeneratorPage;
