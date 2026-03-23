import type { ReactElement } from 'react';
import type { Recipe } from '../model/recipe';

interface RecipeResultProps {
  recipe: Recipe;
}

type RecipeResultView = ReactElement;

const RecipeResult = ({ recipe }: RecipeResultProps): RecipeResultView => {
  return (
    <section className="space-y-5 rounded-3xl border border-stone-200 bg-white/95 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.1)]">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Resultado</p>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">{recipe.title}</h2>
        <div className="flex flex-wrap gap-2 text-sm text-stone-600">
          <span className="rounded-full bg-stone-100 px-3 py-1">
            Dificultad: {recipe.difficulty}
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-1">
            Prep: {recipe.preparationTimeMinutes} min
          </span>
          {typeof recipe.totalTimeMinutes === 'number' ? (
            <span className="rounded-full bg-stone-100 px-3 py-1">
              Total: {recipe.totalTimeMinutes} min
            </span>
          ) : null}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Ingredientes</h3>
          <ul className="space-y-2 text-sm text-stone-700">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={`${ingredient.name}-${index}`} className="rounded-xl bg-white px-3 py-2 shadow-sm">
                {ingredient.quantity} {ingredient.unit} {ingredient.name}
                {ingredient.notes ? ` (${ingredient.notes})` : ''}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Macros</h3>
          <ul className="space-y-2 text-sm text-stone-700">
            <li className="rounded-xl bg-white px-3 py-2 shadow-sm">Calorias: {recipe.macros.calories}</li>
            <li className="rounded-xl bg-white px-3 py-2 shadow-sm">Proteina: {recipe.macros.protein} g</li>
            <li className="rounded-xl bg-white px-3 py-2 shadow-sm">Carbohidratos: {recipe.macros.carbohydrates} g</li>
            <li className="rounded-xl bg-white px-3 py-2 shadow-sm">Grasas: {recipe.macros.fats} g</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Instrucciones</h3>
        <ol className="space-y-2 text-sm text-stone-700">
          {recipe.instructions.map((step, index) => (
            <li key={`${index}-${step}`} className="rounded-xl bg-stone-50 px-3 py-2 shadow-sm">
              {index + 1}. {step}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default RecipeResult;
