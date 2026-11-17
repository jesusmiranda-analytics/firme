import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// En desarrollo, /api/chat corre la misma función que usa Vercel en producción.
// La clave se lee de .env.local y nunca llega al navegador (no lleva prefijo VITE_).
function apiDev() {
  return {
    name: 'firme-api-dev',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        let raw = '';
        for await (const chunk of req) raw += chunk;
        let body = {};
        try { body = raw ? JSON.parse(raw) : {}; } catch { body = {}; }
        const shim = {
          status(code) { res.statusCode = code; return shim; },
          setHeader(k, v) { res.setHeader(k, v); return shim; },
          json(obj) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); },
        };
        try {
          const mod = await server.ssrLoadModule('/api/chat.js');
          await mod.default({ method: req.method, headers: req.headers, body }, shim);
        } catch (err) {
          shim.status(500).json({ error: 'error_dev', detail: String(err && err.message) });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const k of ['GEMINI_API_KEY', 'GEMINI_MODEL']) if (env[k]) process.env[k] = env[k];
  return { plugins: [react(), apiDev()] };
});
