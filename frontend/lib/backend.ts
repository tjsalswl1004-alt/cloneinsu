/**
 * Server-side only helper for proxying to the Spring Boot backend.
 * Never import this from a client component — the API_URL env var is server-only.
 */

const BACKEND_URL = process.env.API_URL ?? 'http://localhost:8080/api';

export interface BackendFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function backendFetch(path: string, options: BackendFetchOptions = {}): Promise<Response> {
  const { body, headers, ...rest } = options;

  const init: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string> | undefined),
    },
  };

  if (body !== undefined) {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return fetch(`${BACKEND_URL}${path}`, init);
}

export async function proxy(path: string, request: Request, options: { method?: string } = {}): Promise<Response> {
  const method = options.method ?? request.method;
  const bodyText = method === 'GET' || method === 'DELETE' ? undefined : await request.text();

  const backendResponse = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: bodyText && bodyText.length > 0 ? bodyText : undefined,
    cache: 'no-store',
  });

  const responseText = await backendResponse.text();
  return new Response(responseText, {
    status: backendResponse.status,
    headers: {
      'Content-Type': backendResponse.headers.get('Content-Type') ?? 'application/json',
    },
  });
}
