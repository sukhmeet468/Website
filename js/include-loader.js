/* ═══════════════════════════════════════════════════════════════
   INCLUDE LOADER — Loads shared header & footer into each page.
   Works on any web server. Falls back gracefully.
   ═══════════════════════════════════════════════════════════════ */
(function() {
  async function loadInclude(el) {
    const path = el.getAttribute('data-include');
    if (!path) return;
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(res.status);
      el.innerHTML = await res.text();
      // Dispatch event so main.js can re-init nav
      document.dispatchEvent(new CustomEvent('includesLoaded'));
    } catch(e) {
      console.warn('Include failed:', path, e);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const els = document.querySelectorAll('[data-include]');
    Promise.all([...els].map(loadInclude)).then(() => {
      document.dispatchEvent(new CustomEvent('includesLoaded'));
    });
  });
})();
