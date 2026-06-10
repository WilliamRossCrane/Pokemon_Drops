# Pokémon TCG Drop Predictor — Gold Coast QLD

> What real-life Pokémon TCG products are dropping next, when are they releasing in Australia, and which Gold Coast / nearby Australian shops may stock them?

A fan-made static site tracking upcoming Pokémon TCG releases, preorders and likely retailer drops for collectors on the **Gold Coast, Queensland, Australia**.

This project was built using a **vibe coding workflow**. A lot of the data and prediction logic is intentionally **hard-coded, curated and static**, which is part of what makes it simple and useful. Instead of trying to be a complicated live stock checker, this site works as a lightweight collector tool that makes educated predictions from known release patterns.

---

## What it tracks

- Elite Trainer Boxes (ETBs)
- Booster boxes
- Booster bundles
- Collection boxes & premium collections
- Tins and decks
- Preorder drops
- Expected restocks
- Likely Australian retailers to check

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

- `src/data/releases.generated.json` contains future Pokémon TCG release data.
- `src/data/previous-release-patterns.json` contains simple historical retailer patterns.
- `src/utils/predictRetailers.ts` reads the patterns and generates retailer predictions based on product type and release weekday.
- Astro renders the predictions into the release list and release detail pages at build time.

This site is intentionally simple:

- no live stock checking
- no backend database
- no user accounts
- no checkout automation
- no complicated observation engine
- no pretending predictions are confirmed stock

The hard-coded and curated setup is deliberate. It keeps the project fast, easy to debug and easy to maintain while still being useful for collectors.

The main idea is:

- hard-code known upcoming products
- store previous release patterns
- compare similar product types
- predict likely retailers to check
- keep everything static and easy to update

---

## Getting started

```bash
# Install dependencies
npm install

# Start local dev server
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

This updates the generated release data used by the site.

To trigger the GitHub Action manually, go to the **Actions** tab in your repo, select **Update Pokémon Releases**, and click **Run workflow**.

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

3. Rebuild:

```bash
npm run build
```

---

## Deploying

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Framework: Astro
4. Deploy

Then add a GitHub Actions deploy workflow using the Astro docs.

---

## Ethical data notes

This project is conservative and simple by design.

- ✓ Uses public information only
- ✓ Uses source links where possible
- ✓ Handles failed data updates gracefully
- ✓ Allows curated/static fallback data
- ✗ Does NOT bypass CAPTCHAs or bot protection
- ✗ Does NOT use private APIs or require logins
- ✗ Does NOT claim a store has stock without a confirmed source
- ✗ Does NOT automate checkout or purchasing

If retailer information is unclear or unreliable, the project should use curated fallback data instead of pretending it has live information.

---

## Known limitations

- Release dates can change
- Australian dates sometimes differ from global/US release windows
- Retailer stock is never guaranteed
- Some retailer data is manually curated
- Some prediction logic is based on hard-coded previous patterns
- This tracker does not check live stock
- This tracker covers physical products only, not Pokémon TCG Live digital products

---

## Disclaimer

This is a fan-made community project. Not affiliated with, endorsed by, sponsored by or connected to Nintendo, Creatures Inc., GAME FREAK, The Pokémon Company or The Pokémon Company International.

Stock availability is never guaranteed. Release dates can change. Always verify with the retailer directly before travelling or making purchasing decisions.

---

*Built with ☕ on the Gold Coast, QLD, Australia.*
