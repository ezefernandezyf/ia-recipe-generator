import type { IncomingMessage, ServerResponse } from 'node:http';
import { z } from 'zod';
import { GET as getRecipeSuggestions } from './suggestions';
import { POST as generateRecipe } from './generate';

type NextFunction = () => void;

const RECIPE_API_PREFIX = '/api/recipe-generator';
const debugRecipeRequestSchema = z.object({
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
      unit: z.enum(['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'unit']),
      notes: z.string().optional(),
    })
  ).min(1),
  servings: z.number().int().positive(),
  notes: z.string().optional(),
});

const debugGenerateSchema = z.object({
  provider: z.enum(['groq', 'google']),
  apiKey: z.string().min(1),
  model: z.string().min(1).optional(),
  request: debugRecipeRequestSchema,
});

const normalizePathname = (pathname: string): string => {
  const trimmedPathname = pathname.replace(/\/+$/, '');

  return trimmedPathname.length > 0 ? trimmedPathname : '/';
};

const toHeaders = (headers: IncomingMessage['headers']): Headers => {
  const result = new Headers();

  for (const [name, value] of Object.entries(headers)) {
    if (typeof value === 'undefined') {
      continue;
    }

    if (Array.isArray(value)) {
      result.set(name, value.join(', '));
      continue;
    }

    result.set(name, value);
  }

  return result;
};

const readRequestBody = async (request: IncomingMessage): Promise<Uint8Array | undefined> => {
  if (request.method === 'GET' || request.method === 'HEAD') {
    return undefined;
  }

  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return undefined;
  }

  return Buffer.concat(chunks);
};

const toRequestUrl = (request: IncomingMessage): URL => {
  const host = request.headers.host ?? 'localhost:3000';

  return new URL(request.url ?? '/', `http://${host}`);
};

const toWebRequest = async (request: IncomingMessage): Promise<Request> => {
  const body = await readRequestBody(request);
  const requestBody = body
    ? Uint8Array.from(body).buffer
    : undefined;

  return new Request(toRequestUrl(request), {
    method: request.method,
    headers: toHeaders(request.headers),
    body: requestBody,
  });
};

const withTemporaryEnvironment = async <T>(
  overrides: Record<string, string | undefined>,
  action: () => Promise<T>
): Promise<T> => {
  const previousValues = new Map<string, string | undefined>();

  for (const [key, value] of Object.entries(overrides)) {
    previousValues.set(key, process.env[key]);

    if (typeof value === 'undefined') {
      delete process.env[key];
      continue;
    }

    process.env[key] = value;
  }

  try {
    return await action();
  } finally {
    for (const [key, value] of previousValues.entries()) {
      if (typeof value === 'undefined') {
        delete process.env[key];
        continue;
      }

      process.env[key] = value;
    }
  }
};

const writeResponse = async (response: Response, res: ServerResponse): Promise<void> => {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (response.body === null) {
    res.end();
    return;
  }

  const payload = Buffer.from(await response.arrayBuffer());
  res.end(payload);
};

const handleGenerateRecipe = async (request: Request): Promise<Response> => {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  return generateRecipe(request);
};

const handleDebugGenerateRecipe = async (request: Request): Promise<Response> => {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  const parsed = debugGenerateSchema.safeParse(await request.json());

  if (!parsed.success) {
    return Response.json({ error: 'Solicitud de debug invalida.' }, { status: 400 });
  }

  const { apiKey, model, provider, request: recipeRequest } = parsed.data;
  const overrides =
    provider === 'google'
      ? {
          AI_PROVIDER: 'google',
          GOOGLE_GENERATIVE_AI_API_KEY: apiKey,
          GOOGLE_MODEL: model,
        }
      : {
          AI_PROVIDER: 'groq',
          GROQ_API_KEY: apiKey,
          GROQ_MODEL: model,
        };

  return withTemporaryEnvironment(overrides, async () => {
    const debugRequest = new Request(new URL(`${RECIPE_API_PREFIX}/generate`, request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeRequest),
    });

    return generateRecipe(debugRequest);
  });
};

const handleRecipeSuggestions = async (request: Request): Promise<Response> => {
  if (request.method !== 'GET') {
    return Response.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  return getRecipeSuggestions(request);
};

export const createRecipeApiMiddleware = () => {
  return async (request: IncomingMessage, response: ServerResponse, next: NextFunction): Promise<void> => {
    if (!request.url) {
      next();
      return;
    }

    const url = new URL(request.url, `http://${request.headers.host ?? 'localhost:3000'}`);
    const pathname = normalizePathname(url.pathname);

    if (!pathname.startsWith(RECIPE_API_PREFIX)) {
      next();
      return;
    }

    let webResponse: Response | null = null;

    if (pathname === `${RECIPE_API_PREFIX}/generate`) {
      webResponse = await handleGenerateRecipe(await toWebRequest(request));
    } else if (pathname === `${RECIPE_API_PREFIX}/debug/generate`) {
      webResponse = await handleDebugGenerateRecipe(await toWebRequest(request));
    } else if (pathname === `${RECIPE_API_PREFIX}/suggestions`) {
      webResponse = await handleRecipeSuggestions(await toWebRequest(request));
    } else {
      webResponse = Response.json({ error: 'Not Found' }, { status: 404 });
    }

    await writeResponse(webResponse, response);
  };
};