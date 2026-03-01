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

});
