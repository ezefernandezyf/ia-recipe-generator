import { useState } from 'react';
import type { ReactElement } from 'react';

type SmokeTestStatus = 'idle' | 'loading' | 'success' | 'error';

type AIProviderName = 'groq' | 'google';

const DEFAULT_MODELS: Record<AIProviderName, string> = {
  groq: 'openai/gpt-oss-20b',
  google: 'gemini-2.5-flash',
};

interface ApiResponseView {
  ok: boolean;
  status: number;
  statusText: string;
  rawText: string;
  parsedJson: unknown;
}

type RecipeGeneratorSmokeTestPageView = ReactElement;

const SAMPLE_REQUEST = JSON.stringify(
  {
    ingredients: [
      { name: 'Tomate', quantity: 2, unit: 'unit', notes: '' },
      { name: 'Cebolla', quantity: 1, unit: 'unit', notes: '' },
      { name: 'Aceite de oliva', quantity: 1, unit: 'tbsp', notes: '' },
    ],
    servings: 2,
    notes: 'Prueba de extremo a extremo desde el navegador.',
  },
  null,
  2
);

const prettyJson = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const parseResponseBody = (rawText: string): unknown => {
  if (rawText.trim().length === 0) {
    return null;
  }

  try {
    return JSON.parse(rawText) as unknown;
  } catch {
    return rawText;
  }
};

const RecipeGeneratorSmokeTestPage = (): RecipeGeneratorSmokeTestPageView => {
  const [provider, setProvider] = useState<AIProviderName>('groq');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(DEFAULT_MODELS.groq);
  const [requestBody, setRequestBody] = useState(SAMPLE_REQUEST);
  const [status, setStatus] = useState<SmokeTestStatus>('idle');
  const [response, setResponse] = useState<ApiResponseView | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setProvider('groq');
    setApiKey('');
    setModel(DEFAULT_MODELS.groq);
    setRequestBody(SAMPLE_REQUEST);
    setStatus('idle');
    setResponse(null);
    setError(null);
  };

  const handleRunTest = async () => {
    if (apiKey.trim().length === 0) {
      setStatus('error');
      setError('Ingresá una API key para ejecutar el smoke test.');
      return;
    }

    setStatus('loading');
    setResponse(null);
    setError(null);

    try {
      const parsedRequest = JSON.parse(requestBody) as unknown;
      const fetchResponse = await fetch('/api/recipe-generator/debug/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          apiKey,
          model: model.trim().length > 0 ? model.trim() : undefined,
          request: parsedRequest,
        }),
      });
      const rawText = await fetchResponse.text();

      setResponse({
        ok: fetchResponse.ok,
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        rawText,
        parsedJson: parseResponseBody(rawText),
      });
      setStatus(fetchResponse.ok ? 'success' : 'error');
    } catch (caught) {
      setStatus('error');

      if (caught instanceof SyntaxError) {
        setError('El JSON del request no es válido. Revisá el payload antes de enviar.');
        return;
      }

      if (caught instanceof Error && caught.message.trim().length > 0) {
        setError(caught.message);
        return;
      }

      setError('El smoke test falló por un error inesperado.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Smoke Test
            </span>
            <span
              className={[
                'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]',
                status === 'success'
                  ? 'bg-emerald-400/15 text-emerald-200'
                  : status === 'error'
                    ? 'bg-rose-400/15 text-rose-200'
                    : status === 'loading'
                      ? 'bg-amber-400/15 text-amber-200'
                      : 'bg-slate-800 text-slate-300',
              ].join(' ')}
            >
              {status}
            </span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-white">Recipe API Debug Console</h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-300">
              Este panel pega directo al endpoint real, muestra el status HTTP, el texto crudo y el JSON parseado.
              Sirve para separar problemas de UI, middleware, provider y credenciales sin intermediarios.
            </p>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Request payload</h2>
                <p className="text-sm text-slate-400">Elegí provider, clave y modelo antes de disparar el fetch al endpoint real.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleRunTest}
                  disabled={status === 'loading'}
                  className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'loading' ? 'Probando...' : 'Run smoke test'}
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Service</span>
                <select
                  value={provider}
                  onChange={(event) => {
                    const nextProvider = event.target.value as AIProviderName;
                    setProvider(nextProvider);
                    setModel(DEFAULT_MODELS[nextProvider]);
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
                >
                  <option value="groq">Groq</option>
                  <option value="google">Google</option>
                </select>
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-300">API key</span>
                <input
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  type="password"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Pegá la API key acá"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">Model</span>
              <input
                value={model}
                onChange={(event) => setModel(event.target.value)}
                type="text"
                spellCheck={false}
                placeholder={DEFAULT_MODELS[provider]}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">JSON request</span>
              <textarea
                value={requestBody}
                onChange={(event) => setRequestBody(event.target.value)}
                rows={20}
                spellCheck={false}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-sm leading-6 text-slate-100 outline-none transition focus:border-cyan-400"
              />
            </label>

            {error ? (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
                {error}
              </div>
            ) : null}
            <p className="text-xs leading-5 text-slate-500">
              La API key se envía solo a la ruta de debug local para esta prueba. No se guarda en el repositorio ni en el navegador.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/10">
            <div>
              <h2 className="text-lg font-semibold text-white">Response</h2>
              <p className="text-sm text-slate-400">Acá ves el raw text y el JSON parseado, tal cual sale del endpoint.</p>
            </div>

            <div className="space-y-2">
              <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">HTTP status</div>
                <div className="mt-1 text-2xl font-semibold text-white">
                  {response ? `${response.status} ${response.statusText}` : 'Sin respuesta todavía'}
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  {response ? (response.ok ? 'La llamada llegó al endpoint.' : 'El endpoint respondió con error.') : 'Esperando el primer test.'}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Raw response</h3>
                <pre className="max-h-72 overflow-auto rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200">
                  {response ? response.rawText : 'Sin contenido'}
                </pre>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Parsed JSON</h3>
                <pre className="max-h-72 overflow-auto rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200">
                  {response ? prettyJson(response.parsedJson) : 'Sin contenido'}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RecipeGeneratorSmokeTestPage;