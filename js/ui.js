/* ============================================================
   STLAI Asset Generator — UI / State machine
   ------------------------------------------------------------
   Single-page app: troca a tela visível via classe .screen-active.
   Estado guardado em window.appState.
   O efeito de background "água-viva" vive em js/bg.js.
   ============================================================ */

const appState = {
  currentScreen: 'home',
  currentFlow: null,        // 'fluxo1' | 'fluxo2' | 'fluxo3' | 'fluxoPose'
  currentFlowScreen: null,  // 'flow-3d' | 'flow-2d' | 'flow-pose'

  // Uploads
  uploadedImage: null,       // upload do 3D Flow
  uploadedImage2D: null,     // upload do 2D Flow (lado esquerdo, alimenta fluxo3)
  uploadedImagePose: null,   // upload do Pose Transfer Flow

  blocoExtra: '',            // textarea do 3D Flow
  blocoExtraPose: '',        // textarea do Pose Flow
  promptFluxo2: '',

  // Bibliotecas
  bibliotecaA: [],
  bibliotecaB: [],
  bibliotecaC: [],

  bibliotecaSelection: [],
  generatedImages: [],
  selectedForTripo: [],
  generatedSvgs: [],
  generated3D: [],
  generatedPose: [],         // resultados do fluxoPose

  // Estado modular do 3D Flow
  threeDFlowOptions: {
    accessoriesMode: 'keep',
    styleSource: 'image1',
    aestheticModifiers: [],
    proportionPreset: 'default',
    realismLevel: 'stylized',
    materialFinish: 'matte_vinyl',
    technicalModifiers: [],
  },

  // Estado modular do Pose Flow (mesma estrutura)
  poseFlowOptions: {
    accessoriesMode: 'keep',
    styleSource: 'image1',
    aestheticModifiers: [],
    proportionPreset: 'default',
    realismLevel: 'stylized',
    materialFinish: 'matte_vinyl',
    technicalModifiers: [],
  },

  tripoParams: {
    versao: 'standard',
    meshResolution: 'standard',
    polycount: 20000,
    polycountAuto: false,
    formato: 'GLB',
    nomeArquivo: 'personagem',
  },
};
window.appState = appState;


/* ===== INIT ============================================== */

document.addEventListener('DOMContentLoaded', async () => {
  bindGlobalEvents();
  bindLandingEvents();
  bindHomeEvents();
  bindBibliotecaEvents();
  bindPreviewEvents();
  bindTripoEvents();
  bindResultEvents();
  bindSettingsEvents();

  await carregarBibliotecas();
  atualizarMockBadge();
  atualizarBotoesHome();
});


/* ===== LANDING (Tela 0) ================================== */

function bindLandingEvents() {
  document.querySelectorAll('[data-action="goto-flow-3d"]').forEach(btn => {
    btn.addEventListener('click', () => abrirFlowScreen('flow-3d'));
  });
  document.querySelectorAll('[data-action="goto-flow-2d"]').forEach(btn => {
    btn.addEventListener('click', () => abrirFlowScreen('flow-2d'));
  });
  document.querySelectorAll('[data-action="goto-flow-pose"]').forEach(btn => {
    btn.addEventListener('click', () => abrirFlowScreen('flow-pose'));
  });
  document.querySelectorAll('[data-action="back-landing"]').forEach(btn => {
    btn.addEventListener('click', () => showScreen('home'));
  });
}

function abrirFlowScreen(which) {
  appState.currentFlowScreen = which;
  showScreen(which);
}


/* ===== UTIL — TELAS / TOAST ============================== */

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('screen-active'));
  document.getElementById(`screen-${id}`).classList.add('screen-active');
  appState.currentScreen = id;
  window.scrollTo(0, 0);
}

function showToast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show' + (type ? ` toast-${type}` : '');
  setTimeout(() => { el.className = 'toast'; }, 3200);
}

function atualizarMockBadge() {
  const badge = document.getElementById('mock-badge');
  badge.hidden = !window.isMockMode();
}


/* ===== CARREGAR BIBLIOTECAS ============================== */

