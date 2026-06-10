# Pokémon TCG Drop Tracker — Gold Coast QLD

> What real-life Pokémon TCG products are dropping next, when are they releasing in Australia, and which Gold Coast / nearby Australian shops may stock them?

A fan-made static site tracking upcoming Pokémon TCG releases and preorders for collectors on the **Gold Coast, Queensland, Australia**. Updated automatically via a daily GitHub Actions script.

---

## What it tracks

- Elite Trainer Boxes (ETBs)
- Booster boxes
- Booster bundles
- Collection boxes & premium collections
- Tins and decks
- Preorder drops and expected restocks

Prioritises Gold Coast stores, then Brisbane / SEQ, then Australian online retailers.

---

## Tech stack

| Layer | Tech |
|-------|------|
| Site framework | [Astro](https://astro.build) |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Language | TypeScript |
| Data scripts | Node.js + [tsx](https://github.com/privatenumber/tsx) |
| Automation | GitHub Actions |
| Deploy | Netlify / Vercel / GitHub Pages |

---

## How it works

```
GitHub Actions (daily)
    │
    ▼
scripts/update-releases.ts
    │  Calls each source adapter
    │  Normalises & deduplicates products
    │  Writes to ↓
    ▼
src/data/releases.generated.json
    │
    ▼
Astro build → static HTML
    │
    ▼
Live website reads the JSON at build time
```

The site is fully static — no backend, no database, no live server required.

---

## Getting started

```bash
# Install dependencies
npm install

# Start local dev server (hot reload)
npm run dev

# Run the data update script manually
npm run update:releases

# Build the static site
npm run build

# Preview the built site
npm run preview
```

---

## Updating releases manually

Run the update script any time:

```bash
npm run update:releases
```

This runs every source adapter in `scripts/sources/`, normalises the data,
deduplicates it, and overwrites `src/data/releases.generated.json`.

To trigger the GitHub Action manually, go to the **Actions** tab in your repo,
select **Update Pokémon Releases**, and click **Run workflow**.

---

## Adding a new store

1. Open `src/data/stores.config.ts`
2. Add a new object to the `stores` array:

```ts
{
  id: "my-new-store",           // unique slug
  name: "My New Store",
  suburb: "Southport",
  region: "Gold Coast",         // "Gold Coast" | "Brisbane" | "Australia Online" | "Other"
  type: "local_game_store",     // "local_game_store" | "major_retailer" | "online_retailer"
  websiteUrl: "https://example.com",
  stocksPokemonTcg: true,
  hasOnlinePreorders: false,
  notes: "Optional notes here.",
},
```

3. Rebuild: `npm run build`

---

## Adding a new source adapter

Source adapters live in `scripts/sources/`. Each adapter is a TypeScript file
that exports an async function returning `Partial<PokemonRelease>[]`.

1. Create `scripts/sources/mySource.ts`:

```ts
import type { PokemonRelease } from "../../src/types/release.js";
import { logger } from "../utils/logger.js";
// Optionally import: fetchPage, fetchJson from ../utils/fetchPage.js

export async function mySource(): Promise<Partial<PokemonRelease>[]> {
  logger.info("mySource: fetching data");

  // Option A: Return static/curated data
  return [
    {
      name: "Some ETB",
      productType: "Elite Trainer Box",
      releaseDate: "2025-12-01",
      region: "Australia",
      confidence: "medium",
      sourceUrls: ["https://example.com/product"],
      retailersToCheck: ["My Store"],
    },
  ];

  // Option B: Fetch a public page and parse it
  // const html = await fetchPage("https://example.com/pokemon-tcg");
  // if (!html) return [];
  // ... parse html ...
}
```

2. Register it in `scripts/update-releases.ts`:

```ts
import { mySource } from "./sources/mySource.js";

const ADAPTERS = [
  // ... existing adapters ...
  { name: "mySource", fn: mySource },
];
```

3. Run: `npm run update:releases`

---

## Deploying

### Netlify

1. Push to GitHub
2. Connect your repo in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

The GitHub Action commits updated data daily — Netlify will auto-redeploy.

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Framework: Astro (auto-detected)
4. Deploy

### GitHub Pages

In `astro.config.mjs`, set your base/site:

```js
export default defineConfig({
  site: "https://yourusername.github.io",
  base: "/pokemon-tcg-gold-coast-tracker",
  integrations: [tailwind()],
});
```

Then add a GitHub Actions deploy workflow (see [Astro docs](https://docs.astro.build/en/guides/deploy/github/)).

---

## Confidence levels

| Level | Meaning |
|-------|---------|
| **High** | Product and date confirmed by an official source or clear AU retailer listing |
| **Medium** | Likely real — AU availability inferred from retailer patterns or early listings |
| **Low** | Rumoured, missing date, or not yet confirmed for Australia |

---

## Ethical scraping notes

This project respects public web access policies:

- ✓ Uses a clear `User-Agent` string identifying the project
- ✓ Adds delays between requests (no aggressive crawling)
- ✓ Handles failed fetches gracefully — no crashing
- ✓ Shows source links so users can verify data themselves
- ✗ Does NOT bypass CAPTCHAs or bot protection
- ✗ Does NOT use private APIs or require logins
- ✗ Does NOT scrape blocked sites — it skips them and logs why
- ✗ Does NOT make up stock availability
- ✗ Does NOT claim a store will have stock without a confirmed source

If a retailer blocks automated access, the adapter is updated to return
curated/static data only, and this is documented in the adapter file.

---

## Known limitations

- Release dates can change — The Pokémon Company adjusts schedules without notice
- Australian dates sometimes differ from global/US release windows
- Retailer stock is never guaranteed, even on launch day
- Some major retailers (Big W, Kmart, Target) block automated access — their data is curated manually
- This tracker covers physical products only, not Pokémon TCG Live digital products

---

## Suggested initial git commits

```bash
git init
git add .
git commit -m "init: project scaffold with Astro, TypeScript, Tailwind"

git add src/types/ src/data/
git commit -m "feat: add TypeScript types and sample release/store data"

git add src/components/ src/layouts/ src/pages/ src/styles/
git commit -m "feat: add all pages, components, and base layout"

git add scripts/
git commit -m "feat: add data update script and source adapters"

git add .github/
git commit -m "ci: add GitHub Actions workflow for daily release updates"

git add README.md
git commit -m "docs: add README with setup, deployment, and contributing guide"

---

## Phase 4 — Real source extraction

This project ships with a safe, conservative data pipeline. Phase 4 improves
real public data extraction one source at a time while prioritising safety and
reliability.

Key points:

- The pipeline uses `scripts/sources/*` adapters. Each adapter should fetch only
  public pages and return `Partial<PokemonRelease>[]`.
- Adapters must not bypass CAPTCHAs, logins, or bot protection.
- Use `fetchPage()` (from `scripts/utils`) which sets a clear User-Agent and
  enforces polite delays between requests.
- If parsing fails or a site blocks access, adapters should fall back to curated
  data and log the reason.
- The update script supports `--dry-run` which fetches and normalises data but
  does not write files.

How to add a Phase 4 adapter:

1. Create `scripts/sources/mySource.ts` exporting an async function returning
   `Partial<PokemonRelease>[]`.
2. Use `import { fetchPage, logger } from "../utils/index.js"` to fetch pages
   and log results.
3. Attempt lightweight parsing (JSON-LD or small HTML snippets). If parsing
   fails, return curated fallback data and log the issue.
4. Add your adapter to `scripts/sources/index.ts` so the main script picks it up.

Running the update script with dry-run:

```bash
# dry run — fetch and normalise, but do not write JSON
npm run update:releases -- --dry-run
```

Why some adapters are conservative

- Many retailer sites are JavaScript-heavy (rendered client-side) or explicitly
  block automated requests. Building fragile scrapers for these pages leads to
  frequent breakages. The recommended approach is:
  - Prefer official sources (Pokemon product pages, Pokemon Center)
  - Use JSON-LD or clearly structured HTML where available
  - Fall back to curated entries when scraping is not feasible

Ethical scraping summary

- Respect `robots.txt` and site terms of use
- Use clear `User-Agent` and polite request pacing
- Do not attempt to bypass technical protections

```

---

## Disclaimer

This is a fan-made community project. Not affiliated with, endorsed by, or connected to
Nintendo, Creatures Inc., GAME FREAK, or The Pokémon Company International.

Stock availability is never guaranteed. Release dates can change. Always verify with
the retailer directly before travelling or making purchasing decisions.

---

*Built with ☕ on the Gold Coast, QLD, Australia.*
