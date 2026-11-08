import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleCareerAiRequest } from './server/careerAi.ts';

const MAX_BODY_BYTES = 4 * 1024 * 1024;

// Serves POST /api/career-ai during `npm run dev` and `npm run preview`.
// The Gemini key is read from GEMINI_API_KEY (no VITE_ prefix), so it never reaches the browser bundle.
function careerAiApi(mode: string): Plugin {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const config = {
    apiKey: env.GEMINI_API_KEY,
    model: env.GEMINI_MODEL,
    baseUrl: env.GEMINI_API_BASE,
  };

  const middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (req.url?.split('?')[0] !== '/api/career-ai') return next();
    const send = (status: number, body: unknown) => {
      res.statusCode = status;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(body));
    };
    if (req.method !== 'POST') return send(405, { error: 'Use POST.' });
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        send(413, { error: 'Request is too large.' });
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', async () => {
      if (res.writableEnded) return;
      let body: unknown;
      try {
        body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      } catch {
        return send(400, { error: 'Request body must be JSON.' });
      }
      const result = await handleCareerAiRequest(body, config);
      send(result.status, result.body);
    });
  };

  return {
    name: 'futurefit-career-ai-api',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), careerAiApi(mode)],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
