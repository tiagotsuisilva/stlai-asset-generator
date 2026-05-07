/* ============================================================
   STLAI Asset Generator — Flows / Modular blocks / Lightbox
   ------------------------------------------------------------
   Carregado depois de ui.js. Implementa as funcionalidades
   adicionadas na reformulacao 3 fluxos:
     - Click-to-upload nas upload-zones (3D / 2D / Pose).
     - Eventos das segmenteds e chips (estado modular).
     - Botoes da Biblioteca B (2D) e C (Pose).
     - Lightbox para ampliar imagens do preview/result.
   ============================================================ */

(function () {
  function init() {
    bindUploadZones();
    bindModularBlocks();
    bindFluxoPoseEvents();
    bindLightbox();
    overrideRenderPreview();
  }

  /* ---------- 1. Upload zones clicáveis ---------- */
  function bindUploadZones() {
    document.querySelectorAll('.upload-zone').forEach(zone => {
      const targetId = zone.dataset.target;
      if (!targetId) return;
      zone.addEventListener('click', () => {
        const input = document.getElementById(targetId);
        if (input) input.click();
      });
    });

    // Upload do 2D Flow (esquerda)
    const file2d = document.getElementById('file-input-2d');
    if (file2d) {
      file2d.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const dataUrl = await window.api.fileToDataURL(file);
        window.appState.uploadedImage2D = { dataUrl, name: file.name, file };
        renderUploadIn('upload-zone-2d', dataUrl);
        atualizarBotoesFluxos();
      });
    }

    // Upload do Pose Flow
    const filePose = document.getElementById('file-input-pose');
    if (filePose) {
      filePose.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const dataUrl = await window.api.fileToDataURL(file);
        window.appState.uploadedImagePose = { dataUrl, name: file.name, file };
        renderUploadIn('upload-zone-pose', dataUrl);
        atualizarBotoesFluxos();
      });
    }

    // Textarea do Pose Flow
    const blocoPose = document.getElementById('bloco-extra-pose');
    if (blocoPose) {
      blocoPose.addEventListener('input', (e) => {
        window.appState.blocoExtraPose = e.target.value;
      });
    }

    // Atualiza botoes ao carregar
    atualizarBotoesFluxos();
  }

  function renderUploadIn(zoneId, dataUrl) {
    const el = document.getElementById(zoneId);
    if (!el) return;
    el.classList.add('has-image');
    el.innerHTML = `<img src="${dataUrl}" alt="Upload preview" />`;
  }

  function atualizarBotoesFluxos() {
    const s = window.appState;
    const btn2d = document.getElementById('btn-bib-b-fluxo3');
    if (btn2d) btn2d.disabled = !s.uploadedImage2D;

    const btnPose = document.getElementById('btn-bib-c-fluxo-pose');
    if (btnPose) btnPose.disabled = !s.uploadedImagePose;
  }

  /* ---------- 2. Eventos modulares (segmented + chips) ---------- */
  function bindModularBlocks() {
    // Segmented controls (escolha unica)
    document.querySelectorAll('.segmented').forEach(group => {
      const stateKey = group.dataset.stateKey;
      const flowState = group.dataset.flowState;
      const toggleManual = group.dataset.toggleManual;
      if (!stateKey || !flowState) return;

      group.querySelectorAll('.segmented-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          group.querySelectorAll('.segmented-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const value = btn.dataset.value;
          window.appState[flowState][stateKey] = value;

          // Toggle bloco manual baseado em styleSource
          if (toggleManual) {
            const target = document.getElementById(toggleManual);
            if (target) target.hidden = (value !== 'manual');
          }
        });
      });
    });

    // Chips (multi-select)
    document.querySelectorAll('.chips').forEach(group => {
      const stateKey = group.dataset.stateKey;
      const flowState = group.dataset.flowState;
      if (!stateKey || !flowState) return;

      group.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
          chip.classList.toggle('active');
          const value = chip.dataset.value;
          const arr = window.appState[flowState][stateKey];
          const i = arr.indexOf(value);
          if (i >= 0) arr.splice(i, 1);
          else arr.push(value);
        });
      });
    });
  }

  /* ---------- 3. Botão Biblioteca C (Pose Flow) ---------- */
  function bindFluxoPoseEvents() {
    const btnPose = document.getElementById('btn-bib-c-fluxo-pose');
    if (btnPose) {
      btnPose.addEventListener('click', () => {
        if (typeof window.iniciarFluxo === 'function') {
          window.iniciarFluxo('fluxoPose');
        }
      });
    }
  }

  /* ---------- 4. Lightbox ---------- */
  let currentLightboxData = null;

  function bindLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;

    document.querySelectorAll('[data-action="close-lightbox"]').forEach(el => {
      el.addEventListener('click', closeLightbox);
    });

    const dl = document.getElementById('btn-lightbox-download');
    if (dl) dl.addEventListener('click', downloadLightbox);
  }

  function openLightbox(dataUrl, caption) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-image');
    const cap = document.getElementById('lightbox-caption');
    if (!lb || !img) return;
    img.src = dataUrl;
    if (cap) cap.textContent = caption || '';
    currentLightboxData = { dataUrl, caption };
    lb.hidden = false;
  }

  function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (lb) lb.hidden = true;
    currentLightboxData = null;
  }

  function downloadLightbox() {
    if (!currentLightboxData) return;
    const { dataUrl, caption } = currentLightboxData;
    const a = document.createElement('a');
    a.href = dataUrl;
    const safeName = (caption || 'imagem').replace(/[^\w\-À-￿]+/g, '_').slice(0, 60) || 'imagem';
    a.download = `${safeName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Expoe pra ui.js / outros poderem abrir
  window.uiLightbox = { open: openLightbox, close: closeLightbox };

  /* ---------- 5. Re-render do preview com lightbox + select-btn ---------- */
  function overrideRenderPreview() {
    // Substitui a funcao global renderPreview por uma versao com:
    //   - clique no card amplia (lightbox)
    //   - select-btn separado pra marcar pra Tripo / download
    if (typeof window === 'undefined') return;

    window.renderPreview = function () {
      const grid = document.getElementById('preview-grid');
      if (!grid) return;
      grid.innerHTML = '';

      const ehPose = window.appState.currentFlow === 'fluxoPose';
      const subtitle = document.querySelector('#screen-preview .screen-subtitle');
      if (subtitle) {
        subtitle.textContent = ehPose
          ? 'Selecione as imagens que vão para download.'
          : 'Selecione as imagens que vão para a Tripo (geração 3D).';
      }
      const btnAvancar = document.getElementById('btn-avancar-tripo');
      if (btnAvancar) {
        const txt = btnAvancar.querySelector('.btn-title');
        if (txt) txt.textContent = ehPose ? 'Baixar selecionadas' : 'Avançar para 3D';
      }

      window.appState.generatedImages.forEach((img) => {
        const card = document.createElement('div');
        card.className = 'grid-card preview-card';
        card.dataset.id = img.sourceItem.id;
        const nome = img.sourceItem.nome || img.sourceItem.title || img.sourceItem.id;
        card.innerHTML = `
          <button type="button" class="card-select-btn" title="Selecionar" aria-label="Selecionar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
          <div class="grid-card-image">
            <img src="${img.dataUrl}" alt="${escapeAttr(nome)}" />
          </div>
          <div class="grid-card-info">
            <div class="grid-card-name">${escapeText(nome)}</div>
            <div class="grid-card-meta">${ehPose ? 'Pose aplicada' : 'Imagem gerada'}</div>
          </div>
        `;
        // Click na imagem amplia
        card.querySelector('.grid-card-image').addEventListener('click', () => {
          openLightbox(img.dataUrl, nome);
        });
        // Click no botao de selecao
        card.querySelector('.card-select-btn').addEventListener('click', (ev) => {
          ev.stopPropagation();
          togglePreviewSelecaoCustom(img, card);
        });
        grid.appendChild(card);
      });

      atualizarPreviewCounter();
    };

    // Re-render do result tambem ganha lightbox no clique da imagem
    const _renderResultadoSvg = window.renderResultadoSvg;
    if (typeof _renderResultadoSvg === 'function') {
      window.renderResultadoSvg = function (label) {
        _renderResultadoSvg(label);
        wireLightboxOnResultGrid();
      };
    }
    const _renderResultado3D = window.renderResultado3D;
    if (typeof _renderResultado3D === 'function') {
      window.renderResultado3D = function () {
        _renderResultado3D();
        wireLightboxOnResultGrid();
      };
    }

    // Hijack do botao "Avancar para 3D" pra Pose Flow ir pro download direto
    const btnAvancar = document.getElementById('btn-avancar-tripo');
    if (btnAvancar) {
      btnAvancar.addEventListener('click', (ev) => {
        if (window.appState.currentFlow !== 'fluxoPose') return;
        ev.stopImmediatePropagation();
        downloadSelecionadasPose();
      }, true); // capture: true para interceptar antes do handler antigo
    }
  }

  function wireLightboxOnResultGrid() {
    const grid = document.getElementById('result-grid');
    if (!grid) return;
    grid.querySelectorAll('.grid-card .grid-card-image').forEach((el, idx) => {
      const img = el.querySelector('img');
      if (!img) return;
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', () => {
        openLightbox(img.src, img.alt || `imagem-${idx + 1}`);
      });
    });
  }

  function togglePreviewSelecaoCustom(img, card) {
    const sel = window.appState.selectedForTripo;
    const idx = sel.findIndex(s => s.sourceItem.id === img.sourceItem.id);
    if (idx >= 0) {
      sel.splice(idx, 1);
      card.classList.remove('selected');
    } else {
      sel.push(img);
      card.classList.add('selected');
    }
    atualizarPreviewCounter();
  }

  function atualizarPreviewCounter() {
    const c = document.getElementById('preview-counter');
    const sel = window.appState.selectedForTripo;
    if (c) c.textContent = sel.length;
    const btn = document.getElementById('btn-avancar-tripo');
    if (btn) btn.disabled = sel.length === 0;
  }

  async function downloadSelecionadasPose() {
    const sel = window.appState.selectedForTripo;
    if (!sel.length) return;
    const arquivos = sel.map((img, i) => {
      const nome = img.sourceItem.nome || img.sourceItem.title || img.sourceItem.id;
      const blob = dataURLToBlobLocal(img.dataUrl);
      return { caminho: `imagens/${i + 1}_${nome.replace(/[^\w\-]+/g, '_')}.png`, conteudo: blob };
    });
    await window.api.empacotarZip(arquivos, 'stlai-pose-transfer');
    if (typeof window.showToast === 'function') window.showToast('Download iniciado.', 'success');
  }

  function dataURLToBlobLocal(dataUrl) {
    const [meta, base64] = dataUrl.split(',');
    const mime = meta.match(/data:(.*?);/)[1];
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  function escapeText(s) {
    return String(s ?? '').replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  }
  function escapeAttr(s) { return escapeText(s); }

  // Expoe iniciarFluxo via window pra ui-flows poder chamar
  // (declarado em ui.js como function, mas precisamos via window)
  if (typeof window.iniciarFluxo !== 'function' && typeof iniciarFluxo === 'function') {
    window.iniciarFluxo = iniciarFluxo;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
