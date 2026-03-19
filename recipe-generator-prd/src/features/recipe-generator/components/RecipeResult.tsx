import type { Recipe } from '../model/recipe';

interface RecipeResultProps {
  recipe: Recipe;
}

const RecipeResult = ({ recipe }: RecipeResultProps) => {
  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{recipe.title}</h2>
        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1">
            Dificultad: {recipe.difficulty}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1">
            Prep: {recipe.preparationTimeMinutes} min
          </span>
          {typeof recipe.totalTimeMinutes === 'number' ? (
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Total: {recipe.totalTimeMinutes} min
            </span>
          ) : null}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">Ingredientes</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={`${ingredient.name}-${index}`} className="rounded-md bg-slate-50 px-3 py-2">
                {ingredient.quantity} {ingredient.unit} {ingredient.name}
                {ingredient.notes ? ` (${ingredient.notes})` : ''}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">Macros</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="rounded-md bg-slate-50 px-3 py-2">Calorias: {recipe.macros.calories}</li>
            <li className="rounded-md bg-slate-50 px-3 py-2">Proteina: {recipe.macros.protein} g</li>
            <li className="rounded-md bg-slate-50 px-3 py-2">Carbohidratos: {recipe.macros.carbohydrates} g</li>
            <li className="rounded-md bg-slate-50 px-3 py-2">Grasas: {recipe.macros.fats} g</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">Instrucciones</h3>
        <ol className="space-y-2 text-sm text-slate-700">
          {recipe.instructions.map((step, index) => (
            <li key={`${index}-${step}`} className="rounded-md bg-slate-50 px-3 py-2">
              {index + 1}. {step}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default RecipeResult;
