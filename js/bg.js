/* ============================================================
   STLAI Asset Generator — Background interativo (Versão A)
   ------------------------------------------------------------
   Estilo "água-viva luminosa" inspirado na Mariza Felicio.
   - Cada blob usa <radialGradient> (centro luminoso → borda transparente).
   - Offset orbital por blob → forma irregular mesmo parado.
   - Trail com easing suave + leve respiração.
   - Desligado em mobile e em prefers-reduced-motion.
   ============================================================ */

(function () {
  function init() {
    if (window.matchMedia('(max-width: 880px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const N_BLOBS = 6;

    const wrap = document.createElement('div');
    wrap.className = 'goo-bg';
    wrap.setAttribute('aria-hidden', 'true');

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('xmlns', SVG_NS);
    svg.setAttribute('preserveAspectRatio', 'none');

    // 3 gradientes radiais (núcleo → cor → transparente). Cada blob escolhe um.
    const defs = document.createElementNS(SVG_NS, 'defs');
    defs.innerHTML = `
      <radialGradient id="g-violet" cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stop-color="rgb(245,225,255)" stop-opacity="0.95"/>
        <stop offset="35%" stop-color="rgb(180,120,255)" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="rgb(90,30,180)"  stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="g-magenta" cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stop-color="rgb(255,220,250)" stop-opacity="0.95"/>
        <stop offset="35%" stop-color="rgb(232,121,249)" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="rgb(170,40,200)" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="g-coral" cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stop-color="rgb(255,230,210)" stop-opacity="0.85"/>
        <stop offset="35%" stop-color="rgb(244,114,140)" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="rgb(180,40,80)"  stop-opacity="0"/>
      </radialGradient>
      <filter id="bg-soft" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="14"/>
      </filter>
    `;
    svg.appendChild(defs);

    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('filter', 'url(#bg-soft)');
    svg.appendChild(group);

    wrap.appendChild(svg);
    document.body.appendChild(wrap);

    let W = window.innerWidth, H = window.innerHeight;
    function setSize() {
      W = window.innerWidth; H = window.innerHeight;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    }
    setSize();
    window.addEventListener('resize', setSize);

    const startX = W / 2, startY = H / 2;
    const gradients = ['g-violet', 'g-magenta', 'g-coral'];
    const blobs = [];

    for (let i = 0; i < N_BLOBS; i++) {
      const c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('cx', startX);
      c.setAttribute('cy', startY);
      c.setAttribute('r', 0);
      c.setAttribute('fill', `url(#${gradients[i % gradients.length]})`);
      group.appendChild(c);
      blobs.push({
        el: c, x: startX, y: startY,
        phase: Math.random() * Math.PI * 2,
        orbitRadius: 30 + Math.random() * 40,   // distância do alvo
        orbitSpeed: 0.4 + Math.random() * 0.4,  // rad/s
        baseR: 130 - i * 12,
      });
    }

    let mouseX = startX, mouseY = startY;
    let lastMX = startX, lastMY = startY;
    let speed = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      const dx = mouseX - lastMX, dy = mouseY - lastMY;
      const inst = Math.sqrt(dx * dx + dy * dy);
      speed = speed * 0.78 + inst * 0.22;
      lastMX = mouseX; lastMY = mouseY;
    }, { passive: true });

    function animate(now) {
      speed *= 0.95;
      const v = Math.min(speed / 30, 1);
      const time = now * 0.001;

      // Líder converge no mouse com easing leve
      const leadEase = 0.07 + v * 0.10;
      blobs[0].x += (mouseX - blobs[0].x) * leadEase;
      blobs[0].y += (mouseY - blobs[0].y) * leadEase;

      // Cauda: cada blob segue o anterior + offset orbital próprio
      for (let i = 1; i < N_BLOBS; i++) {
        const ease = Math.max(0.04, 0.12 - i * 0.012);
        blobs[i].x += (blobs[i - 1].x - blobs[i].x) * ease;
        blobs[i].y += (blobs[i - 1].y - blobs[i].y) * ease;
      }

      for (let i = 0; i < N_BLOBS; i++) {
        const b = blobs[i];
        // Offset orbital → forma irregular mesmo parado
        const ox = Math.cos(time * b.orbitSpeed + b.phase) * b.orbitRadius;
        const oy = Math.sin(time * b.orbitSpeed * 1.3 + b.phase) * b.orbitRadius;
        // Respiracao no raio
        const wobble = Math.sin(time * 1.5 + b.phase) * 22;
        const r = Math.max(40, b.baseR + wobble);

        b.el.setAttribute('cx', (b.x + ox).toFixed(1));
        b.el.setAttribute('cy', (b.y + oy).toFixed(1));
        b.el.setAttribute('r', r.toFixed(1));
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
