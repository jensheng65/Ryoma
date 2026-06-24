/* ============================================================
   RYOMA — shared chrome: preloader, nav, footer, lotus mark
   Injected by JS so all pages stay consistent (works on file://)
   ============================================================ */

/* ---- Geometric lotus mandala (生命之蓮花 / flower-of-life motif) ---- */
function lotusSVG(stroke, opts = {}) {
  const s = stroke || "currentColor";
  const cx = 100, cy = 100;
  let petals = "";
  const layers = [
    { r: 30, d: 30, n: 12 },
    { r: 22, d: 46, n: 12 },
  ];
  // overlapping-circle rose
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2;
    const px = cx + Math.cos(a) * 30;
    const py = cy + Math.sin(a) * 30;
    petals += `<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="30" />`;
  }
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2 + Math.PI / 12;
    const px = cx + Math.cos(a) * 50;
    const py = cy + Math.sin(a) * 50;
    petals += `<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="22" opacity="0.55" />`;
  }
  return `<svg class="lotus" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
      fill="none" stroke="${s}" stroke-width="${opts.sw || 0.8}">
      <circle cx="100" cy="100" r="78" opacity="0.35"/>
      <circle cx="100" cy="100" r="62" opacity="0.25"/>
      ${petals}
      <circle cx="100" cy="100" r="8" fill="${s}" stroke="none" opacity="0.9"/>
    </svg>`;
}

/* ---- icon set ---- */
const ICON = {
  check: '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z"/><path d="M9 12l2 2 4-4"/></svg>',
  scan: '<svg viewBox="0 0 24 24"><path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/><circle cx="12" cy="12" r="3.2"/></svg>',
  pulse: '<svg viewBox="0 0 24 24"><path d="M2 12h4l3 8 4-16 3 8h6"/></svg>',
  cell: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><circle cx="9" cy="8" r="1.2"/><circle cx="15" cy="15" r="1.2"/></svg>',
  brain: '<svg viewBox="0 0 24 24"><path d="M9 4a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 002 5 3 3 0 005 1V5a3 3 0 00-2-1z"/><path d="M15 4a3 3 0 013 3 3 3 0 012 5 3 3 0 01-2 5 3 3 0 01-5 1"/></svg>',
  node: '<svg viewBox="0 0 24 24"><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M6.5 7.5l4 9M17.5 7.5l-4 9M7 6h10"/></svg>',
  award: '<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="6"/><path d="M9 14l-2 7 5-3 5 3-2-7"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  arrow: '<span class="arr">&rarr;</span>',
};

/* ---- nav config ---- */
const PAGES = [
  { href: "index.html",    label: "Home",        zh: "首頁",   key: "home" },
  { href: "science.html",  label: "Our Science", zh: "腦科學",  key: "science" },
  { href: "services.html", label: "Services",    zh: "服務",   key: "services" },
  { href: "about.html",    label: "About",       zh: "關於龍馬", key: "about" },
  { href: "insights.html", label: "Insights",    zh: "新知",   key: "insights" },
  { href: "contact.html",  label: "Contact",     zh: "預約諮詢", key: "contact" },
];

function buildChrome() {
  const active = document.body.dataset.page || "home";

  /* preloader */
  const pre = document.createElement("div");
  pre.className = "preloader";
  pre.innerHTML = `<div class="pl-mark">${lotusSVG("var(--gold)", { sw: 0.7 })}</div>
    <div class="pl-text">Ryoma Biotechnology</div>`;
  document.body.prepend(pre);

  /* ambient layers */
  const bg = document.createElement("div"); bg.className = "bg-layer";
  const cv = document.createElement("canvas"); cv.id = "neural-canvas";
  const vg = document.createElement("div"); vg.className = "vignette";
  document.body.prepend(vg); document.body.prepend(cv); document.body.prepend(bg);

  /* nav */
  const nav = document.createElement("header");
  nav.className = "nav";
  nav.innerHTML = `
    <div class="nav__inner">
      <a class="nav__logo" href="index.html" aria-label="Ryoma home">
        <img src="assets/ryoma-logo-white.png" alt="RYOMA" />
      </a>
      <nav class="nav__menu">
        ${PAGES.map(p => `<a class="nav__link ${p.key===active?'active':''}" href="${p.href}">${p.label}</a>`).join("")}
      </nav>
      <div class="nav__cta">
        <button class="nav__lang" type="button">中 / EN</button>
        <a class="btn btn--gold" href="contact.html">Book Assessment ${ICON.arrow}</a>
        <button class="nav__burger" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </div>`;
  document.body.prepend(nav);

  /* mobile menu */
  const mm = document.createElement("div");
  mm.className = "mobile-menu";
  mm.innerHTML = `<nav>
      ${PAGES.map((p,i) => `<a href="${p.href}"><span>${p.label}</span><span class="num">0${i+1}</span></a>`).join("")}
    </nav>`;
  document.body.appendChild(mm);

  /* footer */
  const yr = new Date().getFullYear();
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
    <div class="wrap">
      <div class="footer__top">
        <div class="footer__brand">
          <img src="assets/ryoma-logo-white.png" alt="RYOMA" />
          <p class="tagline">Your brain is your most valuable asset.
            <span class="zh">你的大腦，是你最昂貴的資產。</span></p>
          <div class="footer__social">
            <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 014 0v4M11 17v-7"/></svg></a>
            <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/></svg></a>
            <a href="#" aria-label="Line"><svg viewBox="0 0 24 24" stroke-width="1.4"><path d="M21 11c0-4.4-4-8-9-8s-9 3.6-9 8c0 3.9 3.2 7.2 7.5 7.9.9.2.8.8.6 1.6 0 0-.2 1 0 1.2.2.4.8.2 1.2-.1C16 19.5 21 16 21 11z"/></svg></a>
          </div>
        </div>
        <div class="footer__col">
          <h5>Explore</h5>
          ${PAGES.map(p => `<a href="${p.href}">${p.label}</a>`).join("")}
        </div>
        <div class="footer__col">
          <h5>Services</h5>
          <a href="services.html">Brain Age Assessment</a>
          <a href="services.html">Cognitive Optimization</a>
          <a href="services.html">Executive Program</a>
          <a href="services.html">Institutional Partnership</a>
        </div>
        <div class="footer__col">
          <h5>Contact</h5>
          <p>龍馬生技 Ryoma Biotechnology</p>
          <p>新北市土城區自強街 8 號</p>
        </div>
      </div>
      <div class="footer__bottom">
        <p>&copy; ${yr} Ryoma Biotechnology 龍馬生命科技. All rights reserved.</p>
        <p class="disclaimer">AcroViz is FDA-cleared & TFDA-certified. Information presented is for educational purposes and is not a substitute for professional medical advice, diagnosis, or treatment.</p>
      </div>
    </div>`;
       /* <a href="tel:+886227800227">+886 2 2780 0227</a> */
       /* <a href="mailto:hello@ryoma.bio">hello@ryoma.bio</a> */
  document.body.appendChild(footer);

   

  /* interactions */
  const burger = nav.querySelector(".nav__burger");
  burger.addEventListener("click", () => document.body.classList.toggle("menu-open"));
  mm.querySelectorAll("a").forEach(a => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  /* preloader dismiss */
  window.addEventListener("load", () => setTimeout(() => pre.classList.add("done"), 600));
  setTimeout(() => pre.classList.add("done"), 2600); // failsafe
}

buildChrome();