async function carregarBibliotecas() {
  try {
    const [a, b, c] = await Promise.all([
      fetch('bibliotecaA/bibliotecaA.json').then(r => r.json()),
      fetch('bibliotecaB/bibliotecaB.json').then(r => r.json()),
      fetch('bibliotecaC/bibliotecaC.json').then(r => r.json()).catch(() => []),
    ]);
    appState.bibliotecaA = a;
    appState.bibliotecaB = b;
    appState.bibliotecaC = c;
  } catch (e) {
    console.error('Falha ao carregar bibliotecas:', e);
    showToast('Falha ao carregar bibliotecas. Verifique os arquivos JSON.', 'error');
  }
}


/* ===== HOME ============================================== */

function bindHomeEvents() {
  const fileInput = document.getElementById('file-input');
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await window.api.fileToDataURL(file);
    appState.uploadedImage = { dataUrl, name: file.name, file };
    renderUploadPreview();
    atualizarBotoesHome();
  });

  document.getElementById('bloco-extra').addEventListener('input', (e) => {
    appState.blocoExtra = e.target.value;
  });

  document.getElementById('prompt-fluxo2').addEventListener('input', (e) => {
    appState.promptFluxo2 = e.target.value;
    atualizarBotoesHome();
  });

  document.getElementById('btn-bib-a-fluxo1').addEventListener('click', () => iniciarFluxo('fluxo1'));
  document.getElementById('btn-bib-a-fluxo2').addEventListener('click', () => iniciarFluxo('fluxo2'));
  document.getElementById('btn-bib-b-fluxo3').addEventListener('click', () => iniciarFluxo('fluxo3'));

  document.querySelectorAll('[data-action="back-home"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = appState.currentFlowScreen || 'home';
      showScreen(target);
    });
  });
}

function renderUploadPreview() {
  // Tenta primeiro a nova upload-zone-3d; cai pra upload-preview legado se existir
  const el = document.getElementById('upload-zone-3d') || document.getElementById('upload-preview');
  if (!el) return;
  el.classList.add('has-image');
  el.innerHTML = `<img src="${appState.uploadedImage.dataUrl}" alt="Upload preview" />`;
}

function atualizarBotoesHome() {
  const temUpload = !!appState.uploadedImage;
  const temPrompt = appState.promptFluxo2.trim().length > 0;

  document.getElementById('btn-bib-a-fluxo1').disabled = !temUpload;
  document.getElementById('btn-bib-b-fluxo3').disabled = !temUpload;
  document.getElementById('btn-bib-a-fluxo2').disabled = !temPrompt;
}


/* ===== BIBLIOTECA (Tela 2) =============================== */

function iniciarFluxo(fluxo) {
  appState.currentFlow = fluxo;
  appState.bibliotecaSelection = [];

  const titles = {
    fluxo1:    { title: 'Biblioteca A', sub: '3D Character Flow — escolha personagens' },
    fluxo2:    { title: 'Biblioteca A', sub: '2D Character Flow — SVG por imagem' },
    fluxo3:    { title: 'Biblioteca B', sub: '2D Character Flow — SVG textual' },
    fluxoPose: { title: 'Biblioteca C', sub: 'Pose Transfer Flow — escolha as poses' },
  };
  const t = titles[fluxo] || { title: 'Biblioteca', sub: '' };
  document.getElementById('biblioteca-title').textContent = t.title;
  document.getElementById('biblioteca-subtitle').textContent = t.sub;

  const max = window.CONFIG.MAX_ITEMS_POR_GERACAO;
  document.getElementById('biblioteca-max').textContent = max;

  // Biblioteca correta por fluxo
  let itens = appState.bibliotecaA;
  if (fluxo === 'fluxo3') itens = appState.bibliotecaB;
  else if (fluxo === 'fluxoPose') itens = appState.bibliotecaC;

  renderBiblioteca(itens);

  const btn = document.getElementById('btn-gerar');
  btn.querySelector('.btn-title').textContent =
    (fluxo === 'fluxo1' || fluxo === 'fluxoPose') ? 'Gerar imagens' : 'Gerar';

  atualizarSelecaoBiblioteca();
  showScreen('biblioteca');
}

