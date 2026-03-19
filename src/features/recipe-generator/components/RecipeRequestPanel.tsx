import type { ChangeEvent } from 'react';
import { useState } from 'react';

interface RecipeRequestPanelProps {
    servings: number | null;
    notes: string;
    onServingsChange: (value: number | null) => void;
    onNotesChange: (value: string) => void;
}

const isValidServingsValue = (value: string): value is `${number}` => {
    if (value.trim().length === 0) {
        return false;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) && Number.isInteger(parsed) && parsed > 0;
};

const RecipeRequestPanel = ({
    servings,
    notes,
    onServingsChange,
    onNotesChange,
}: RecipeRequestPanelProps) => {
    const servingsInputId = 'recipe-request-servings';
    const notesTextareaId = 'recipe-request-notes';
    const [servingsError, setServingsError] = useState<string | null>(null);

    const handleServingsChange = (event: ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value.trim();

        if (!isValidServingsValue(rawValue)) {
            setServingsError('Ingresá un número de porciones mayor que 0.');
            onServingsChange(null);
            return;
        }

        const parsed = Number(rawValue);
        setServingsError(null);
        onServingsChange(parsed);
    };

    const handleNotesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        onNotesChange(event.target.value);
    };

    return (
        <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-base font-semibold text-slate-900">Preferencias</h2>

            <div>
                <label htmlFor={servingsInputId} className="mb-1 block text-sm font-medium text-slate-700">Porciones</label>
                <input
                    id={servingsInputId}
                    type="number"
                    min="1"
                    value={servings ?? ''}
                    onChange={handleServingsChange}
                    aria-invalid={Boolean(servingsError)}
                    className="w-40 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                />
                {servingsError ? <p className="mt-1 text-xs text-rose-600">{servingsError}</p> : null}
            </div>

            <div>
                <label htmlFor={notesTextareaId} className="mb-1 block text-sm font-medium text-slate-700">Notas para la receta</label>
                <textarea
                    id={notesTextareaId}
                    value={notes}
                    onChange={handleNotesChange}
                    rows={3}
                    placeholder="Ej: sin picante, alto en proteínas"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                />
            </div>
        </section>
    );
};

export default RecipeRequestPanel;
