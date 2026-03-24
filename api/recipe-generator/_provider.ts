import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';

export type AIProviderName = 'groq' | 'google';

class MissingAiProviderError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'MissingAiProviderError';
    }
}

const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-20b';
const DEFAULT_GOOGLE_MODEL = 'gemini-2.5-flash';

const hasConfiguredValue = (value: string | undefined): value is string => {
    return typeof value === 'string' && value.trim().length > 0;
};

const assertConfigured = (name: string, value: string | undefined) => {
    if (!hasConfiguredValue(value)) {
        throw new MissingAiProviderError(`Falta configurar ${name}.`);
    }
};

const resolveProviderName = (): AIProviderName => {
    if (process.env.AI_PROVIDER === 'google') {
        return 'google';
    }

    if (process.env.AI_PROVIDER === 'groq') {
        return 'groq';
    }

    if (hasConfiguredValue(process.env.GROQ_API_KEY)) {
        return 'groq';
    }

    if (hasConfiguredValue(process.env.GOOGLE_GENERATIVE_AI_API_KEY)) {
        return 'google';
    }

    return 'groq';
};

export const isMissingAiProviderError = (error: unknown): error is MissingAiProviderError => {
    return error instanceof MissingAiProviderError;
};

export const resolveRecipeModel = () => {
    const providerName = resolveProviderName();

    if (providerName === 'google') {
        assertConfigured('GOOGLE_GENERATIVE_AI_API_KEY', process.env.GOOGLE_GENERATIVE_AI_API_KEY);
        return google(process.env.GOOGLE_MODEL ?? DEFAULT_GOOGLE_MODEL);
    }

    assertConfigured('GROQ_API_KEY', process.env.GROQ_API_KEY);
    return groq(process.env.GROQ_MODEL ?? DEFAULT_GROQ_MODEL);
};