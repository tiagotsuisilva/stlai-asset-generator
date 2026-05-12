/* ============================================================
   STLAI Asset Generator — Proxy Tripo3D (Vercel Node Function)
   ------------------------------------------------------------
   A API da Tripo3D não permite chamada direta do browser (sem
   header Access-Control-Allow-Origin). Este endpoint funciona
   como proxy: recebe qualquer rota /api/tripo/* do front,
   repassa pra https://api.tripo3d.ai/v2/openapi/* com a
   TRIPO_API_KEY injetada server-side, e devolve a resposta
   (incluindo streaming, pro download do GLB).

   Por que Node Runtime e não Edge: o Edge Runtime no `vercel dev`
   às vezes não carrega process.env do .env.local. Node Runtime
   é mais previsível e Node 18+ tem fetch nativo.

   Setup:
   - Local: `vercel dev` com TRIPO_API_KEY em .env.local
   - Produção: configurar TRIPO_API_KEY no painel do Vercel
   ============================================================ */

import { Readable } from 'node:stream';

const TRIPO_BASE = 'https://api.tripo3d.ai/v2/openapi';

// Desliga o body parser do Vercel pra conseguir repassar multipart
// (upload de imagem) e JSON sem modificar o body.
export const config = {
  api: {
    bodyParser: false,
  },
};

const STRIP_REQ_HEADERS = new Set([
  'host', 'connection', 'cookie', 'authorization',
  'content-length', 'accept-encoding', 'x-forwarded-for',
  'x-forwarded-host', 'x-forwarded-proto', 'x-real-ip',
  'x-vercel-forwarded-for', 'x-vercel-id',
]);

const STRIP_RES_HEADERS = new Set([
  'content-encoding', 'transfer-encoding', 'connection',
]);

export default async function handler(req, res) {
  const apiKey = process.env.TRIPO_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'TRIPO_API_KEY ausente no servidor. Configura em .env.local (vercel dev) ou no painel do Vercel.',
    });
    return;
  }

  // Monta a URL de destino na Tripo:
  //   /api/tripo/upload      → https://api.tripo3d.ai/v2/openapi/upload
  //   /api/tripo/task        → .../task
  //   /api/tripo/task/abc123 → .../task/abc123
  const subPath = req.url.replace(/^\/api\/tripo/, '');
  const target = `${TRIPO_BASE}${subPath}`;

  // Repassa os headers, removendo os controlados pelo runtime e
  // injetando o Authorization correto.
  const headers = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (STRIP_REQ_HEADERS.has(k.toLowerCase())) continue;
    if (v === undefined) continue;
    headers[k] = Array.isArray(v) ? v.join(', ') : v;
  }
  headers['authorization'] = `Bearer ${apiKey}`;

  const init = {
    method: req.method,
    headers,
  };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    // Converte o IncomingMessage do Node pra ReadableStream do Web,
    // que é o formato que o fetch nativo do Node 18+ espera.
    init.body = Readable.toWeb(req);
    init.duplex = 'half';
  }

  try {
    const upstream = await fetch(target, init);
    res.status(upstream.status);
    upstream.headers.forEach((v, k) => {
      if (STRIP_RES_HEADERS.has(k.toLowerCase())) return;
      res.setHeader(k, v);
    });
    if (upstream.body) {
      // Stream do body upstream direto pra response. Funciona pra JSON
      // (pequeno) e pro GLB (binário grande) sem buffer total.
      const reader = upstream.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (err) {
    res.status(502).json({ error: `Proxy falhou ao chamar a Tripo: ${err.message}` });
  }
}
