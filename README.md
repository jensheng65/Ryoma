# Ryoma Biotechnology — 龍馬生命科技

A premium, awwwards-style brand website for a neuro-longevity company. Dark, cinematic
aesthetic with a live 3D neural-network background, bilingual (Traditional Chinese / English)
content, and the brand's lotus-mandala (生命之蓮花) motif.

## Run

It's a static site — no build step. Serve the `site/` folder over HTTP:

```bash
cd site
python3 -m http.server 8130
# open http://localhost:8130
```

(Opening `index.html` via `file://` also works, but a local server is recommended so the
shared JS chrome and Google Fonts load cleanly.)

## Pages

| File | Page |
|------|------|
| `index.html`    | Home — hero, why-Ryoma, 3 pillars, trust + 10-year stat, CTA |
| `science.html`  | Our Science — dMRI, Brain Age™ algorithm, 8 networks, comparison table, regeneration |
| `services.html` | Services — 4 programs, journey timeline |
| `about.html`    | About — mission, values, story, leadership |
| `insights.html` | Insights — editorial feature, filterable article grid |
| `contact.html`  | Contact — consultation form (with `?interest=` prefill) + clinic info |

## Structure

```
site/
├── css/styles.css      Design system + all components (CSS custom properties for brand colours)
├── js/
│   ├── components.js    Shared chrome: preloader, nav, mobile menu, footer, lotus SVG, icons
│   ├── neural.js        Three.js 3D neural-fiber background (2D canvas fallback)
│   └── main.js          Scroll reveal, number counters, insights filter, contact form
├── assets/             Brand logos (white / black)
└── *.html
```

## Tech

- **Three.js** (r128, CDN) — animated brain-like neural node cloud with proximity lines; falls
  back to a 2D canvas particle field if WebGL is unavailable, and respects `prefers-reduced-motion`.
- **GSAP** (CDN) loaded for animation; scroll reveals use IntersectionObserver.
- **Fonts**: Jost (Futura substitute) headlines · Roboto captions/buttons · Bitter body · Noto Sans TC.
- **SEO**: per-page title/description, Open Graph tags, and `MedicalOrganization` JSON-LD on Home.

## Before publishing

- Replace leadership photo placeholders in `about.html`.
- Confirm clinic contact details (currently 寰愛診所, 台北市松山區健康路 152 號 8 樓, +886 2 2780 0227).
- Wire the contact form to a real backend/endpoint (currently shows a client-side success state).
- Swap the favicon / OG image for final brand artwork if desired.
