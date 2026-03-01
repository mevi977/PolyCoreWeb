document.addEventListener('DOMContentLoaded', () => {

  /* Nav scroll */
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', scrollY > 20), {passive:true});

  /* Mobile menu – Walo expand-in-place */
  const mob = document.getElementById('mobMenu');

  function openMob(){
    if(!mob) return;
    // Reset expand paneli
    mob.querySelectorAll('.mob-expand').forEach(e => e.classList.remove('visible'));
    mob.querySelector('.mob-main-list')?.classList.remove('hidden');
    mob.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMob(){
    if(!mob) return;
    mob.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Otvori
  document.querySelectorAll('.nav-burger, #mobOpen').forEach(btn =>
    btn?.addEventListener('click', openMob)
  );

  // Zatvori
  mob?.querySelectorAll('.mob-close').forEach(btn =>
    btn?.addEventListener('click', closeMob)
  );

  // Escape
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMob(); });

  // Expand – klik na glavni link s data-expand
  mob?.querySelectorAll('.mob-main-item[data-expand]').forEach(item => {
    item.addEventListener('click', () => {
      const target = document.getElementById(item.dataset.expand);
      if(!target) return;
      mob.querySelector('.mob-main-list')?.classList.add('hidden');
      // Scroll na vrh body
      mob.querySelector('.mob-body').scrollTop = 0;
      target.classList.add('visible');
    });
  });

  // Zurück
  mob?.querySelectorAll('.mob-back').forEach(btn => {
    btn.addEventListener('click', () => {
      mob.querySelectorAll('.mob-expand').forEach(e => e.classList.remove('visible'));
      mob.querySelector('.mob-main-list')?.classList.remove('hidden');
    });
  });


  /* Accordion */
  document.querySelectorAll('.acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      const body = item?.querySelector('.acc-body');
      const isOpen = item?.classList.contains('open');
      document.querySelectorAll('.acc-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.acc-body').style.maxHeight = '0';
      });
      if (!isOpen && item && body) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* Tabs */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      const wrap = btn.closest('.tabs-wrap');
      wrap?.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      wrap?.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      wrap?.querySelector(`[data-pane="${tab}"]`)?.classList.add('active');
    });
  });

  /* Reveal */
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
  }), {threshold:.1, rootMargin:'0px 0px -50px 0px'});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  /* Counter */
  function runCounter(el) {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const dur = 1600, step = 16, steps = dur/step;
    let cur = 0;
    const inc = target / steps;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = Math.round(cur).toLocaleString('de-CH') + suffix;
    }, step);
  }
  const cObs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = '1'; runCounter(e.target); cObs.unobserve(e.target);
    }
  }), {threshold:.5});
  document.querySelectorAll('[data-counter]').forEach(el => cObs.observe(el));

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
      // Desktop: hover na linku I na panelu
      drop.addEventListener('mouseenter', openDrop);
      drop.addEventListener('mouseleave', closeDrop);
      mega.addEventListener('mouseenter', openDrop);
      mega.addEventListener('mouseleave', closeDrop);
    } else {
      // Touch: klik otvara/zatvara
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

  // Klik izvan zatvara
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-drop')) {
      document.querySelectorAll('.nav-drop.is-open').forEach(d => d.classList.remove('is-open'));
    }
  });

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
    });
  });
});
