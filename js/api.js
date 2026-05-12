/* ============================================================
   STLAI Asset Generator — API layer
   ------------------------------------------------------------
   Encapsula chamadas a OpenAI, Tripo e o conversor SVG.
   Quando não há chave configurada (ou MOCK_MODE = true), o app
   roda inteiro com dados mock — útil pra demo sem custo de API.
   ============================================================ */


/* ===== HELPERS ============================================ */

/** Lê um File como dataURL base64. */
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Converte dataURL → Blob (necessário pro FormData da OpenAI). */
function dataURLToBlob(dataUrl) {
  const [meta, base64] = dataUrl.split(',');
  const mime = meta.match(/data:(.*?);/)[1];
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** Carrega uma URL de imagem como dataURL. */
async function loadImageAsDataURL(url) {
  const resp = await fetch(url);
  const blob = await resp.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}


/* ===== MOCK GENERATORS ==================================== */

/**
 * Gera uma imagem placeholder em canvas com gradiente, nome e categoria.
 * Usada quando não há chave da OpenAI configurada.
 */
function mockImage(label, sublabel = '') {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Gradiente de fundo
  const grad = ctx.createLinearGradient(0, 0, 768, 768);
  const palettes = [
    ['#5468FF', '#C770A8'],
    ['#F4C842', '#F58A6E'],
    ['#4BB8E8', '#C8DD3E'],
    ['#C770A8', '#F58A6E'],
    ['#5468FF', '#4BB8E8'],
  ];
  const [c1, c2] = palettes[Math.floor(Math.random() * palettes.length)];
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 768, 768);

  // Círculo central decorativo
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.arc(384, 320, 180, 0, Math.PI * 2);
  ctx.fill();

  // Texto
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.textAlign = 'center';
  ctx.font = 'bold 48px Inter, sans-serif';
  ctx.fillText(label, 384, 340);

  ctx.font = '500 20px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.fillText(sublabel, 384, 380);

  ctx.font = '500 14px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText('MOCK — STLAI Asset Generator', 384, 720);

  return canvas.toDataURL('image/png');
}

/** Gera um SVG mock simples para Fluxo 2/3. */
function mockSVG(label) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#5468FF"/>
      <stop offset="100%" stop-color="#C770A8"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="white"/>
  <circle cx="200" cy="170" r="80" fill="url(#g)"/>
  <text x="200" y="280" text-anchor="middle" font-family="Inter, sans-serif" font-size="24" font-weight="700" fill="#2A2A35">${escapeXML(label)}</text>
  <text x="200" y="310" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="500" fill="#8A8AA0">MOCK SVG</text>
</svg>`;
}

/** Gera um modelo 3D mock (na real, só um arquivo .glb fake/stub). */
function mockModel3D(nome, idx) {
  // Stub binário tipo "GLB" só pra ter um arquivo no ZIP. Na produção, vem da Tripo.
  const text = `MOCK 3D MODEL — ${nome} #${idx}\nGerado pelo STLAI Asset Generator (MOCK MODE).\nSubstitua pela API real da Tripo.`;
  return new Blob([text], { type: 'model/gltf-binary' });
}

