/* ═══════════════════════════════════════════════════════════════
   INDUS AUTOMATION — Core JavaScript
   Handles: navigation, scroll, mobile menu, back-to-top,
   lazy loading, scroll animations, accessibility
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileNav();
  initBackToTop();
  initScrollAnimations();
  initLazyLoading();
  setActiveNav();
});

/* ─── STICKY NAV SCROLL EFFECT ─── */
function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ─── MOBILE NAV ─── */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      links.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ─── BACK TO TOP ─── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.scrollY > 400);
        ticking = false;
      });
      ticking = true;
    }
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── SCROLL REVEAL ANIMATIONS ─── */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => observer.observe(el));
}

/* ─── LAZY LOADING (images, videos, backgrounds) ─── */
function initLazyLoading() {
  const lazyEls = document.querySelectorAll('[data-src], [data-bg]');
  if (!lazyEls.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.src) { el.src = el.dataset.src; el.removeAttribute('data-src'); }
        if (el.dataset.bg) { el.style.backgroundImage = `url(${el.dataset.bg})`; el.removeAttribute('data-bg'); }
        el.classList.add('loaded');
        observer.unobserve(el);
      }
    });
  }, { rootMargin: '200px' });
  lazyEls.forEach(el => observer.observe(el));
}

/* ─── SET ACTIVE NAV LINK ─── */
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (!href) return;
    if ((href === '/' || href === '/index.html') && (path === '/' || path.endsWith('/index.html'))) {
      link.classList.add('active');
    } else if (path.includes('/services/') && href.includes('services')) {
      link.classList.add('active');
    } else if (href !== '/' && href !== '/index.html' && path.includes(href.replace('.html', ''))) {
      link.classList.add('active');
    }
  });
}

/* ─── SMOOTH SCROLL ANCHORS ─── */
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const target = document.querySelector(anchor.getAttribute('href'));
  if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
});
