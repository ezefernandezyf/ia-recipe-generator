import type { ChangeEvent } from 'react';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { validateServings } from '../model/validation';

interface RecipeRequestPanelProps {
    servings: number | null;
    notes: string;
    onServingsChange: (value: number | null) => void;
    onNotesChange: (value: string) => void;
}

type RecipeRequestPanelView = ReactElement;

const RecipeRequestPanel = ({
    servings,
    notes,
    onServingsChange,
    onNotesChange,
}: RecipeRequestPanelProps): RecipeRequestPanelView => {
    const servingsInputId = 'recipe-request-servings';
    const notesTextareaId = 'recipe-request-notes';
    const [servingsError, setServingsError] = useState<string | null>(null);

    const syncServingsValue = (rawValue: string) => {
        const trimmedValue = rawValue.trim();

        if (trimmedValue.length === 0) {
            setServingsError(validateServings(null));
            onServingsChange(null);
            return;
        }

        const parsed = Number(trimmedValue);
        const nextError = validateServings(parsed);

        if (nextError) {
            setServingsError(nextError);
            onServingsChange(null);
            return;
        }

        setServingsError(null);
        onServingsChange(parsed);
    };

    const handleServingsChange = (event: ChangeEvent<HTMLInputElement>) => {
        syncServingsValue(event.target.value);
    };

    const handleNotesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        onNotesChange(event.target.value);
    };

    return (
        <section className="space-y-4 rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Preferencias</h2>
                <p className="text-sm text-stone-600">Ajustá porciones y notas para guiar mejor la receta final.</p>
            </div>

            <div>
                <label htmlFor={servingsInputId} className="mb-1 block text-sm font-medium text-stone-700">Porciones</label>
                <input
                    id={servingsInputId}
                    type="text"
                    inputMode="numeric"
                    role="spinbutton"
                    min="1"
                    defaultValue={servings ?? ''}
                    onChange={handleServingsChange}
                    aria-valuemin={1}
                    aria-valuenow={servings ?? undefined}
                    aria-invalid={Boolean(servingsError)}
                    className="w-full rounded-full border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-40"
                />
                {servingsError ? <p className="mt-1 text-xs font-medium text-rose-600">{servingsError}</p> : null}
            </div>

            <div>
                <label htmlFor={notesTextareaId} className="mb-1 block text-sm font-medium text-stone-700">Notas para la receta</label>
                <textarea
                    id={notesTextareaId}
                    value={notes}
                    onChange={handleNotesChange}
                    rows={3}
                    placeholder="Ej: sin picante, alto en proteínas"
                    className="w-full rounded-2xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
            </div>
        </section>
    );
};

export default RecipeRequestPanel;