function escapeXML(s) {
  return String(s).replace(/[<>&'"]/g, c =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c])
  );
}


/* ===== OPENAI ============================================ */

/**
 * Gera uma imagem do Fluxo 1 via OpenAI (image edit / multi-image).
 *
 * IMPORTANTE: o nome do endpoint e o formato exato do payload
 * podem variar conforme a versão da API da OpenAI. Esta versão
 * usa /v1/images/edits com multipart/form-data, que é o padrão
 * mais comum. Confirme/ajuste no Plano de Validação (Semana 1).
 */
async function callOpenAIImageGenFluxo1({ imagemRefBlob, imagemBibBlob, prompt }) {
  const formData = new FormData();
  formData.append('model', window.CONFIG.OPENAI_IMAGE_MODEL);
  formData.append('prompt', prompt);
  formData.append('image[]', imagemRefBlob, 'image1.png');
  formData.append('image[]', imagemBibBlob, 'image2.png');
  formData.append('size', '1024x1024');
  formData.append('n', '1');

  const resp = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${window.CONFIG.OPENAI_API_KEY}` },
    body: formData,
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`OpenAI ${resp.status}: ${err}`);
  }
  const data = await resp.json();
  // Retorno típico: { data: [{ b64_json: '...' }] }
  if (data.data?.[0]?.b64_json) {
    return `data:image/png;base64,${data.data[0].b64_json}`;
  }
  if (data.data?.[0]?.url) {
    return data.data[0].url;
  }
  throw new Error('Resposta da OpenAI sem imagem.');
}

/**
 * Gera uma imagem estilizada do Fluxo 2 via OpenAI.
 * Aqui o input é apenas a imagem da Biblioteca A + prompt do usuário.
 */
async function callOpenAIImageGenFluxo2({ imagemBibBlob, prompt }) {
  const formData = new FormData();
  formData.append('model', window.CONFIG.OPENAI_IMAGE_MODEL);
  formData.append('prompt', prompt);
  formData.append('image[]', imagemBibBlob, 'image.png');
  formData.append('size', '1024x1024');
  formData.append('n', '1');

  const resp = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${window.CONFIG.OPENAI_API_KEY}` },
    body: formData,
  });
  if (!resp.ok) throw new Error(`OpenAI ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  if (data.data?.[0]?.b64_json) return `data:image/png;base64,${data.data[0].b64_json}`;
  if (data.data?.[0]?.url) return data.data[0].url;
  throw new Error('Resposta da OpenAI sem imagem.');
}


/* ===== PIPELINE — FLUXOS ================================= */

/**
 * Fluxo 1 — Personagem 3D: gera 1 imagem por personagem selecionado.
 * Retorna array de { sourceItem, dataUrl }.
 */
async function gerarImagensFluxo1({ uploadDataUrl, blocoExtra, opcoes, itensBiblioteca, onProgress }) {
  // Preferimos o builder modular novo (casos consolidados do 3D CHARACTER FLOW).
  // Fallback pro template antigo PROMPT_FLUXO1_BASE quando o builder não existe.
  let promptBase;
  if (typeof window.build3DCharacterPrompt === 'function' && opcoes) {
    promptBase = window.build3DCharacterPrompt(opcoes, blocoExtra);
  } else {
    promptBase = (window.PROMPT_FLUXO1_BASE || '').replace(
      '{bloco_extra_do_usuario}',
      blocoExtra || '(no additional instructions)'
    );
  }

  const results = [];
  const refBlob = uploadDataUrl ? dataURLToBlob(uploadDataUrl) : null;

  for (let i = 0; i < itensBiblioteca.length; i++) {
    const item = itensBiblioteca[i];
    onProgress?.(i, itensBiblioteca.length, item.nome);

    try {
      let dataUrl;
      if (window.isMockMode()) {
        await sleep(400);
        dataUrl = mockImage(item.nome, 'Fluxo 1 — 3D');
      } else {
        const bibDataUrl = await loadImageAsDataURL(item.arquivo);
        const bibBlob = dataURLToBlob(bibDataUrl);
        dataUrl = await callOpenAIImageGenFluxo1({
          imagemRefBlob: refBlob,
          imagemBibBlob: bibBlob,
          prompt: promptBase,
        });
      }
      results.push({ sourceItem: item, dataUrl });
    } catch (e) {
      console.error('Falha no item', item.id, e);
      // Em caso de erro, gera mock pra não quebrar o pipeline.
      results.push({ sourceItem: item, dataUrl: mockImage(item.nome, 'Erro — mock'), error: e.message });
    }
  }

  onProgress?.(itensBiblioteca.length, itensBiblioteca.length, 'Concluído');
  return results;
}

/**
 * Fluxo 2 — SVG por imagem: gera 1 imagem estilizada + SVG por item.
 * Retorna array de { sourceItem, imageDataUrl, svgString }.
 */
async function gerarImagensFluxo2({ promptUsuario, itensBiblioteca, onProgress }) {
  const results = [];

  for (let i = 0; i < itensBiblioteca.length; i++) {
    const item = itensBiblioteca[i];
    onProgress?.(i, itensBiblioteca.length, item.nome);

    try {
      let imageDataUrl;
      if (window.isMockMode()) {
        await sleep(300);
        imageDataUrl = mockImage(item.nome, 'Fluxo 2 — SVG');
      } else {
        const bibDataUrl = await loadImageAsDataURL(item.arquivo);
        imageDataUrl = await callOpenAIImageGenFluxo2({
          imagemBibBlob: dataURLToBlob(bibDataUrl),
          prompt: promptUsuario,
        });
      }
      const svgString = await converterParaSVG(imageDataUrl, item.nome);
      results.push({ sourceItem: item, imageDataUrl, svgString });
    } catch (e) {
      console.error('Falha no item', item.id, e);
      const fallbackImage = mockImage(item.nome, 'Erro — mock');
      results.push({ sourceItem: item, imageDataUrl: fallbackImage, svgString: mockSVG(item.nome), error: e.message });
    }
  }

  onProgress?.(itensBiblioteca.length, itensBiblioteca.length, 'Concluído');
  return results;
}

/**
 * Fluxo 3 — SVG textual: usa a mesma estrutura do Fluxo 1 (multi-imagem),
 * mas converte o resultado para SVG.
 */
async function gerarImagensFluxo3({ uploadDataUrl, itensBiblioteca, onProgress }) {
  const promptBase = window.PROMPT_FLUXO3_BASE ||
    'Apply the visual style of Image 2 to the textual composition of Image 1, keeping the text legible and the layout centered.';
  const results = [];
  const styleBlob = uploadDataUrl ? dataURLToBlob(uploadDataUrl) : null;

  for (let i = 0; i < itensBiblioteca.length; i++) {
    const item = itensBiblioteca[i];
    onProgress?.(i, itensBiblioteca.length, item.nome);

    try {
      let imageDataUrl;
      if (window.isMockMode()) {
        await sleep(300);
        imageDataUrl = mockImage(item.nome, 'Fluxo 3 — SVG textual');
      } else {
        const bibDataUrl = await loadImageAsDataURL(item.arquivo);
        // Image 1 = composição da frase (Biblioteca B), Image 2 = estilo (upload).
        imageDataUrl = await callOpenAIImageGenFluxo1({
          imagemRefBlob: dataURLToBlob(bibDataUrl),
          imagemBibBlob: styleBlob,
          prompt: promptBase,
        });
      }
      const svgString = await converterParaSVG(imageDataUrl, item.nome);
      results.push({ sourceItem: item, imageDataUrl, svgString });
    } catch (e) {
      console.error('Falha no item', item.id, e);
      const fallbackImage = mockImage(item.nome, 'Erro — mock');
      results.push({ sourceItem: item, imageDataUrl: fallbackImage, svgString: mockSVG(item.nome), error: e.message });
    }
  }

  onProgress?.(itensBiblioteca.length, itensBiblioteca.length, 'Concluído');
  return results;
}


/**
 * POSE TRANSFER FLOW — aplica o personagem do upload nas poses
 * selecionadas da Biblioteca C.
 *
 * Estrutura conceitual (prompt definitivo: AGUARDANDO):
 *   - Image 1 = imagem da Biblioteca C (POSE / estrutura / câmera).
 *   - Image 2 = upload do usuário (IDENTIDADE / aparência).
 *
 * `opcoes` traz o state modular do POSE TRANSFER FLOW (acessórios,
 * direção de estilo, blocos manuais). Será concatenado pelos
 * módulos de prompt no futuro.
 *
 * Retorna array de { sourceItem, dataUrl }.
 */
async function gerarImagensFluxoPose({ uploadDataUrl, blocoExtra, itensBiblioteca, opcoes, onProgress }) {
  // Prompt final ainda não definido — usar placeholder no real e mock no mock mode.
  const promptBase = (window.PROMPT_POSE_TRANSFER_BASE && window.PROMPT_POSE_TRANSFER_BASE !== '[AGUARDANDO PROMPT DEFINITIVO]')
    ? window.PROMPT_POSE_TRANSFER_BASE
    : 'Apply the identity from Image 2 onto the pose/structure of Image 1. Preserve crop, framing, and visibility from Image 1. Do not invent body parts that are not visible in Image 1.';

  const results = [];
  const charBlob = uploadDataUrl ? dataURLToBlob(uploadDataUrl) : null;

  for (let i = 0; i < itensBiblioteca.length; i++) {
    const item = itensBiblioteca[i];
    onProgress?.(i, itensBiblioteca.length, item.title || item.nome);

    try {
      let dataUrl;
      if (window.isMockMode() || !charBlob) {
        await sleep(400);
        dataUrl = mockImage(item.title || item.nome || 'Pose', 'Pose Transfer (mock)');
      } else {
        const poseDataUrl = await loadImageAsDataURL(item.image || item.arquivo);
        const poseBlob = dataURLToBlob(poseDataUrl);
        dataUrl = await callOpenAIImageGenFluxo1({
          imagemRefBlob: poseBlob,    // pose = blueprint
          imagemBibBlob: charBlob,    // upload = identidade
          prompt: promptBase + (blocoExtra ? `\n\nUSER ADDITIONAL: ${blocoExtra}` : ''),
        });
      }
      // Normaliza pra { sourceItem: { id, nome, ...} } pro preview
      const sourceItem = {
        id: item.id,
        nome: item.title || item.nome,
        ...item,
      };
      results.push({ sourceItem, dataUrl });
    } catch (e) {
      console.error('Pose Transfer falhou para', item.id, e);
      results.push({
        sourceItem: { id: item.id, nome: item.title || item.nome, ...item },
        dataUrl: mockImage(item.title || item.nome, 'Erro — mock'),
        error: e.message,
      });
    }
  }

  onProgress?.(itensBiblioteca.length, itensBiblioteca.length, 'Concluído');
  return results;
}


/* ===== TRIPO ============================================= */

/**
 * Gera modelos 3D via API da Tripo.
 *
 * IMPORTANTE: este é um stub. O time da STLFLIX já tem um MVP
 * usando a Tripo — copiar a integração de lá. O retorno deve ser
 * um array de Blobs (.glb / .obj / .fbx).
 */
async function gerar3DTripo({ imagensSelecionadas, parametros, onProgress }) {
  const results = [];

  for (let i = 0; i < imagensSelecionadas.length; i++) {
    const img = imagensSelecionadas[i];
    onProgress?.(i, imagensSelecionadas.length, img.sourceItem.nome);

    try {
      let blob;
      if (window.isMockMode()) {
        await sleep(500);
        blob = mockModel3D(img.sourceItem.nome, i);
      } else {
        // Chama o proxy local (Vercel Edge Function). A TRIPO_API_KEY é
        // injetada server-side pelo proxy; o front não precisa mais
        // armazenar a chave da Tripo no localStorage.
        blob = await callTripoAPI(img.dataUrl, parametros);
      }
      results.push({
        sourceItem: img.sourceItem,
        nomeArquivo: `${parametros.nomeArquivo || 'modelo'}_${img.sourceItem.id}.${(parametros.formato || 'GLB').toLowerCase()}`,
        blob,
      });
    } catch (e) {
      console.error('Tripo falhou para', img.sourceItem.id, e);
      results.push({
        sourceItem: img.sourceItem,
        nomeArquivo: `${img.sourceItem.id}_ERRO.txt`,
        blob: new Blob([`Erro: ${e.message}`], { type: 'text/plain' }),
      });
    }
  }

  onProgress?.(imagensSelecionadas.length, imagensSelecionadas.length, 'Concluído');
  return results;
}

/**
 * Integração real com a API da Tripo3D (image-to-3D).
 *
 * Fluxo: upload da imagem → cria task image_to_model → polling do status
 * → baixa o GLB final e devolve como Blob.
 *
 * IMPORTANTE — a Tripo3D não permite chamada direta do browser (CORS).
 * Por isso o front bate em /api/tripo/* (proxy Vercel Edge Function),
 * que injeta a TRIPO_API_KEY server-side e repassa pra Tripo.
 *
 * Setup:
 *   - Local: `vercel dev` com TRIPO_API_KEY em .env.local
 *   - Produção: variável de ambiente TRIPO_API_KEY no painel do Vercel
 *
 * NOTA — Fase 1 (smoke test): só passa os parâmetros mínimos pra ver
 * a chamada funcionar end-to-end. O mapeamento completo dos params da
 * UI (versão do modelo, formato OBJ/FBX, etc.) é Fase 2.
 */
const TRIPO_BASE_URL = '/api/tripo';
const TRIPO_POLL_INTERVAL_MS = 5000;
const TRIPO_MAX_POLLS = 120; // 120 * 5s = 10 min máx

async function callTripoAPI(imageDataUrl, parametros) {
  // A autenticação agora é feita server-side pelo proxy (api/tripo/[...path].js)
  // usando a TRIPO_API_KEY da env. O front não manda mais Authorization.
  const authHeaders = {};

  // 1) Upload da imagem ---------------------------------------------------
  const imgBlob = dataURLToBlob(imageDataUrl);
  let ext = (imgBlob.type.split('/')[1] || 'png').toLowerCase();
  if (ext === 'jpeg') ext = 'jpg';
  const filename = `upload.${ext}`;

  const fd = new FormData();
  fd.append('file', imgBlob, filename);

  console.log('[Tripo] uploading image…', { size: imgBlob.size, type: imgBlob.type });
  const upResp = await fetch(`${TRIPO_BASE_URL}/upload`, {
    method: 'POST',
    headers: authHeaders,
    body: fd,
  });
  if (!upResp.ok) {
    const txt = await upResp.text();
    throw new Error(`Tripo upload falhou (${upResp.status}): ${txt}`);
  }
  const upJson = await upResp.json();
  // O SDK chama de file_token no body do /task, mas a resposta do upload
  // pode vir como image_token ou file_token dependendo da versão. Aceita os dois.
  const fileToken =
    upJson?.data?.image_token ||
    upJson?.data?.file_token ||
    upJson?.data?.token;
  if (!fileToken) {
    throw new Error(`Tripo upload sem token: ${JSON.stringify(upJson)}`);
  }
  console.log('[Tripo] upload ok, file_token:', fileToken);

  // 2) Criar task image-to-model -----------------------------------------
  const taskBody = {
    type: 'image_to_model',
    file: { type: ext, file_token: fileToken },
  };
  // Polycount opcional — só passa se o usuário desligou o "Auto".
  if (parametros && parametros.polycountAuto === false && parametros.polycount) {
    taskBody.face_limit = Number(parametros.polycount);
  }
  console.log('[Tripo] creating task…', taskBody);
  const taskResp = await fetch(`${TRIPO_BASE_URL}/task`, {
    method: 'POST',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(taskBody),
  });
  if (!taskResp.ok) {
    const txt = await taskResp.text();
    throw new Error(`Tripo create task falhou (${taskResp.status}): ${txt}`);
  }
  const taskJson = await taskResp.json();
  const taskId = taskJson?.data?.task_id;
  if (!taskId) {
    throw new Error(`Tripo sem task_id: ${JSON.stringify(taskJson)}`);
  }
  console.log('[Tripo] task criada:', taskId);

  // 3) Polling do status --------------------------------------------------
  let modelUrl = null;
  for (let i = 0; i < TRIPO_MAX_POLLS; i++) {
    await sleep(TRIPO_POLL_INTERVAL_MS);
    const sResp = await fetch(`${TRIPO_BASE_URL}/task/${taskId}`, { headers: authHeaders });
    if (!sResp.ok) {
      const txt = await sResp.text();
      throw new Error(`Tripo polling falhou (${sResp.status}): ${txt}`);
    }
    const sJson = await sResp.json();
    const data = sJson?.data || {};
    const status = data.status;
    const progress = data.progress;
    console.log(`[Tripo] task ${taskId}: ${status}${progress !== undefined ? ` (${progress}%)` : ''}`);

    if (status === 'success') {
      const out = data.output || data.result || {};
      modelUrl =
        out.pbr_model ||
        out.model ||
        out.base_model ||
        (typeof out === 'string' ? out : null);
      if (!modelUrl) {
        throw new Error(`Tripo success mas sem URL: ${JSON.stringify(data)}`);
      }
      break;
    }
    if (status === 'failed' || status === 'cancelled' || status === 'banned') {
      throw new Error(`Tripo task ${status}: ${JSON.stringify(data)}`);
    }
    // queued / running / unknown → segue polling
  }
  if (!modelUrl) {
    throw new Error('Tripo timeout esperando modelo 3D (10 min).');
  }
  console.log('[Tripo] modelo pronto:', modelUrl);

  // 4) Baixar o GLB ------------------------------------------------------
  const modelResp = await fetch(modelUrl);
  if (!modelResp.ok) {
    throw new Error(`Tripo download do modelo falhou (${modelResp.status}).`);
  }
  const blob = await modelResp.blob();
  console.log('[Tripo] GLB baixado, size:', blob.size);
  return blob;
}


/* ===== CONVERSOR SVG (ImageTracer) ======================= */

async function converterParaSVG(imageDataUrl, label = 'svg') {
  if (window.isMockMode()) {
    await sleep(150);
    return mockSVG(label);
  }
  if (typeof ImageTracer === 'undefined') {
    console.warn('ImageTracer nao carregou; voltando pra mock SVG.');
    return mockSVG(label);
  }
  return new Promise((resolve) => {
    try {
      ImageTracer.imageToSVG(
        imageDataUrl,
        (svgString) => resolve(svgString),
        { numberofcolors: 8, mincolorratio: 0.02, ltres: 1, qtres: 1 }
      );
    } catch (e) {
      console.error('ImageTracer falhou:', e);
      resolve(mockSVG(label));
    }
  });
}


/* ===== EMPACOTAMENTO ZIP ================================== */

async function empacotarZip(arquivos, nomeBase = 'stlai-output') {
  const zip = new JSZip();
  for (const a of arquivos) {
    zip.file(a.caminho, a.conteudo);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${nomeBase}_${Date.now()}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}


/* ===== UTIL ============================================== */

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }


/* ===== EXPORT GLOBAL ===================================== */
window.api = {
  fileToDataURL,
  loadImageAsDataURL,
  gerarImagensFluxo1,
  gerarImagensFluxo2,
  gerarImagensFluxo3,
  gerarImagensFluxoPose,
  gerar3DTripo,
  converterParaSVG,
  empacotarZip,
  mockImage,
  mockSVG,
};
