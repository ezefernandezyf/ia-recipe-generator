import { NoObjectGeneratedError, Output, generateText } from 'ai';
import { z } from 'zod';
import { isMissingAiProviderError, resolveRecipeModel } from './_provider';

const suggestionsSchema = z.object({
    suggestions: z.array(z.string().min(1)).min(1),
});

const errorResponse = (message: string, status: number): Response => {
    return Response.json({ error: message }, { status });
};

const handleSuggestionsRequest = async (request: Request): Promise<Response> => {
    if (request.method !== 'GET') {
        return Response.json({ error: 'Method Not Allowed' }, { status: 405 });
    }

    const url = new URL(request.url);
    const diet = url.searchParams.get('diet');
    const maxPreparationTimeMinutes = url.searchParams.get('maxPreparationTimeMinutes');

    const result = await generateText({
        model: resolveRecipeModel(),
        system: 'Sos un asistente que sugiere ideas de recetas breves.',
        prompt: buildPrompt(diet, maxPreparationTimeMinutes),
        output: Output.object({
            schema: suggestionsSchema,
        }),
    });

    return Response.json(result.output);
};

const buildPrompt = (diet: string | null, maxPreparationTimeMinutes: string | null): string => {
    return [
        'Genera sugerencias cortas de recetas y devuelvelas como JSON con una propiedad suggestions.',
        'Cada sugerencia debe ser una frase breve en espanol.',
        diet ? `Preferencia de dieta: ${diet}` : 'Sin preferencia de dieta.',
        maxPreparationTimeMinutes
            ? `Tiempo maximo de preparacion: ${maxPreparationTimeMinutes} minutos.`
            : 'Sin limite de tiempo de preparacion.',
    ].join('\n');
};

export async function GET(request: Request): Promise<Response> {
    try {
        return await handleSuggestionsRequest(request);
    } catch (error) {
        if (isMissingAiProviderError(error)) {
            return errorResponse(error.message, 503);
        }

        if (NoObjectGeneratedError.isInstance(error)) {
            return errorResponse('No pudimos obtener sugerencias por ahora.', 502);
        }

        console.error('Recipe suggestions failed:', error);
        return errorResponse('No pudimos obtener sugerencias por ahora.', 502);
    }
}

export default {
    fetch(request: Request): Promise<Response> {
        return GET(request);
    },
};