/* SIAN GORAT SAMOSIR — shared behavior */
(function () {
  'use strict';

  /* ----- Navbar scroll state ----- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const setScrolled = () => {
      if (window.scrollY > 20) nav.classList.add('nav--scrolled');
      else nav.classList.remove('nav--scrolled');
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  /* ----- Mobile menu ----- */
  const menu = document.querySelector('.mobile-menu');
  const menuOpen = document.querySelector('[data-menu-open]');
  const menuClose = document.querySelector('[data-menu-close]');
  if (menu && menuOpen) {
    menuOpen.addEventListener('click', () => menu.classList.add('is-open'));
    if (menuClose) menuClose.addEventListener('click', () => menu.classList.remove('is-open'));
  }

  /* ----- Reveal on scroll ----- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  /* ----- Tweaks Panel (persisted to localStorage) ----- */
  const TWEAK_KEYS = ['palette', 'gorga', 'hero', 'type'];
  const TWEAK_DEFAULTS = { palette: 'red', gorga: 'subtle', hero: 'A', type: 'cormorant' };
  const saved = JSON.parse(localStorage.getItem('sgs_tweaks') || '{}');
  const state = Object.assign({}, TWEAK_DEFAULTS, saved);

  function applyTweaks() {
    document.documentElement.setAttribute('data-palette', state.palette);
    document.documentElement.setAttribute('data-gorga', state.gorga === 'subtle' ? 'low' : state.gorga);
    document.documentElement.setAttribute('data-type', state.type);
    document.documentElement.setAttribute('data-hero', state.hero);
    localStorage.setItem('sgs_tweaks', JSON.stringify(state));
    // Update UI
    document.querySelectorAll('[data-tweak]').forEach(btn => {
      const key = btn.getAttribute('data-tweak');
      const val = btn.getAttribute('data-value');
      btn.classList.toggle('is-active', state[key] === val);
    });
  }

  const tweaksPanel = document.querySelector('.tweaks');
  const tweaksToggle = document.querySelector('.tweaks__toggle');
  const tweaksClose = document.querySelector('[data-tweaks-close]');
  if (tweaksPanel && tweaksToggle) {
    tweaksToggle.addEventListener('click', () => tweaksPanel.classList.toggle('is-open'));
    if (tweaksClose) tweaksClose.addEventListener('click', () => tweaksPanel.classList.remove('is-open'));
    document.querySelectorAll('[data-tweak]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-tweak');
        const val = btn.getAttribute('data-value');
        state[key] = val;
        applyTweaks();
      });
    });
  }
  applyTweaks();

  /* ----- FAQ Accordion ----- */
  document.querySelectorAll('[data-faq]').forEach(item => {
    const q = item.querySelector('[data-faq-q]');
    if (q) q.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      const a = item.querySelector('[data-faq-a]');
      if (a) a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
    });
  });

  /* ----- Simple testimonial / carousel ----- */
  document.querySelectorAll('[data-carousel]').forEach(car => {
    const track = car.querySelector('[data-carousel-track]');
    const prev = car.querySelector('[data-carousel-prev]');
    const next = car.querySelector('[data-carousel-next]');
    if (!track) return;
    const step = () => Math.min(track.clientWidth * 0.9, track.scrollWidth - track.clientWidth);
    if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  });

  /* ----- Product filter (product listing page) ----- */
  const filterBar = document.querySelector('[data-filters]');
  const grid = document.querySelector('[data-product-grid]');
  if (filterBar && grid) {
    filterBar.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-filter');
        filterBar.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('is-active', b === btn));
        grid.querySelectorAll('[data-cat]').forEach(item => {
          if (val === 'all' || item.getAttribute('data-cat') === val) item.style.display = '';
          else item.style.display = 'none';
        });
      });
    });
    const sort = filterBar.querySelector('[data-sort]');
    if (sort) sort.addEventListener('change', () => {
      const items = Array.from(grid.children);
      const val = sort.value;
      items.sort((a, b) => {
        const pa = parseInt(a.getAttribute('data-price') || 0, 10);
        const pb = parseInt(b.getAttribute('data-price') || 0, 10);
        if (val === 'low') return pa - pb;
        if (val === 'high') return pb - pa;
        return 0;
      });
      items.forEach(i => grid.appendChild(i));
    });
  }

  /* ----- Single product: gallery ----- */
  const gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    const main = gallery.querySelector('[data-gallery-main]');
    gallery.querySelectorAll('[data-gallery-thumb]').forEach(th => {
      th.addEventListener('click', () => {
        gallery.querySelectorAll('[data-gallery-thumb]').forEach(x => x.classList.remove('is-active'));
        th.classList.add('is-active');
        if (main) {
          main.innerHTML = th.innerHTML;
        }
      });
    });
  }
})();
