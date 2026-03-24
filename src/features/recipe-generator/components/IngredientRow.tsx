import type { ChangeEvent } from 'react';
import type { ReactElement } from 'react';
import { ALLOWED_INGREDIENT_UNITS } from '../model/recipe';
import { isAllowedIngredientUnit, type IngredientValidationErrors } from '../model/validation';
import type { IngredientFormRow } from '../model/defaults';

type IngredientRowView = ReactElement;

interface IngredientRowProps {
    row: IngredientFormRow;
    errors: IngredientValidationErrors;
    disableRemove: boolean;
    onChange: (id: string, patch: Partial<IngredientFormRow>) => void;
    onRemove: (id: string) => void;
}

const IngredientRow = ({
    row,
    errors,
    disableRemove,
    onChange,
    onRemove,
}: IngredientRowProps): IngredientRowView => {
    const nameInputId = `ingredient-name-${row.id}`;
    const quantityInputId = `ingredient-quantity-${row.id}`;
    const unitSelectId = `ingredient-unit-${row.id}`;
    const notesInputId = `ingredient-notes-${row.id}`;

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(row.id, { name: event.target.value });
    };

    const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value;

        if (rawValue.trim().length === 0) {
            onChange(row.id, { quantity: null });
            return;
        }

        const parsed = Number(rawValue);

        if (!Number.isFinite(parsed) || parsed <= 0) {
            onChange(row.id, { quantity: null });
            return;
        }

        onChange(row.id, { quantity: parsed });
    };

    const handleUnitChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const nextUnit = event.target.value;

        if (!isAllowedIngredientUnit(nextUnit)) {
            return;
        }

        onChange(row.id, { unit: nextUnit });
    };

    const handleNotesChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(row.id, { notes: event.target.value });
    };

    return (
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-stone-200 bg-stone-50/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)] md:grid-cols-12">
            <div className="md:col-span-4">
                <label htmlFor={nameInputId} className="mb-1 block text-sm font-medium text-stone-700">Ingrediente</label>
                <input
                    id={nameInputId}
                    value={row.name}
                    onChange={handleNameChange}
                    placeholder="Ej: Tomate"
                    aria-invalid={Boolean(errors.name)}
                    className="w-full rounded-full border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {errors.name ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.name}</p> : null}
            </div>

            <div className="md:col-span-2">
                <label htmlFor={quantityInputId} className="mb-1 block text-sm font-medium text-stone-700">Cantidad</label>
                <input
                    id={quantityInputId}
                    type="number"
                    min="0"
                    step="0.1"
                    value={row.quantity ?? ''}
                    onChange={handleQuantityChange}
                    aria-invalid={Boolean(errors.quantity)}
                    className="w-full rounded-full border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {errors.quantity ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.quantity}</p> : null}
            </div>

            <div className="md:col-span-2">
                <label htmlFor={unitSelectId} className="mb-1 block text-sm font-medium text-stone-700">Unidad</label>
                <select
                    id={unitSelectId}
                    value={row.unit}
                    onChange={handleUnitChange}
                    aria-invalid={Boolean(errors.unit)}
                    className="w-full rounded-full border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                    {ALLOWED_INGREDIENT_UNITS.map((unit) => (
                        <option key={unit} value={unit}>
                            {unit}
                        </option>
                    ))}
                </select>
                {errors.unit ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.unit}</p> : null}
            </div>

            <div className="md:col-span-3">
                <label htmlFor={notesInputId} className="mb-1 block text-sm font-medium text-stone-700">Notas</label>
                <input
                    id={notesInputId}
                    value={row.notes}
                    onChange={handleNotesChange}
                    placeholder="Opcional"
                    className="w-full rounded-full border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
            </div>

            <div className="md:col-span-2 md:flex md:items-end">
                <button
                    type="button"
                    disabled={disableRemove}
                    onClick={() => onRemove(row.id)}
                    className="w-full rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:min-w-28 md:self-end"
                >
                    Quitar
                </button>
            </div>
        </div>
    );
};

export default IngredientRow;