function renderBiblioteca(itens) {
  const grid = document.getElementById('biblioteca-grid');
  grid.innerHTML = '';
  itens.forEach((item) => {
    // Compatibilidade: Bib A/B usam {nome, arquivo, categoria}; Bib C usa {title, image, visibilityType}
    const nome = item.nome || item.title || item.id;
    const arquivo = item.arquivo || item.image || '';
    const meta = item.categoria || item.visibilityType || '';

    const card = document.createElement('div');
    card.className = 'grid-card';
    card.dataset.id = item.id;
    card.innerHTML = `
      <div class="grid-card-image">
        <img src="${arquivo}" alt="${nome}" onerror="this.style.display='none'; this.parentElement.innerHTML = window.uiPlaceholderSVG('${escapeHtml(nome)}');" />
      </div>
      <div class="grid-card-info">
        <div class="grid-card-name">${escapeHtml(nome)}</div>
        <div class="grid-card-meta">${escapeHtml(meta)}</div>
      </div>
    `;
    card.addEventListener('click', () => toggleSelecao(item, card));
    grid.appendChild(card);
  });
}

function toggleSelecao(item, card) {
  const idx = appState.bibliotecaSelection.findIndex(s => s.id === item.id);
  const max = window.CONFIG.MAX_ITEMS_POR_GERACAO;
  if (idx >= 0) {
    appState.bibliotecaSelection.splice(idx, 1);
    card.classList.remove('selected');
  } else {
    if (appState.bibliotecaSelection.length >= max) {
      showToast(`Limite de ${max} itens por geração.`, 'error');
      return;
    }
    appState.bibliotecaSelection.push(item);
    card.classList.add('selected');
  }
  atualizarSelecaoBiblioteca();
}

function atualizarSelecaoBiblioteca() {
  document.getElementById('biblioteca-counter').textContent = appState.bibliotecaSelection.length;
  document.getElementById('btn-gerar').disabled = appState.bibliotecaSelection.length === 0;
}

function bindBibliotecaEvents() {
  document.getElementById('btn-gerar').addEventListener('click', executarGeracao);
}


/* ===== EXECUÇÃO DOS FLUXOS =============================== */

async function executarGeracao() {
  const fluxo = appState.currentFlow;
  const itens = appState.bibliotecaSelection.slice();

  iniciarLoading('Gerando imagens', `Fluxo ${fluxo.replace('fluxo', '')} — ${itens.length} ${itens.length === 1 ? 'item' : 'itens'}`);

  try {
    if (fluxo === 'fluxo1') {
      const results = await window.api.gerarImagensFluxo1({
        uploadDataUrl: appState.uploadedImage?.dataUrl,
        blocoExtra: appState.blocoExtra,
        itensBiblioteca: itens,
        onProgress: atualizarProgresso,
      });
      appState.generatedImages = results;
      appState.selectedForTripo = [];
      renderPreview();
      showScreen('preview');
    } else if (fluxo === 'fluxo2') {
      const results = await window.api.gerarImagensFluxo2({
        promptUsuario: appState.promptFluxo2,
        itensBiblioteca: itens,
        onProgress: atualizarProgresso,
      });
      appState.generatedSvgs = results;
      renderResultadoSvg('Fluxo 2 — SVG por imagem');
      showScreen('result');
    } else if (fluxo === 'fluxo3') {
      // Fluxo 3 usa o upload do 2D Flow (lado esquerdo)
      const results = await window.api.gerarImagensFluxo3({
        uploadDataUrl: appState.uploadedImage2D?.dataUrl,
        itensBiblioteca: itens,
        onProgress: atualizarProgresso,
      });
      appState.generatedSvgs = results;
      renderResultadoSvg('Fluxo 3 — SVG textual');
      showScreen('result');
    } else if (fluxo === 'fluxoPose') {
      const results = await window.api.gerarImagensFluxoPose({
        uploadDataUrl: appState.uploadedImagePose?.dataUrl,
        blocoExtra: appState.blocoExtraPose,
        itensBiblioteca: itens,
        opcoes: appState.poseFlowOptions,
        onProgress: atualizarProgresso,
      });
      appState.generatedImages = results;       // reusa screen-preview do fluxo1
      appState.generatedPose = results;
      appState.selectedForTripo = [];
      renderPreview();
      showScreen('preview');
    }
  } catch (e) {
    console.error(e);
    showToast(`Erro na geração: ${e.message}`, 'error');
    showScreen(appState.currentFlowScreen || 'home');
  }
}


