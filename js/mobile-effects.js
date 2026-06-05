// POLYCORE – Mobile Effects
(function() {
  const isMob = window.innerWidth <= 768 || 'ontouchstart' in window;

  // ===== 1. SCROLL REVEAL =====
  // Elementi se otkrivaju pri scrollu
  function initScrollReveal() {
    const style = document.createElement('style');
    style.textContent = `
      .sr-hidden {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity .65s cubic-bezier(.4,0,.2,1), transform .65s cubic-bezier(.4,0,.2,1);
      }
      .sr-hidden.sr-visible {
        opacity: 1;
        transform: translateY(0);
      }
      .sr-hidden.sr-left {
        transform: translateX(-28px);
      }
      .sr-hidden.sr-left.sr-visible {
        transform: translateX(0);
      }
      .sr-hidden.sr-right {
        transform: translateX(28px);
      }
      .sr-hidden.sr-right.sr-visible {
        transform: translateX(0);
      }
    `;
    document.head.appendChild(style);

    // Selektori koji se reveal-aju
    const selectors = [
      '.benefit-cell',
      '.app-card',
      '.related-card',
      '.faq-item',
      '.content-body h2',
      '.content-body h3',
      '.content-body p',
      '.sidebar-cta',
      '.section > .container > div > .h1',
      '.section > .container > .h1',
      '.eyebrow',
      '.cta-banner',
    ];

    const elements = [];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach((el, i) => {
        if (el.closest('.page-hero, .hero')) return; // Preskoči hero
        el.classList.add('sr-hidden');
        // Alternativno lijevo/desno za kartice u gridu
        if (el.classList.contains('benefit-cell') || el.classList.contains('app-card')) {
          if (i % 3 === 0) el.classList.add('sr-left');
          else if (i % 3 === 2) el.classList.add('sr-right');
        }
        elements.push(el);
      });
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Blagi delay za staggered efekt unutar grida
          const siblings = Array.from(entry.target.parentElement?.children || []);
          const idx = siblings.indexOf(entry.target);
          const delay = (idx % 3) * 80;
          setTimeout(() => {
            entry.target.classList.add('sr-visible');
          }, delay);
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => obs.observe(el));
  }

  // ===== 2. GYROSCOPE PARALLAX (mobilni) =====
  function initGyroParallax() {
    if (!isMob) return;
    if (!window.DeviceOrientationEvent) return;

    const heroes = document.querySelectorAll('.page-hero, .hero');
    if (!heroes.length) return;

    let permission = false;

    function startGyro() {
      window.addEventListener('deviceorientation', e => {
        const x = (e.gamma || 0) / 30; // -1 do 1
        const y = (e.beta  || 0) / 60; // -1 do 1

        heroes.forEach(hero => {
          const bg = hero.querySelector('.page-hero-bg, .hero-bg');
          if (!bg) return;
          bg.style.transform = `translate(${x * 12}px, ${y * 8}px) scale(1.05)`;
          bg.style.transition = 'transform .3s linear';
        });
      }, {passive: true});
    }

    // iOS treba eksplicitnu dozvolu
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      document.addEventListener('touchstart', function onTouch() {
        DeviceOrientationEvent.requestPermission()
          .then(state => { if (state === 'granted') startGyro(); })
          .catch(() => {});
        document.removeEventListener('touchstart', onTouch);
      }, {once: true});
    } else {
      startGyro();
    }
  }

  // ===== 3. SCROLL PARALLAX za hero na mobitelu =====
  function initScrollParallax() {
    if (!isMob) return;
    const heroes = document.querySelectorAll('.page-hero, .hero');
    if (!heroes.length) return;

    window.addEventListener('scroll', () => {
      heroes.forEach(hero => {
        const rect = hero.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const progress = -rect.top / rect.height;
        const bg = hero.querySelector('.page-hero-bg, .hero-bg');
        if (bg) {
          bg.style.transform = `translateY(${progress * 35}px) scale(1.06)`;
          bg.style.transition = 'none';
        }
      });
    }, {passive: true});
  }

  // ===== 4. TOUCH RIPPLE na gumbima =====
  function initRipple() {
    const style = document.createElement('style');
    style.textContent = `
      .phi-btn-p, .btn-p, .btn, .btn-light, .btnp {
        position: relative;
        overflow: hidden;
      }
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,.25);
        transform: scale(0);
        animation: rippleAnim .5s linear;
        pointer-events: none;
      }
      @keyframes rippleAnim {
        to { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    function addRipple(e) {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const touch = e.touches ? e.touches[0] : e;
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const size = Math.max(rect.width, rect.height);

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x - size/2}px;
        top: ${y - size/2}px;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }

    document.querySelectorAll('.phi-btn-p, .btn-light, .btnp, .btn-p').forEach(btn => {
      btn.addEventListener('touchstart', addRipple, {passive: true});
      btn.addEventListener('mousedown', addRipple);
    });
  }

  // ===== 5. SMOOTH SCROLL za navbar linkove =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
      });
    });
  }

  // ===== 6. NAVBAR HIDE/SHOW pri scrollu na mobitelu =====
  function initNavHide() {
    if (!isMob) return;
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const current = window.scrollY;
        if (current > lastScroll && current > 120) {
          // Scroll prema dolje - sakrij navbar
          nav.style.transform = 'translateX(-50%) translateY(calc(-100% - 2rem))';
          nav.style.transition = 'transform .35s ease';
        } else {
          // Scroll prema gore - prikaži navbar
          nav.style.transform = 'translateX(-50%) translateY(0)';
        }
        lastScroll = current;
        ticking = false;
      });
    }, {passive: true});
  }

  // Init
  document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initGyroParallax();
    initScrollParallax();
    initRipple();
    initSmoothScroll();
    initNavHide();
  });

})();
