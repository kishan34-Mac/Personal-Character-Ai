import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Dev-only proxy: load the Vercel serverless handler at /api/generate-persona
function devApiProxy() {
  return {
    name: 'dev-api-proxy',
    configureServer(server) {
      server.middlewares.use('/api/generate-persona', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.writeHead(204);
          res.end();
          return;
        }
        // Read body
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const body = Buffer.concat(chunks).toString();
        req.body = body ? JSON.parse(body) : {};
        // Dynamically import handler (ESM)
        const handlerUrl = new URL('./api/generate-persona.js', import.meta.url);
        const { default: handler } = await import(fileURLToPath(handlerUrl));
        // Minimal Express-like res shim
        const json = (obj, status = 200) => {
          res.writeHead(status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(obj));
        };
        const mockRes = {
          statusCode: 200,
          status(code) { this.statusCode = code; return this; },
          json: (obj) => json(obj, this.statusCode),
        };
        try {
          await handler(req, mockRes);
        } catch (err) {
          json({ error: 'Character generation failed.' }, 500);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devApiProxy()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
