/* Gemeinsame Header/Footer/Sticky-SOS Komponenten via JS-Injection */

(function() {
  const currentPage = document.body.dataset.page || '';

  const nav = [
    { key: 'start',    href: 'index.html',             label: 'Start' },
    { key: 'lehrpfad', href: 'lehrpfad.html',          label: 'Lehr- und Lernpfad' },
    { key: 'wissen',   href: 'kinder.html',            label: 'Wissen, Quiz & Spiel', cls: 'nav-wissen' },
    { key: 'mitmachen',href: 'mitmachen.html',         label: 'Mitmachen',            cls: 'nav-mitmachen' },
    { key: 'shop',     href: 'shop.html',              label: '🛒 Shop',              cls: 'nav-shop' },
    { key: 'notfall',  href: 'notfall.html',           label: '🚨 Notfall',           cls: 'nav-notfall' },
  ];

  const saisonMsg = {
    // Monat 1-12
    1: '❄️ Winterschlaf – Igel bitte nicht stören. Bei aktiven Igeln unter 600 g sofort melden!',
    2: '❄️ Winterschlaf – Igel bitte nicht stören. Bei aktiven Igeln unter 600 g sofort melden!',
    3: '🌱 Erwachen – Wasserschalen rausstellen, Gartenecken noch nicht umgraben.',
    4: '🌿 Frühling – Igel brauchen jetzt Wasser & Versteckmöglichkeiten im Garten.',
    5: '⚠️ Mäh-Saison! Bitte vor dem Mähen Wiese absuchen – besonders abends & nachts!',
    6: '🌸 Paarungszeit – Achtung beim Mähroboter! Nachts immer ausschalten.',
    7: '🦔 Erste Igelkinder – verwaiste Babys (Augen zu) sofort melden!',
    8: '🌻 Hochsaison – viele Jungigel unterwegs. Auf der Straße vorsichtig fahren.',
    9: '🍂 Herbst – Igel fressen sich Winterspeck an. Laubhaufen als Quartier liegen lassen!',
    10: '🍁 Oktober – Untergewichtige Igel (<500 g) brauchen Hilfe. Wiegen & melden!',
    11: '🏡 Einwintern – Igel suchen Quartier. Laubhaufen & Reisig bitte stehen lassen.',
    12: '❄️ Winterschlaf – Igel bitte nicht stören. Bei aktiven Igeln unter 600 g sofort melden!',
  };

  const month = new Date().getMonth() + 1;

  // === SAISON-BANNER ===
  const banner = document.createElement('div');
  banner.className = 'saison-banner';
  banner.innerHTML = `<strong>Gerade im ${['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'][month-1]}:</strong> ${saisonMsg[month]}`;

  // === HEADER ===
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="header-inner">
      <a class="logo" href="index.html" aria-label="Startseite">
        <img class="logo-mark-img" src="/cdn-img/logo-sos-igel.png" alt="SOS Igel in Not Wappen" width="56" height="56">
        <div class="logo-text">
          <strong>SOS Igel in Not</strong>
          <span>Lehr- und Lernpfad Drautal · Feistritz/Drau</span>
          <span class="logo-sub">Projektleiterin: Ursula Ertl</span>
        </div>
      </a>
      <button class="burger" aria-label="Menü öffnen" onclick="document.querySelector('.nav').classList.toggle('open')">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <nav class="nav">
        ${nav.map(n => `<a href="${n.href}" class="${n.key === currentPage ? 'active' : ''} ${n.cls || ''}">${n.label}</a>`).join('')}
      </nav>
    </div>
  `;

  // === STICKY SOS (kompakt, expandiert bei Hover/Klick) ===
  const sos = document.createElement('a');
  sos.className = 'sticky-sos';
  sos.href = 'tel:+436502699710';
  sos.setAttribute('aria-label', 'Igel-Notruf 0650 269 97 10');
  sos.setAttribute('title', 'Igel-Notruf öffnen');
  sos.innerHTML = `
    <span class="sos-icon" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    </span>
    <span class="sos-label"><span class="dot"></span>Igel-Notruf: <strong>0650 / 269 97 10</strong></span>
  `;
  // Auf Touch-Geräten: erstes Tippen → ausklappen, zweites → wählen
  sos.addEventListener('click', (ev) => {
    if (window.matchMedia('(hover: none)').matches && !sos.classList.contains('is-open')) {
      ev.preventDefault();
      sos.classList.add('is-open');
      setTimeout(() => sos.classList.remove('is-open'), 4000);
    }
  });

  // === FOOTER ===
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <h4>SOS Igel in Not · Lehr- und Lernpfad</h4>
          <p style="opacity:0.85">Lehr- und Lernpfad rund um den Igel in Feistritz an der Drau. Wir päppeln verletzte, kranke und verwaiste Igel und klären auf.</p>
          <p style="margin-top:16px; font-family:'Caveat',cursive; font-size:1.3rem; color:#F4C67E;">„Gemeinsam für unsere Natur –<br>jede Hand, jedes Herz zählt." ♥<br><span style="font-size:0.95rem; opacity:0.8; font-family:'Nunito',sans-serif;">— Ursula Ertl</span></p>
          <p style="margin-top:12px; font-size:0.85rem; opacity:0.75;">
            <a href="https://www.facebook.com/profile.php?id=61570800514610" target="_blank" rel="noopener">➜ Facebook: SOS Igel in Not Lehr- und Lernpfad Drautal</a>
          </p>
        </div>
        <div>
          <h4>Notfall</h4>
          <p><a href="tel:+436502699710">0650 / 269 97 10</a><br>Ursula Ertl</p>
          <p style="opacity:0.75; font-size:0.9rem;">Ursula Ertl · jederzeit erreichbar</p>
        </div>
        <div>
          <h4>Seiten</h4>
          <p style="line-height:2;">
            <a href="lehrpfad.html">Lehrpfad</a><br>
            <a href="fallgeschichten.html">Fallgeschichten</a><br>
            <a href="kinder.html">Kinder-Ecke</a><br>
            <a href="mitmachen.html">Mitmachen</a>
          </p>
        </div>
        <div>
          <h4>Förderhinweis</h4>
          <p style="opacity:0.85; font-size:0.9rem;">Unterstützt durch<br><strong>LEADER 2026</strong><br>Region Nockberge-Lieser-Maltatal</p>
        </div>
      </div>
      <div class="footer-bottom">
        © ${new Date().getFullYear()} SOS Igel in Not · Feistritz an der Drau ·
        <a href="#">Impressum</a> · <a href="#">Datenschutz</a> · <a href="agb.html">AGB</a> · <a href="shop.html">🛒 Shop</a>
      </div>
    </div>
  `;

  // === Animations-Element: das Wappen / Logo läuft sanft durchs Bild ===
  const igel = document.createElement('div');
  igel.className = 'real-igel';
  igel.setAttribute('aria-hidden', 'true');
  igel.innerHTML = `
    <img src="/cdn-img/logo-sos-igel.png" alt="">
  `;
  // Mount Banner, Header, Footer, SOS-Button + Igel
  document.body.insertBefore(banner, document.body.firstChild);
  document.body.insertBefore(header, banner.nextSibling);
  document.body.appendChild(footer);
  document.body.appendChild(sos);
  document.body.appendChild(igel);

  // === VIEW SWITCHER (Desktop ↔ Mobile) lazy-load ===
  const vsScript = document.createElement('script');
  vsScript.src = 'assets/view-switcher.js';
  document.body.appendChild(vsScript);

  // === NAV SHOP-LINK optisch hervorheben ===
  const shopStyle = document.createElement('style');
  shopStyle.textContent = `
    .nav a.nav-shop {
      background: var(--sun, #F5C13C) !important;
      color: var(--ink, #2B1F12) !important;
      font-weight: 900 !important;
      border-radius: 999px !important;
      padding-left: 14px !important;
      padding-right: 14px !important;
    }
    .nav a.nav-shop:hover {
      background: #e8b12a !important;
      color: var(--ink, #2B1F12) !important;
    }
    .nav a.nav-shop.active {
      background: var(--ink, #2B1F12) !important;
      color: var(--sun, #F5C13C) !important;
    }
  `;
  document.head.appendChild(shopStyle);

  // (keine Phasen-Logik mehr nötig – CSS macht die Animation)
  function updateIgelState() {}
  setInterval(updateIgelState, 150);
})();