/* ===== LOADING =========================================== */

function iniciarLoading(titulo, subtitulo) {
  document.getElementById('loading-title').textContent = titulo;
  document.getElementById('loading-subtitle').textContent = subtitulo;
  document.getElementById('progress-bar-fill').style.width = '0%';
  document.getElementById('loading-progress').textContent = '0 de 0';
  showScreen('loading');
}

function atualizarProgresso(current, total, label = '') {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  document.getElementById('progress-bar-fill').style.width = `${pct}%`;
  document.getElementById('loading-progress').textContent =
    `${current} de ${total}${label ? ` — ${label}` : ''}`;
}


/* ===== PREVIEW (Fluxo 1) ================================= */

function bindPreviewEvents() {
  document.getElementById('btn-avancar-tripo').addEventListener('click', () => {
    if (appState.selectedForTripo.length === 0) return;
    renderTripoList();
    showScreen('tripo');
  });
}

function renderPreview() {
  const grid = document.getElementById('preview-grid');
  grid.innerHTML = '';
  appState.generatedImages.forEach((img) => {
    const card = document.createElement('div');
    card.className = 'grid-card';
    card.dataset.id = img.sourceItem.id;
    card.innerHTML = `
      <div class="grid-card-image">
        <img src="${img.dataUrl}" alt="${img.sourceItem.nome}" />
      </div>
      <div class="grid-card-info">
        <div class="grid-card-name">${escapeHtml(img.sourceItem.nome)}</div>
        <div class="grid-card-meta">Imagem gerada</div>
      </div>
    `;
    card.addEventListener('click', () => togglePreviewSelecao(img, card));
    grid.appendChild(card);
  });
  atualizarPreviewCounter();
}

function togglePreviewSelecao(img, card) {
  const idx = appState.selectedForTripo.findIndex(s => s.sourceItem.id === img.sourceItem.id);
  if (idx >= 0) {
    appState.selectedForTripo.splice(idx, 1);
    card.classList.remove('selected');
  } else {
    appState.selectedForTripo.push(img);
    card.classList.add('selected');
  }
  atualizarPreviewCounter();
}

function atualizarPreviewCounter() {
  document.getElementById('preview-counter').textContent = appState.selectedForTripo.length;
  document.getElementById('btn-avancar-tripo').disabled = appState.selectedForTripo.length === 0;
}


/* ===== TRIPO (Tela 4) ==================================== */

