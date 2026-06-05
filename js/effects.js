// POLYCORE – Hero Effects: Particles, Text Scramble, Parallax
(function() {

  // ===== PARTICLES =====
  function initParticles(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const hero = canvas.closest('.page-hero') || canvas.closest('.hero');
    if (!hero) return;

    let W, H, particles = [], raf;
    const bordeaux = ['rgba(192,72,90,', 'rgba(160,50,70,', 'rgba(220,100,120,'];

    function resize() {
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }

    function mkParticle() {
      return {
        x: Math.random() * W,
        y: H + 10,
        vx: (Math.random() - .5) * .5,
        vy: -(Math.random() * .8 + .3),
        size: Math.random() * 2.5 + .5,
        alpha: Math.random() * .35 + .08,
        fade: Math.random() * .003 + .001,
        color: bordeaux[Math.floor(Math.random() * bordeaux.length)],
        life: 1,
      };
    }

    resize();
    for (let i = 0; i < 55; i++) {
      const p = mkParticle();
      p.y = Math.random() * H; // rasprseni na pocetak
      particles.push(p);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.fade;
        if (p.life <= 0 || p.y < -10) particles[i] = mkParticle();

        ctx.save();
        ctx.globalAlpha = p.life * p.alpha;
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Linije između bliskih čestica
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x, dy = p.y - p2.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 90) {
            ctx.strokeStyle = 'rgba(192,72,90,' + (.07 * (1 - dist/90)) + ')';
            ctx.lineWidth = .4;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    }

    draw();
    window.addEventListener('resize', resize, {passive: true});
  }

  // ===== TEXT SCRAMBLE =====
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';

  function scrambleEl(el, finalText, delay) {
    if (!el || !finalText) return;
    const orig = finalText;
    setTimeout(() => {
      let frame = 0;
      const total = 22;
      const iv = setInterval(() => {
        el.textContent = orig.split('').map((c, i) => {
          if (c === ' ') return ' ';
          if (frame / total > i / orig.length) return c;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('');
        frame++;
        if (frame > total) { el.textContent = orig; clearInterval(iv); }
      }, 38);
    }, delay);
  }

  function initScramble(hero) {
    // Nadjimo tekstualne elemente u hero sekciji
    const h1 = hero.querySelector('.phi-h1, .h-hero, h1');
    if (!h1) return;

    const spans = h1.querySelectorAll('span');
    const originals = [];

    if (spans.length >= 2) {
      spans.forEach(s => originals.push({el: s, text: s.textContent}));
    } else {
      originals.push({el: h1, text: h1.textContent});
    }

    // Sačekaj body.loaded pa pokreni scramble
    function run() {
      originals.forEach((o, i) => scrambleEl(o.el, o.text, i * 350));
    }

    if (document.body.classList.contains('loaded')) {
      setTimeout(run, 200);
    } else {
      document.body.addEventListener('transitionend', function onLoad() {
        if (document.body.classList.contains('loaded')) {
          setTimeout(run, 200);
          document.body.removeEventListener('transitionend', onLoad);
        }
      });
      // Fallback
      setTimeout(run, 1500);
    }
  }

  // ===== PARALLAX =====
  function initParallax(hero) {
    const bg = hero.querySelector('.page-hero-bg, .hero-bg');
    if (!bg) return;

    let ticking = false;

    hero.addEventListener('mousemove', e => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - .5;
        const y = (e.clientY - rect.top) / rect.height - .5;
        bg.style.transform = `translate(${x * 18}px, ${y * 12}px) scale(1.06)`;
        bg.style.transition = 'transform .08s linear';
        ticking = false;
      });
    }, {passive: true});

    hero.addEventListener('mouseleave', () => {
      bg.style.transform = 'translate(0,0) scale(1)';
      bg.style.transition = 'transform .7s ease';
    }, {passive: true});

    // Mobilni – scroll parallax
    window.addEventListener('scroll', () => {
      if (window.innerWidth > 768) return;
      const rect = hero.getBoundingClientRect();
      const progress = -rect.top / rect.height;
      if (progress >= 0 && progress <= 1) {
        bg.style.transform = `translateY(${progress * 30}px) scale(1.06)`;
      }
    }, {passive: true});
  }

  // ===== INIT =====
  function init() {
    // Pronadji sve hero sekcije
    document.querySelectorAll('.page-hero, .hero').forEach(hero => {
      // Particles canvas
      let canvas = hero.querySelector('.hero-particles');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.className = 'hero-particles';
        canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:2';
        hero.style.position = 'relative';
        hero.insertBefore(canvas, hero.firstChild);
      }
      initParticles(canvas);
      initParallax(hero);
      initScramble(hero);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
