/* ============================================================
   STLAI Asset Generator — Background interativo "água-viva"
   ------------------------------------------------------------
   Inspirado no portfólio da Mariza Felicio.
   - SVG com filter goo (Gaussian blur + colorMatrix threshold).
   - Trail de N blobs: cada um segue o anterior com easing
     decrescente — mouse parado vira bola pulsante; mouse rápido
     forma cauda alongada.
   - Cor varia com a velocidade: violeta → magenta → coral.
   - Pulsação leve via sin(t) pra dar respiração.
   - Desligado em mobile e em prefers-reduced-motion.
   ============================================================ */

(function () {
  function init() {
    if (window.matchMedia('(max-width: 880px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const N_BLOBS = 12;

    const wrap = document.createElement('div');
    wrap.className = 'goo-bg';
    wrap.setAttribute('aria-hidden', 'true');

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('xmlns', SVG_NS);
    svg.setAttribute('preserveAspectRatio', 'none');

    const defs = document.createElementNS(SVG_NS, 'defs');
    defs.innerHTML = `
      <filter id="goo-trail" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="blur"/>
        <feColorMatrix in="blur" mode="matrix" values="
          1 0 0 0 0
          0 1 0 0 0
          0 0 1 0 0
          0 0 0 22 -10" result="goo"/>
        <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
      </filter>
    `;
    svg.appendChild(defs);

    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('filter', 'url(#goo-trail)');
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
      group.appendChild(c);
      blobs.push({ el: c, x: startX, y: startY });
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
      speed = speed * 0.7 + inst * 0.3;
      lastMX = mouseX;
      lastMY = mouseY;
    }, { passive: true });

    function lerp(a, b, t) { return a + (b - a) * t; }
    function colorByT(t) {
      // slow → violeta; mid → magenta; fast → coral
      let r, g, b;
      if (t < 0.5) {
        const k = t * 2;
        r = lerp(124, 232, k);
        g = lerp(58, 121, k);
        b = lerp(237, 249, k);
      } else {
        const k = (t - 0.5) * 2;
        r = lerp(232, 255, k);
        g = lerp(121, 122, k);
        b = lerp(249, 89, k);
      }
      return `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
    }

    function animate(now) {
      speed *= 0.93;
      const t = Math.min(speed / 28, 1);

      const leadEase = 0.18 + t * 0.18;
      blobs[0].x += (mouseX - blobs[0].x) * leadEase;
      blobs[0].y += (mouseY - blobs[0].y) * leadEase;

      for (let i = 1; i < N_BLOBS; i++) {
        const ease = Math.max(0.06, 0.22 - i * 0.012);
        blobs[i].x += (blobs[i - 1].x - blobs[i].x) * ease;
        blobs[i].y += (blobs[i - 1].y - blobs[i].y) * ease;
      }

      const baseColor = colorByT(t);
      const time = now * 0.002;
      for (let i = 0; i < N_BLOBS; i++) {
        const b = blobs[i];
        const baseR = 56 - i * 3.2;
        const wobble = Math.sin(time + i * 0.7) * 4;
        const r = Math.max(6, baseR + wobble);
        const alpha = Math.max(0.18, 0.95 - i * 0.06);

        b.el.setAttribute('cx', b.x.toFixed(1));
        b.el.setAttribute('cy', b.y.toFixed(1));
        b.el.setAttribute('r', r.toFixed(1));
        b.el.setAttribute('fill', baseColor);
        b.el.setAttribute('fill-opacity', alpha.toFixed(2));
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
