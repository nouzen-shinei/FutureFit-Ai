// Netlify Function that serves POST /api/career-ai in production.
// Set GEMINI_API_KEY (and optionally GEMINI_MODEL) in the Netlify site's environment variables.
import { handleCareerAiRequest } from '../../server/careerAi.ts';

const MAX_BODY_BYTES = 4 * 1024 * 1024;

export default async (request: Request): Promise<Response> => {
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

  if (request.method !== 'POST') return json(405, { error: 'Use POST.' });
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > MAX_BODY_BYTES) return json(413, { error: 'Request is too large.' });

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return json(413, { error: 'Request is too large.' });
    body = JSON.parse(text);
  } catch {
    return json(400, { error: 'Request body must be JSON.' });
  }

  const result = await handleCareerAiRequest(body, {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL,
    baseUrl: process.env.GEMINI_API_BASE,
  });
  return json(result.status, result.body);
};

export const config = { path: '/api/career-ai' };
