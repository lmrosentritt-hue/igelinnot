/* ============================================================
   VIEW SWITCHER – Desktop ↔ Mobile Ansicht
   Technik: CSS-Scale-Transform auf einem #vs-wrapper div
   (Viewport-Meta kann nach pageload nicht mehr geändert werden –
    daher skalieren wir stattdessen den gesamten Seiteninhalt)
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY   = 'igel-view-mode';
  const MOBILE_PX     = 390;   // simulierte Handybreite in px
  const DESKTOP_MIN   = 1200;  // Mindestbreite für Desktop-Erzwingung

  let currentMode = localStorage.getItem(STORAGE_KEY) || 'auto';
  let wrapper     = null;      // das #vs-wrapper div

  /* ── CSS injizieren ─────────────────────────────────── */
  function injectStyles() {
    const s = document.createElement('style');
    s.id = 'vs-styles';
    s.textContent = `
      /* Wrapper nimmt vollen Platz ein, transform kommt drauf */
      #vs-wrapper {
        transform-origin: top left;
        width: 100%;
        min-height: 100vh;
        overflow-x: hidden;
      }

      /* ═══ MOBILE-MODUS ═══ */
      html[data-view="mobile"] body {
        overflow-x: hidden;
      }
      html[data-view="mobile"] #vs-wrapper {
        width: ${MOBILE_PX}px !important;
        /* Skalierung wird per JS gesetzt */
      }

      /* ═══ DESKTOP-MODUS ═══ */
      html[data-view="desktop"] #vs-wrapper {
        width: ${DESKTOP_MIN}px !important;
        /* Skalierung wird per JS gesetzt */
      }

      /* ── Toggle-Button ── */
      #vs-toggle-btn {
        position: fixed;
        bottom: 88px;
        right: 20px;
        z-index: 99999;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        background: #2B1F12;
        color: #F5C13C;
        border: 2px solid #F5C13C;
        border-radius: 999px;
        padding: 10px 18px 10px 14px;
        font-family: 'Nunito', 'Segoe UI', sans-serif;
        font-size: 0.82rem;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 4px 18px rgba(43,31,18,0.45);
        transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
        letter-spacing: 0.01em;
        white-space: nowrap;
        user-select: none;
      }
      #vs-toggle-btn:hover {
        background: #4A3520;
        transform: translateY(-3px) scale(1.04);
        box-shadow: 0 8px 28px rgba(43,31,18,0.50);
      }
      #vs-toggle-btn[data-mode="mobile"] {
        background: #F5C13C;
        color: #2B1F12;
        border-color: #2B1F12;
      }
      #vs-toggle-btn[data-mode="mobile"]:hover {
        background: #F8D571;
        transform: translateY(-3px) scale(1.04);
      }
      #vs-toggle-btn #vs-icon {
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }
      @keyframes vsBounce {
        0%   { transform: scale(1); }
        30%  { transform: scale(0.88) rotate(-5deg); }
        65%  { transform: scale(1.12) rotate(4deg); }
        100% { transform: scale(1) rotate(0); }
      }
      #vs-toggle-btn.vs-bounce { animation: vsBounce 0.45s ease; }

      /* Mode-Badge oben links – zeigt aktuelle Ansicht */
      #vs-badge {
        position: fixed;
        top: 70px;
        right: 16px;
        z-index: 99998;
        background: rgba(43,31,18,0.85);
        color: #F5C13C;
        font-family: 'Nunito', monospace, sans-serif;
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        padding: 4px 11px;
        border-radius: 999px;
        pointer-events: none;
        backdrop-filter: blur(4px);
        display: none;
      }
    `;
    document.head.appendChild(s);
  }

  /* ── Gesamten Body-Inhalt in #vs-wrapper einwickeln ─── */
  function wrapBody() {
    if (document.getElementById('vs-wrapper')) {
      wrapper = document.getElementById('vs-wrapper');
      return; // schon eingewickelt
    }
    wrapper = document.createElement('div');
    wrapper.id = 'vs-wrapper';

    // Alle direkten Body-Kinder (außer fixed-position Buttons) verschieben
    const children = Array.from(document.body.childNodes);
    children.forEach(child => {
      // Script-Tags und unsere eigenen fixed Elemente nicht einwickeln
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();
        if (tag === 'script') return;
      }
      wrapper.appendChild(child);
    });
    document.body.insertBefore(wrapper, document.body.firstChild);
  }

  /* ── Skalierung berechnen & anwenden ─────────────────── */
  function applyScale() {
    if (!wrapper) return;
    const vw = window.innerWidth;

    if (currentMode === 'mobile') {
      const scale = vw / MOBILE_PX;
      wrapper.style.transform = `scale(${scale})`;
      wrapper.style.transformOrigin = 'top left';
      // Höhe kompensieren damit kein Leeraum entsteht
      wrapper.style.height = '';
      document.body.style.height = '';
    } else if (currentMode === 'desktop') {
      if (vw < DESKTOP_MIN) {
        const scale = vw / DESKTOP_MIN;
        wrapper.style.transform = `scale(${scale})`;
        wrapper.style.transformOrigin = 'top left';
        // Body-Höhe anpassen damit kein Scroll-Gap
        const wrapH = wrapper.scrollHeight;
        document.body.style.height = (wrapH * scale) + 'px';
      } else {
        wrapper.style.transform = 'none';
        wrapper.style.transformOrigin = 'top left';
        document.body.style.height = '';
      }
    } else {
      // auto
      wrapper.style.transform = 'none';
      wrapper.style.width = '';
      document.body.style.height = '';
    }
  }

  /* ── Modus anwenden ───────────────────────────────────── */
  function applyMode(mode) {
    currentMode = mode;
    localStorage.setItem(STORAGE_KEY, mode);

    if (!wrapper) wrapBody();

    // Breite setzen
    if (mode === 'mobile') {
      wrapper.style.width = MOBILE_PX + 'px';
      document.documentElement.setAttribute('data-view', 'mobile');
    } else if (mode === 'desktop') {
      wrapper.style.width = DESKTOP_MIN + 'px';
      document.documentElement.setAttribute('data-view', 'desktop');
    } else {
      wrapper.style.width = '';
      document.documentElement.setAttribute('data-view', 'auto');
    }

    applyScale();
    updateButtonState(mode);
    updateBadge(mode);
  }

  /* ── Badge ────────────────────────────────────────────
     Es reicht ein einziges Bedienelement zum Umschalten – der
     Toggle-Button. Das frühere zusätzliche Status-Badge wird daher
     nicht mehr angezeigt (und ein evtl. vorhandenes entfernt). */
  function updateBadge() {
    const badge = document.getElementById('vs-badge');
    if (badge) badge.remove();
  }

  /* ── Button-Zustand ──────────────────────────────────── */
  function updateButtonState(mode) {
    const btn  = document.getElementById('vs-toggle-btn');
    const icon = document.getElementById('vs-icon');
    const lbl  = document.getElementById('vs-label');
    if (!btn) return;

    btn.setAttribute('data-mode', mode);

    if (mode === 'mobile') {
      if (icon) icon.innerHTML = iconMobile();
      if (lbl)  lbl.textContent = 'Mobil';
      btn.title = '→ Desktop-Ansicht';
    } else {
      if (icon) icon.innerHTML = iconDesktop();
      if (lbl)  lbl.textContent = 'Desktop';
      btn.title = '→ Mobil-Ansicht';
    }
  }

  /* ── Toggle-Klick ─────────────────────────────────────── */
  function handleToggle() {
    const next = (currentMode === 'mobile') ? 'desktop' : 'mobile';
    applyMode(next);

    const btn = document.getElementById('vs-toggle-btn');
    if (btn) {
      btn.classList.add('vs-bounce');
      setTimeout(() => btn.classList.remove('vs-bounce'), 450);
    }
  }

  /* ── SVG Icons ───────────────────────────────────────── */
  function iconMobile() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>`;
  }
  function iconDesktop() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <polyline points="8 21 12 17 16 21"/>
    </svg>`;
  }

  /* ── Button erstellen ────────────────────────────────── */
  function createButton() {
    if (document.getElementById('vs-toggle-btn')) return;
    const btn = document.createElement('button');
    btn.id   = 'vs-toggle-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Ansicht wechseln');
    btn.setAttribute('data-mode', currentMode);
    btn.innerHTML = `
      <span id="vs-icon">${currentMode === 'mobile' ? iconMobile() : iconDesktop()}</span>
      <span id="vs-label">${currentMode === 'mobile' ? 'Mobil' : 'Desktop'}</span>
    `;
    btn.addEventListener('click', handleToggle);
    document.body.appendChild(btn);
  }

  /* ── Window-Resize: neu skalieren ────────────────────── */
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyScale, 80);
  });

  /* ── Init ─────────────────────────────────────────────── */
  function init() {
    injectStyles();
    wrapBody();
    createButton();
    applyMode(currentMode);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
