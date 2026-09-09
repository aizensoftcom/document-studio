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

Repo: https://github.com/aizensoftcom/document-studio  

Pages URL (when Actions can run): https://aizensoftcom.github.io/document-studio/

Workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) builds `dist/` and deploys on push to `main`.

**Note:** GitHub Actions is currently blocked on this account by a billing lock. Until that is cleared, use the local preview (or any static HTTPS host of the `preview/` / `dist/` folder) for Install on other machines.

### Local / USB on another PC

```bash
npm run build
# copy preview/ to the other machine, then:
npx --yes serve preview -p 4173
```

Chrome → **Install app**. After the first load the service worker keeps Document Studio offline.

## Source

- `Document-Studio.html` — full offline library (catalog, templates, editor)
- `public/` — manifest, service worker, icons
- `scripts/build-pwa.mjs` — injects PWA hooks into `index.html`

Edited copies no longer show “BEARBEITETE KOPIE” banners.