function bindTripoEvents() {
  document.querySelectorAll('[data-action="back-preview"]').forEach(btn => {
    btn.addEventListener('click', () => showScreen('preview'));
  });

  document.querySelectorAll('.toggle[data-mesh]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.toggle[data-mesh]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.tripoParams.meshResolution = btn.dataset.mesh;
    });
  });

  const slider = document.getElementById('tripo-polycount');
  const valueLabel = document.getElementById('tripo-polycount-value');
  slider.addEventListener('input', (e) => {
    const v = parseInt(e.target.value, 10);
    appState.tripoParams.polycount = v;
    valueLabel.textContent = v.toLocaleString('pt-BR');
  });

  document.getElementById('tripo-polycount-auto').addEventListener('change', (e) => {
    appState.tripoParams.polycountAuto = e.target.checked;
    slider.disabled = e.target.checked;
    valueLabel.style.opacity = e.target.checked ? 0.4 : 1;
  });

  document.getElementById('tripo-versao').addEventListener('change', (e) => {
    appState.tripoParams.versao = e.target.value;
  });
  document.getElementById('tripo-formato').addEventListener('change', (e) => {
    appState.tripoParams.formato = e.target.value;
  });
  document.getElementById('tripo-nome').addEventListener('input', (e) => {
    appState.tripoParams.nomeArquivo = e.target.value;
  });

  document.getElementById('btn-tripo-limpar').addEventListener('click', () => {
    document.getElementById('tripo-versao').value = 'standard';
    document.querySelectorAll('.toggle[data-mesh]').forEach(b => b.classList.remove('active'));
    document.querySelector('.toggle[data-mesh="standard"]').classList.add('active');
    document.getElementById('tripo-polycount').value = 20000;
    document.getElementById('tripo-polycount-value').textContent = '20.000';
    document.getElementById('tripo-polycount-auto').checked = false;
    document.getElementById('tripo-formato').value = 'GLB';
    document.getElementById('tripo-nome').value = 'personagem';
    appState.tripoParams = {
      versao: 'standard', meshResolution: 'standard',
      polycount: 20000, polycountAuto: false,
      formato: 'GLB', nomeArquivo: 'personagem',
    };
  });

  document.getElementById('btn-tripo-gerar').addEventListener('click', executarTripo);
}

