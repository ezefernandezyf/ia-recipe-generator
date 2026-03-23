import type { ReactElement } from 'react';
import { createEmptyIngredientRow, type IngredientFormRow } from '../model/defaults';
import type { IngredientFormRows } from '../model/defaults';
import { validateIngredient, type IngredientValidationErrors } from '../model/validation';
import IngredientRow from './IngredientRow';

type IngredientFormView = ReactElement;

interface IngredientFormProps {
    rows: IngredientFormRows;
    onChange: (rows: IngredientFormRows) => void;
}

type IngredientFormRowPatch = Partial<Pick<IngredientFormRow, 'name' | 'quantity' | 'unit' | 'notes'>>;

const ensureIngredientFormRows = (rows: IngredientFormRow[]): IngredientFormRows => {
    if (rows.length === 0) {
        throw new Error('Ingredient form must contain at least one row.');
    }

    return rows as IngredientFormRows;
};

const IngredientForm = ({ rows, onChange }: IngredientFormProps): IngredientFormView => {
    const rowErrors: IngredientValidationErrors[] = rows.map(validateIngredient);

    const updateRow = (id: string, patch: IngredientFormRowPatch) => {
        const updated = ensureIngredientFormRows(rows.map((row) => {
            if (row.id !== id) {
                return row;
            }

            return { ...row, ...patch };
        }));

        onChange(updated);
    };

    const addRow = () => {
        const emptyRow: IngredientFormRow = createEmptyIngredientRow();
        const nextRows = ensureIngredientFormRows([emptyRow, ...rows]);

        onChange(nextRows);
    };

    const removeRow = (id: string) => {
        if (rows.length === 1) {
            return;
        }

        const nextRows = ensureIngredientFormRows(rows.filter((row) => row.id !== id));

        if (nextRows.length === 0) {
            return;
        }

        onChange(nextRows);
    };

    return (
        <section className="space-y-4 rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Ingredientes</h2>
                    <p className="text-sm text-stone-600">Agregá ingredientes y dejá la fila nueva arriba para cargarla enseguida.</p>
                </div>
                <button
                    type="button"
                    onClick={addRow}
                    className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                    Agregar ingrediente
                </button>
            </div>

            <div className="space-y-3">
                {rows.map((row, index) => (
                    <IngredientRow
                        key={row.id}
                        row={row}
                        errors={rowErrors[index]}
                        disableRemove={rows.length === 1}
                        onChange={updateRow}
                        onRemove={removeRow}
                    />
                ))}
            </div>
        </section>
    );
};

export default IngredientForm;
