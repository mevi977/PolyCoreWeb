document.addEventListener('DOMContentLoaded', () => {

  /* Nav scroll */
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', scrollY > 20), {passive:true});

  /* Mobile menu – Walo bijela kartica */
  const mob = document.getElementById('mobMenu');
  const backdrop = document.getElementById('mobBackdrop');

  function openMob(){
    if(!mob) return;
    mob.querySelectorAll('.mob-expand').forEach(e => e.classList.remove('visible'));
    mob.querySelector('.mob-main-list')?.classList.remove('hidden');
    mob.classList.add('open');
    backdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMob(){
    if(!mob) return;
    mob.classList.remove('open');
    backdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.nav-burger, #mobOpen').forEach(btn =>
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
      mob.querySelector('.mob-body').scrollTop = 0;
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
