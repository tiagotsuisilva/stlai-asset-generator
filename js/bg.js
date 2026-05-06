/* ============================================================
   STLAI Asset Generator — Background interativo "água-viva"
   ------------------------------------------------------------
   Inspirado no portfólio da Mariza Felicio (efeito difuso/etéreo).
   - SVG com filter Gaussian blur PESADO (sem threshold) — gera
     glow translúcido em vez de "tinta sólida".
   - Trail de N blobs com cores DIFERENTES (violeta, magenta, coral):
     ao se sobreporem com mix-blend-mode: screen, somam luz e
     produzem um dégradé fluido que lembra fumaça colorida.
   - Mouse parado → blobs convergem em uma "bolha" suave.
   - Mouse rápido → blobs se distanciam e formam cauda etérea.
   - Pulsação leve via sin(t) e variação de raio.
   - Desligado em mobile e em prefers-reduced-motion.
   ============================================================ */

(function () {
  function init() {
    if (window.matchMedia('(max-width: 880px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const N_BLOBS = 7;

    // Paleta: cada blob tem cor própria. Repete pra completar N_BLOBS.
    // RGB pra dosar opacity uniforme.
    const palette = [
      [124, 58, 237],   // violet
      [192, 132, 252],  // lilac
      [232, 121, 249],  // magenta
      [244, 114, 182],  // pink
      [255, 122, 89],   // coral
      [157, 78, 221],   // purple deep
      [216, 180, 254],  // soft lilac
    ];

    const wrap = document.createElement('div');
    wrap.className = 'goo-bg';
    wrap.setAttribute('aria-hidden', 'true');

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('xmlns', SVG_NS);
    svg.setAttribute('preserveAspectRatio', 'none');

    // Só blur grande, sem threshold — preserva translucidez
    const defs = document.createElementNS(SVG_NS, 'defs');
    defs.innerHTML = `
      <filter id="bg-blur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="48" />
      </filter>
    `;
    svg.appendChild(defs);

    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('filter', 'url(#bg-blur)');
    svg.appendChild(group);

    wrap.appendChild(svg);
    document.body.appendChild(wrap);

    let W = window.innerWidth;
    let H = window.innerHeight;
    function setSize() {
      W = window.innerWidth;
      H = window.innerHeight;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    }
    setSize();
    window.addEventListener('resize', setSize);

    const startX = W / 2;
    const startY = H / 2;
    const blobs = [];
    for (let i = 0; i < N_BLOBS; i++) {
      const c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('cx', startX);
      c.setAttribute('cy', startY);
      c.setAttribute('r', 0);
      const col = palette[i % palette.length];
      c.setAttribute('fill', `rgb(${col[0]}, ${col[1]}, ${col[2]})`);
      group.appendChild(c);
      blobs.push({ el: c, x: startX, y: startY, color: col });
    }

    let mouseX = startX, mouseY = startY;
    let lastMX = startX, lastMY = startY;
    let speed = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const dx = mouseX - lastMX;
      const dy = mouseY - lastMY;
      const inst = Math.sqrt(dx * dx + dy * dy);
      speed = speed * 0.75 + inst * 0.25;
      lastMX = mouseX;
      lastMY = mouseY;
    }, { passive: true });

    function animate(now) {
      speed *= 0.94;
      const t = Math.min(speed / 30, 1); // 0..1 (lento → rápido)

      // Líder segue o mouse com easing suave
      const leadEase = 0.14 + t * 0.12;
      blobs[0].x += (mouseX - blobs[0].x) * leadEase;
      blobs[0].y += (mouseY - blobs[0].y) * leadEase;

      // Cauda: easing decresce
      for (let i = 1; i < N_BLOBS; i++) {
        const ease = Math.max(0.05, 0.16 - i * 0.012);
        blobs[i].x += (blobs[i - 1].x - blobs[i].x) * ease;
        blobs[i].y += (blobs[i - 1].y - blobs[i].y) * ease;
      }

      const time = now * 0.0015;
      for (let i = 0; i < N_BLOBS; i++) {
        const b = blobs[i];
        // raios bem grandes pra ficar etéreo após o blur
        const baseR = 130 - i * 8;
        const wobble = Math.sin(time + i * 1.1) * 12;
        const r = Math.max(40, baseR + wobble);
        // alpha baixo: deixa o blur somar luz sem ficar opaco
        const alpha = 0.42 - i * 0.025;

        b.el.setAttribute('cx', b.x.toFixed(1));
        b.el.setAttribute('cy', b.y.toFixed(1));
        b.el.setAttribute('r', r.toFixed(1));
        b.el.setAttribute('fill-opacity', Math.max(0.15, alpha).toFixed(2));
      }

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
