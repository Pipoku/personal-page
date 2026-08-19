# Renzo Carletti — Personal Page

Portfolio built with [Astro](https://astro.build) (static, zero-JS default), vanilla WebGL for the hero particle network, glassmorphism + aurora design. Fully bilingual (EN/ES), B&W mode, optimized for performance.

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site → dist/
npm run preview  # serve the built site
```

Requires Node.js 20.19+ or 22+.

## Deploy

The build output is a pure static site in `dist/` — deployable anywhere. No server needed.

### Option 1 — Cloudflare Pages (recommended)

1. Push this repo to GitHub.
2. In Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Build command: `npm run build` — output directory: `dist`.
4. Optional: set `SITE_URL` env var to your real domain (used for sitemap + og:image URLs). Defaults to `https://renzocarletti.dev`.
5. Free, global CDN, no repo-name path prefix needed.

### Option 2 — GitHub Pages (automatic)

A workflow is included (`.github/workflows/deploy.yml`). After pushing:

1. Repo → **Settings → Pages** → Source: **GitHub Actions**.
2. Push to `main` — site auto-deploys to `https://<user>.github.io/<repo>/`.
3. The workflow sets `SITE_URL` and `ASTRO_BASE` automatically, so links/assets work under the repo path.

### Option 3 — Netlify / Vercel

Point the service at the repo. Build command `npm run build`, output `dist`. Import wizard auto-detects Astro.

## Configuration

- **Content**: everything lives in `src/data/cv.js` (profile, stats, experience, projects, skills, certs, education).
- **Translations**: `src/i18n/translations.js` (EN/ES). Language auto-detects from browser, user can switch via nav, persists in `localStorage`.
- **Site URL**: set `SITE_URL` at build time, or edit `site` in `astro.config.mjs`.

## Before going live

- [ ] Update `github` URL in `src/data/cv.js` (currently a placeholder).
- [ ] Point `SITE_URL` / `site` to your real domain.
- [ ] Replace `public/cv.pdf` with your latest CV (already updated from source).

## Performance notes

- Zero JS by default; the only runtime JS is nav, reveal, i18n, and the hero WebGL scene (~6KB, lazy-loaded).
- Hero particle network is hand-rolled WebGL — replaces a ~510KB Three.js bundle.
- Rendering pauses when the hero is off-screen or the tab is hidden.
- Latin-only font subsets, self-hosted variable fonts, `content-visibility` on sections.
- `prefers-reduced-motion` disables all animation (including the WebGL scene).