# Document Studio (offline PWA)

Offline document library: pick a company template, edit fields (defaults use **Max Mustermann**), export PDF. Installable on other computers via the browser.

## Build

```bash
npm run build
```

Outputs:

- `preview/` — local check
- `dist/` — deploy / GitHub Pages

## Run locally

```bash
npm run preview
```

Open http://localhost:4173 — use Chrome **Install app**, then try offline.

Or:

```bash
npx serve preview -p 4173
```

## Deploy (GitHub Pages)

1. Push this repo to GitHub.
2. Settings → Pages → Source: **GitHub Actions** or branch `gh-pages` / `main` with `/dist` (or root if you publish `dist` contents to `gh-pages`).
3. After the first HTTPS load, **Install** works on other PCs; cache keeps it offline.

Workflow in `.github/workflows/pages.yml` publishes `dist/` automatically on push to `main`.

## Source

- `Document-Studio.html` — full offline library (catalog, templates, editor)
- `public/` — manifest, service worker, icons
- `scripts/build-pwa.mjs` — injects PWA hooks into `index.html`

Edited copies no longer show “BEARBEITETE KOPIE” banners.
