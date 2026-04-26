document.addEventListener('DOMContentLoaded', () => {

  /* Nav scroll */
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', scrollY > 20), {passive:true});

  /* Mobile menu – drawer iz navbara */
  const mob = document.getElementById('mobMenu');
  const backdrop = document.getElementById('mobBackdrop');
  const burger = document.querySelector('.nav-burger');

  function openMob(){
    if(!mob) return;
    mob.querySelectorAll('.mob-expand').forEach(e => e.classList.remove('visible'));
    mob.querySelector('.mob-main-list')?.classList.remove('hidden');
    mob.classList.add('open');
    backdrop?.classList.add('open');
    burger?.classList.add('open');
    nav?.classList.add('mob-open');
  }
  function closeMob(){
    if(!mob) return;
    mob.classList.remove('open');
    backdrop?.classList.remove('open');
    burger?.classList.remove('open');
    nav?.classList.remove('mob-open');
  }

  burger?.addEventListener('click', () => {
    mob?.classList.contains('open') ? closeMob() : openMob();
  });
  document.querySelectorAll('#mobOpen').forEach(btn =>
    btn?.addEventListener('click', openMob)
  );
  mob?.querySelectorAll('.mob-close').forEach(btn =>
    btn?.addEventListener('click', closeMob)
  );
  backdrop?.addEventListener('click', closeMob);
  document.addEventListener('keydown', e => { if(e.key==='Escape') closeMob(); });

  mob?.querySelectorAll('.mob-main-item[data-expand]').forEach(item => {
    item.addEventListener('click', () => {
      const target = document.getElementById(item.dataset.expand);
      if(!target) return;
      mob.querySelector('.mob-main-list')?.classList.add('hidden');
      target.classList.add('visible');
    });
  });
  mob?.querySelectorAll('.mob-back').forEach(btn => {
    btn.addEventListener('click', () => {
      mob.querySelectorAll('.mob-expand').forEach(e => e.classList.remove('visible'));
      mob.querySelector('.mob-main-list')?.classList.remove('hidden');
    });
  });

  /* Mega dropdown – JS kontroliran hover s delay-om */
  const isTouch = ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  document.querySelectorAll('.nav-drop').forEach(drop => {
    const mega = drop.querySelector('.mega');
    if (!mega) return;
    let closeTimer = null;

    function openDrop() {
      clearTimeout(closeTimer);
      drop.classList.add('is-open');
    }
    function closeDrop() {
      closeTimer = setTimeout(() => drop.classList.remove('is-open'), 320);
    }

    if (!isTouch) {
      drop.addEventListener('mouseenter', openDrop);
      drop.addEventListener('mouseleave', closeDrop);
      mega.addEventListener('mouseenter', openDrop);
      mega.addEventListener('mouseleave', closeDrop);
    } else {
      const toggle = drop.querySelector('.nav-drop-toggle');
      if (toggle) {
        toggle.addEventListener('click', e => {
          const isOpen = drop.classList.contains('is-open');
          document.querySelectorAll('.nav-drop.is-open').forEach(d => d.classList.remove('is-open'));
          if (!isOpen) { e.preventDefault(); drop.classList.add('is-open'); }
        });
      }
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-drop')) {
      document.querySelectorAll('.nav-drop.is-open').forEach(d => d.classList.remove('is-open'));
    }
  });

  /* Accordion */
  document.querySelectorAll('.acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      const body = item.querySelector('.acc-body');
      const isOpen = item.classList.contains('open');
      // Zatvori sve
      document.querySelectorAll('.acc-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.acc-body').style.maxHeight = null;
      });
      // Otvori kliknuti ako nije bio otvoren
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* Tabs */
  document.querySelectorAll('.tabs-wrap').forEach(wrap => {
    const btns = wrap.querySelectorAll('.tab-btn');
    const panels = wrap.querySelectorAll('.tab-panel');
    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        panels[i]?.classList.add('active');
      });
    });
  });

  /* Reveal animacije – scroll */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* Counter animacije */
  const cObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 1800;
      const start = performance.now();
      const isFloat = String(target).includes('.');
      const decimals = isFloat ? (String(target).split('.')[1]?.length || 1) : 0;

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const value = target * ease;
        el.textContent = prefix + (decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString('de-CH')) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      cObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => cObs.observe(el));

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
    });
  });

  /* Telefon plutajući gumb */
  const tel = document.createElement('a');
  tel.href = 'tel:+41765397974';
  tel.setAttribute('aria-label', 'Anrufen');
  tel.innerHTML = `
    <style>
      .tel-btn {
        position: fixed;
        bottom: 6rem;
        right: 1.75rem;
        z-index: 9000;
        width: 50px;
        height: 50px;
        background: #0a0a0a;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(0,0,0,.25);
        text-decoration: none;
        transition: transform .2s, background .15s, box-shadow .2s;
      }
      .tel-btn:hover {
        background: #4a0e1a;
        transform: translateY(-3px) scale(1.08);
        box-shadow: 0 8px 24px rgba(74,14,26,.4);
      }
      @media(max-width: 480px) {
        .tel-btn { bottom: 5.5rem; right: 1.25rem; width: 46px; height: 46px; }
      }
    </style>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.12 1.18 2 2 0 012.1 0h3a2 2 0 012 1.72c.13 1 .37 1.97.72 2.9a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.18-1.18a2 2 0 012.11-.45c.93.35 1.9.59 2.9.72A2 2 0 0122 16.92z"/></svg>`;
  tel.className = 'tel-btn';
  document.body.appendChild(tel);

  /* WhatsApp plutajući gumb */
  const wa = document.createElement('a');
  wa.href = 'https://wa.me/41765397974';
  wa.target = '_blank';
  wa.rel = 'noopener noreferrer';
  wa.setAttribute('aria-label', 'WhatsApp');
  wa.innerHTML = `
    <style>
      .wa-btn {
        position: fixed;
        bottom: 1.75rem;
        right: 1.75rem;
        z-index: 9000;
        display: flex;
        align-items: center;
        gap: .65rem;
        background: #25D366;
        color: #fff;
        border-radius: 50px;
        padding: .65rem 1.1rem .65rem .85rem;
        box-shadow: 0 4px 20px rgba(37,211,102,.35), 0 2px 8px rgba(0,0,0,.15);
        text-decoration: none;
        font-family: 'Instrument Sans', sans-serif;
        font-size: .82rem;
        font-weight: 700;
        letter-spacing: .01em;
        transition: transform .2s, box-shadow .2s, background .15s;
        animation: waPulse 2.5s ease-in-out infinite;
      }
      .wa-btn:hover {
        background: #1ebe5d;
        transform: translateY(-3px) scale(1.04);
        box-shadow: 0 8px 28px rgba(37,211,102,.45), 0 4px 12px rgba(0,0,0,.2);
        animation: none;
      }
      .wa-btn svg { flex-shrink: 0; }
      .wa-btn span { white-space: nowrap; }
      @keyframes waPulse {
        0%, 100% { box-shadow: 0 4px 20px rgba(37,211,102,.35), 0 2px 8px rgba(0,0,0,.15); }
        50% { box-shadow: 0 4px 28px rgba(37,211,102,.6), 0 2px 8px rgba(0,0,0,.15); }
      }
      @media(max-width: 480px) {
        .wa-btn span { display: none; }
        .wa-btn { padding: .75rem; border-radius: 50%; }
      }
    </style>
    <svg width="22" height="22" viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2C8.268 2 2 8.268 2 16c0 2.466.666 4.778 1.826 6.766L2 30l7.434-1.794A13.938 13.938 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.55 11.55 0 01-5.896-1.614l-.422-.252-4.41 1.064 1.098-4.3-.276-.442A11.558 11.558 0 014.4 16C4.4 9.593 9.593 4.4 16 4.4S27.6 9.593 27.6 16 22.407 27.6 16 27.6zm6.334-8.666c-.346-.174-2.05-1.01-2.368-1.124-.316-.116-.546-.174-.776.174-.228.346-.89 1.124-1.092 1.354-.2.228-.4.26-.748.086-.346-.174-1.46-.538-2.78-1.716-1.028-.916-1.722-2.048-1.924-2.394-.2-.346-.022-.534.152-.706.156-.156.346-.406.52-.61.174-.202.232-.346.346-.578.116-.23.058-.432-.028-.608-.088-.174-.776-1.872-1.064-2.564-.28-.672-.564-.58-.776-.59l-.66-.012a1.264 1.264 0 00-.916.43c-.316.346-1.2 1.172-1.2 2.858s1.228 3.316 1.4 3.544c.174.228 2.418 3.692 5.858 5.178.818.354 1.458.564 1.956.722.822.26 1.57.224 2.16.136.66-.098 2.05-.838 2.34-1.648.29-.81.29-1.504.202-1.648-.086-.146-.316-.232-.66-.406z"/>
    </svg>
    <span>076 539 79 74</span>`;
  wa.className = 'wa-btn';
  document.body.appendChild(wa);

});
