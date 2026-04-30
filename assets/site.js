(function () {
  const isLowPower =
    (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4) ||
    (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4);
  if (isLowPower) document.documentElement.classList.add('low-motion');

  document.querySelectorAll('#year').forEach(el => { el.textContent = new Date().getFullYear(); });

  const canVibrate = 'vibrate' in navigator && window.matchMedia('(pointer: coarse)').matches;
  const hap = (p = [8]) => { if (canVibrate) navigator.vibrate(p); };
  document.querySelectorAll('.haptic-tap').forEach(el => {
    el.addEventListener('pointerup', () => hap());
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') hap([6]); });
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger > *');

  if (reducedMotion) {
    reveals.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  const nav = document.getElementById('mobile-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (nav && toggle) {
    const open = () => {
      nav.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', open);
    nav.querySelectorAll('[data-mobile-nav-close]').forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) close(); });
  }
})();
