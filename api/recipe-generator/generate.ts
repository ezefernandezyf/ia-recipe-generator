import { NoObjectGeneratedError, Output, generateText } from 'ai';
import { z } from 'zod';
import { isMissingAiProviderError, resolveRecipeModel } from './_provider';

const ingredientUnitSchema = z.enum(['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'unit']);
const difficultySchema = z.enum(['easy', 'medium', 'hard']);

const requestIngredientSchema = z.object({
    name: z.string().min(1),
    quantity: z.number().positive(),
    unit: ingredientUnitSchema,
    notes: z.string().optional(),
});

const ingredientSchema = z.object({
    name: z.string().min(1),
    quantity: z.number().positive(),
    unit: ingredientUnitSchema,
    notes: z.string().nullable(),
});

const recipeSchema = z.object({
    id: z.string().nullable(),
    title: z.string().min(1),
    ingredients: z.array(ingredientSchema),
    instructions: z.array(z.string().min(1)),
    preparationTimeMinutes: z.number().int().nonnegative(),
    totalTimeMinutes: z.number().int().nonnegative().nullable(),
    servings: z.number().int().positive().nullable(),
    difficulty: difficultySchema,
    macros: z.object({
        calories: z.number().nonnegative(),
        protein: z.number().nonnegative(),
        carbohydrates: z.number().nonnegative(),
        fats: z.number().nonnegative(),
    }),
});

const requestSchema = z.object({
    ingredients: z.array(requestIngredientSchema).min(1),
    servings: z.number().int().positive(),
    notes: z.string().optional(),
});

const buildPrompt = (request: z.infer<typeof requestSchema>): string => {
    return [
        'Genera una receta en formato JSON con este esquema:',
        '- title, ingredients, instructions, preparationTimeMinutes, totalTimeMinutes, servings, difficulty, macros',
        '- ingredients debe respetar las unidades y cantidades provistas',
        '- instructions debe ser una lista de pasos claros y breves',
        '- difficulty debe ser easy, medium o hard',
        '- macros debe incluir calories, protein, carbohydrates y fats',
        '',
        `Pedido: ${JSON.stringify(request, null, 2)}`,
    ].join('\n');
};

const errorResponse = (message: string, status: number): Response => {
    return Response.json({ error: message }, { status });
};

const normalizeRecipeOutput = (recipe: z.infer<typeof recipeSchema>) => {
    return {
        ...recipe,
        id: recipe.id ?? undefined,
        totalTimeMinutes: recipe.totalTimeMinutes ?? undefined,
        servings: recipe.servings ?? undefined,
        ingredients: recipe.ingredients.map((ingredient) => ({
            ...ingredient,
            notes: ingredient.notes ?? undefined,
        })),
    };
};

export async function POST(request: Request): Promise<Response> {
    try {
        const body = await request.json();
        const parsed = requestSchema.safeParse(body);

        if (!parsed.success) {
            return errorResponse('Solicitud de receta invalida.', 400);
        }

        const result = await generateText({
            model: resolveRecipeModel(),
            system: 'Sos un chef experto que responde solo con JSON valido.',
            prompt: buildPrompt(parsed.data),
            output: Output.object({
                schema: recipeSchema,
            }),
        });

        return Response.json({ recipe: normalizeRecipeOutput(result.output) });
    } catch (error) {
        if (isMissingAiProviderError(error)) {
            return errorResponse(error.message, 503);
        }

        if (NoObjectGeneratedError.isInstance(error)) {
            return errorResponse('No pudimos generar la receta en este momento.', 502);
        }

        console.error('Recipe generation failed:', error);
        return errorResponse('No pudimos generar la receta en este momento.', 502);
    }
}