function renderTripoList() {
  const ul = document.getElementById('tripo-list');
  ul.innerHTML = '';
  appState.selectedForTripo.forEach((img) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="thumb"><img src="${img.dataUrl}" alt="" /></div>
      <span>${escapeHtml(img.sourceItem.nome)}</span>
    `;
    ul.appendChild(li);
  });
}

async function executarTripo() {
  iniciarLoading('Gerando modelos 3D', `${appState.selectedForTripo.length} ${appState.selectedForTripo.length === 1 ? 'modelo' : 'modelos'} via Tripo`);
  try {
    const results = await window.api.gerar3DTripo({
      imagensSelecionadas: appState.selectedForTripo,
      parametros: appState.tripoParams,
      onProgress: atualizarProgresso,
    });
    appState.generated3D = results;
    renderResultado3D();
    showScreen('result');
  } catch (e) {
    console.error(e);
    showToast(`Erro na Tripo: ${e.message}`, 'error');
    showScreen('preview');
  }
}


/* ===== RESULTADO (Tela 6) ================================ */

function bindResultEvents() {
  document.getElementById('btn-download-zip').addEventListener('click', baixarZip);
}

function renderResultadoSvg(label) {
  document.getElementById('result-subtitle').textContent =
    `${label} — ${appState.generatedSvgs.length} ${appState.generatedSvgs.length === 1 ? 'arquivo gerado' : 'arquivos gerados'}.`;
  const grid = document.getElementById('result-grid');
  grid.innerHTML = '';
  appState.generatedSvgs.forEach((r) => {
    const card = document.createElement('div');
    card.className = 'grid-card';
    const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(r.svgString)}`;
    card.innerHTML = `
      <div class="grid-card-image"><img src="${svgDataUrl}" alt="${r.sourceItem.nome}" /></div>
      <div class="grid-card-info">
        <div class="grid-card-name">${escapeHtml(r.sourceItem.nome)}</div>
        <div class="grid-card-meta">SVG${r.error ? ' (com erro)' : ''}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderResultado3D() {
  document.getElementById('result-subtitle').textContent =
    `Fluxo 1 — Personagem 3D — ${appState.generated3D.length} ${appState.generated3D.length === 1 ? 'modelo gerado' : 'modelos gerados'}.`;
  const grid = document.getElementById('result-grid');
  grid.innerHTML = '';
  appState.selectedForTripo.forEach((img, i) => {
    const card = document.createElement('div');
    card.className = 'grid-card';
    const tripoResult = appState.generated3D[i];
    card.innerHTML = `
      <div class="grid-card-image"><img src="${img.dataUrl}" alt="${img.sourceItem.nome}" /></div>
      <div class="grid-card-info">
        <div class="grid-card-name">${escapeHtml(img.sourceItem.nome)}</div>
        <div class="grid-card-meta">${escapeHtml(tripoResult?.nomeArquivo || '3D')}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

async function baixarZip() {
  const fluxo = appState.currentFlow;
  const arquivos = [];

  if (fluxo === 'fluxo1' && appState.generated3D.length) {
    appState.generated3D.forEach((r) => {
      arquivos.push({ caminho: `modelos/${r.nomeArquivo}`, conteudo: r.blob });
    });
    appState.selectedForTripo.forEach((img) => {
      const blob = window.api && img.dataUrl ? dataURLBlob(img.dataUrl) : null;
      if (blob) arquivos.push({ caminho: `imagens/${img.sourceItem.id}.png`, conteudo: blob });
    });
  } else if (fluxo === 'fluxo2' || fluxo === 'fluxo3') {
    appState.generatedSvgs.forEach((r) => {
      arquivos.push({ caminho: `svgs/${r.sourceItem.id}.svg`, conteudo: r.svgString });
      arquivos.push({ caminho: `imagens/${r.sourceItem.id}.png`, conteudo: dataURLBlob(r.imageDataUrl) });
    });
  }

  if (arquivos.length === 0) {
    showToast('Nada para baixar.', 'error');
    return;
  }

  await window.api.empacotarZip(arquivos, `stlai-${fluxo}`);
  showToast('Download iniciado.', 'success');
}

function dataURLBlob(dataUrl) {
  const [meta, base64] = dataUrl.split(',');
  const mime = meta.match(/data:(.*?);/)[1];
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}


/* ===== SETTINGS MODAL ==================================== */

function bindSettingsEvents() {
  document.getElementById('btn-settings').addEventListener('click', abrirSettings);
  document.querySelectorAll('[data-action="close-settings"]').forEach(b => {
    b.addEventListener('click', fecharSettings);
  });
  document.getElementById('btn-save-settings').addEventListener('click', salvarSettings);
}

function abrirSettings() {
  document.getElementById('cfg-openai-key').value = window.CONFIG.OPENAI_API_KEY;
  document.getElementById('cfg-openai-model').value = window.CONFIG.OPENAI_IMAGE_MODEL;
  document.getElementById('cfg-tripo-key').value = window.CONFIG.TRIPO_API_KEY;
  document.getElementById('cfg-mock-mode').checked = window.CONFIG.MOCK_MODE;
  document.getElementById('settings-modal').hidden = false;
}

function fecharSettings() {
  document.getElementById('settings-modal').hidden = true;
}

function salvarSettings() {
  window.saveConfig({
    OPENAI_API_KEY: document.getElementById('cfg-openai-key').value.trim(),
    OPENAI_IMAGE_MODEL: document.getElementById('cfg-openai-model').value.trim() || 'gpt-image-2',
    TRIPO_API_KEY: document.getElementById('cfg-tripo-key').value.trim(),
    MOCK_MODE: document.getElementById('cfg-mock-mode').checked,
  });
  fecharSettings();
  atualizarMockBadge();
  showToast('Configuracoes salvas.', 'success');
}


/* ===== EVENTOS GLOBAIS =================================== */

function bindGlobalEvents() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!document.getElementById('settings-modal').hidden) fecharSettings();
      const lb = document.getElementById('lightbox');
      if (lb && !lb.hidden && window.uiLightbox) window.uiLightbox.close();
    }
  });
}


/* ===== UTIL ============================================== */

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"\']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

window.escapeHtml = escapeHtml;

window.uiPlaceholderSVG = function (label) {
  const safe = escapeHtml(label);
  return `<svg class="placeholder-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    <rect width="100" height="100" fill="#1c1736"/>
    <circle cx="50" cy="42" r="20" fill="#7c3aed" opacity="0.6"/>
    <text x="50" y="78" text-anchor="middle" font-family="Inter,sans-serif" font-size="6" fill="#b8b2d9">${safe}</text>
    <text x="50" y="88" text-anchor="middle" font-family="Inter,sans-serif" font-size="4" fill="#7e779c">imagem ausente</text>
  </svg>`;
};
