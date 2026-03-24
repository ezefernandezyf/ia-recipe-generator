import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resolveRecipeModel } from './_provider';

const mocks = vi.hoisted(() => ({
    groq: vi.fn(() => 'groq-model'),
    google: vi.fn(() => 'google-model'),
}));

vi.mock('@ai-sdk/groq', () => ({
    groq: mocks.groq,
}));

vi.mock('@ai-sdk/google', () => ({
    google: mocks.google,
}));

describe('resolveRecipeModel', () => {
    beforeEach(() => {
        vi.unstubAllEnvs();
        mocks.groq.mockClear();
        mocks.google.mockClear();
    });

    it('uses Groq by default when configured', () => {
        vi.stubEnv('GROQ_API_KEY', 'groq-key');

        const model = resolveRecipeModel();

        expect(mocks.groq).toHaveBeenCalledWith('openai/gpt-oss-20b');
        expect(model).toBe('groq-model');
    });

    it('uses Google when AI_PROVIDER is google', () => {
        vi.stubEnv('AI_PROVIDER', 'google');
        vi.stubEnv('GOOGLE_GENERATIVE_AI_API_KEY', 'google-key');

        const model = resolveRecipeModel();

        expect(mocks.google).toHaveBeenCalledWith('gemini-2.5-flash');
        expect(model).toBe('google-model');
    });

    it('falls back to Google when AI_PROVIDER is unset and only the Google key is configured', () => {
        vi.stubEnv('GOOGLE_GENERATIVE_AI_API_KEY', 'google-key');

        const model = resolveRecipeModel();

        expect(mocks.google).toHaveBeenCalledWith('gemini-2.5-flash');
        expect(model).toBe('google-model');
    });
});