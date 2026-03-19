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
        <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-12">
            <div className="md:col-span-4">
                <label htmlFor={nameInputId} className="mb-1 block text-sm font-medium text-slate-700">Ingrediente</label>
                <input
                    id={nameInputId}
                    value={row.name}
                    onChange={handleNameChange}
                    placeholder="Ej: Tomate"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                />
                {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name}</p> : null}
            </div>

            <div className="md:col-span-2">
                <label htmlFor={quantityInputId} className="mb-1 block text-sm font-medium text-slate-700">Cantidad</label>
                <input
                    id={quantityInputId}
                    type="number"
                    min="0"
                    step="0.1"
                    value={row.quantity ?? ''}
                    onChange={handleQuantityChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                />
                {errors.quantity ? <p className="mt-1 text-xs text-rose-600">{errors.quantity}</p> : null}
            </div>

            <div className="md:col-span-2">
                <label htmlFor={unitSelectId} className="mb-1 block text-sm font-medium text-slate-700">Unidad</label>
                <select
                    id={unitSelectId}
                    value={row.unit}
                    onChange={handleUnitChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                >
                    {ALLOWED_INGREDIENT_UNITS.map((unit) => (
                        <option key={unit} value={unit}>
                            {unit}
                        </option>
                    ))}
                </select>
                {errors.unit ? <p className="mt-1 text-xs text-rose-600">{errors.unit}</p> : null}
            </div>

            <div className="md:col-span-3">
                <label htmlFor={notesInputId} className="mb-1 block text-sm font-medium text-slate-700">Notas</label>
                <input
                    id={notesInputId}
                    value={row.notes}
                    onChange={handleNotesChange}
                    placeholder="Opcional"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                />
            </div>

            <div className="md:col-span-1 md:flex md:items-end">
                <button
                    type="button"
                    disabled={disableRemove}
                    onClick={() => onRemove(row.id)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Quitar
                </button>
            </div>
        </div>
    );
};

export default IngredientRow;
