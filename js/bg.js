/* ============================================================
   STLAI Asset Generator — Background interativo (Versão B)
   ------------------------------------------------------------
   Sistema de partículas efêmeras (Canvas 2D) inspirado em rastro
   de luz com dissipação:
   - Cabeça brilhante segue o cursor.
   - Cada posição passada vira partícula que cresce e desbota.
   - Forma de cogumelo quando o cursor para após mover.
   - Composite "lighter" (luz somando luz) sobre fundo escuro.
   - Desligado em mobile e em prefers-reduced-motion.
   ============================================================ */

(function () {
  function init() {
    if (window.matchMedia('(max-width: 880px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Container + canvas
    const wrap = document.createElement('div');
    wrap.className = 'goo-bg';
    wrap.setAttribute('aria-hidden', 'true');
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    wrap.appendChild(canvas);
    document.body.appendChild(wrap);

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // Pré-renderiza sprite da partícula (radial gradient luminoso).
    // Renderizamos uma só vez e reusamos com drawImage + alpha + scale.
    const SPRITE = 256;
    function makeSprite(stops) {
      const off = document.createElement('canvas');
      off.width = SPRITE; off.height = SPRITE;
      const c = off.getContext('2d');
      const g = c.createRadialGradient(SPRITE/2, SPRITE/2, 0, SPRITE/2, SPRITE/2, SPRITE/2);
      stops.forEach(([off, color]) => g.addColorStop(off, color));
      c.fillStyle = g;
      c.fillRect(0, 0, SPRITE, SPRITE);
      return off;
    }
    // Paleta inspirada na imagem de referência: pink/magenta saturado
    // no centro → roxo médio → roxo escuro nas bordas. Sem branco.
    const sprites = [
      makeSprite([
        [0.0, 'rgba(240,130,220,0.85)'],
        [0.20, 'rgba(200,100,220,0.65)'],
        [0.50, 'rgba(140,60,190,0.30)'],
        [1.0, 'rgba(70,20,130,0)'],
      ]),
      makeSprite([
        [0.0, 'rgba(232,121,249,0.85)'],
        [0.20, 'rgba(180,90,230,0.60)'],
        [0.50, 'rgba(120,50,180,0.28)'],
        [1.0, 'rgba(60,15,120,0)'],
      ]),
      makeSprite([
        [0.0, 'rgba(244,114,182,0.80)'],
        [0.20, 'rgba(200,90,200,0.55)'],
        [0.50, 'rgba(140,55,170,0.25)'],
        [1.0, 'rgba(80,20,110,0)'],
      ]),
    ];

    // Mouse
    let mouseX = W / 2, mouseY = H / 2;
    let hasMouse = false;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY; hasMouse = true;
    }, { passive: true });

    // Partículas
    const particles = [];
    const MAX = 80;

    function spawn(now) {
      // Pequeno jitter pra variar o nascimento
      const jx = (Math.random() - 0.5) * 6;
      const jy = (Math.random() - 0.5) * 6;
      particles.push({
        x: mouseX + jx,
        y: mouseY + jy,
        bornAt: now,
        life: 1100 + Math.random() * 600, // ms
        r0: 18 + Math.random() * 8,        // raio inicial
        rGrow: 110 + Math.random() * 70,   // quanto cresce
        vy: -0.15 - Math.random() * 0.25,  // drift pra cima (px/frame ~)
        vx: (Math.random() - 0.5) * 0.3,
        sprite: sprites[(Math.random() * sprites.length) | 0],
        peak: 0.55 + Math.random() * 0.2,  // alpha de pico
      });
      if (particles.length > MAX) particles.shift();
    }

    let lastSpawn = 0;
    const SPAWN_INTERVAL = 18; // ms — ~55 spawns/s

    function frame(now) {
      ctx.clearRect(0, 0, W, H);

      if (hasMouse && now - lastSpawn > SPAWN_INTERVAL) {
        spawn(now);
        lastSpawn = now;
      }

      ctx.globalCompositeOperation = 'lighter';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = now - p.bornAt;
        const t = age / p.life;
        if (t >= 1) { particles.splice(i, 1); continue; }

        // Movimento próprio: drift e leve dispersão
        p.x += p.vx;
        p.y += p.vy;

        // Raio cresce com a idade
        const r = p.r0 + p.rGrow * t;
        // Alpha: fade-in rápido, fade-out longo
        const fadeIn = Math.min(1, t * 6);
        const fadeOut = 1 - t;
        const alpha = p.peak * fadeIn * fadeOut * fadeOut; // ease-out² no fim

        ctx.globalAlpha = alpha;
        ctx.drawImage(p.sprite, p.x - r, p.y - r, r * 2, r * 2);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
