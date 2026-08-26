## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

For LAN/Wi-Fi access from other devices (phone, other PCs), add `--host`:

```
astro dev --host --background
```

This binds to all network interfaces and prints a `Network:` URL (e.g. `http://192.168.1.x:4321/`) alongside the usual `localhost` one. A Windows Firewall inbound rule for `node.exe` needs to allow the network's active profile (Private/Public) — check with `Get-NetFirewallApplicationFilter | Where Program -like '*node.exe*' | Get-NetFirewallRule` and `Get-NetConnectionProfile` before assuming it's blocked; don't add/modify firewall rules without asking first.

**Known Vite dev-mode gotcha:** overwriting an `.astro` file's content wholesale (e.g. via a tool that replaces the whole file rather than a diff/patch) can leave Vite's CSS module cache stale — the HTML reflects the new markup but the compiled CSS module keeps serving the *previous* file's styles, so the page renders with classes present but zero CSS applied. Diagnose by checking `document.styleSheets` for the expected class names, or curling the raw `?astro&type=style&index=0&lang.css` module URL directly. Fix: `astro dev stop` then `astro dev --background` (a full page reload/HMR is not sufficient).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

---

## Project Reference

This section documents how the site is actually built today — the conventions, data flow, and gotchas a new contributor (human or AI) needs before making changes. It reflects the real code, not the original `npm create astro` starter README (which is stale — see `README.md`).

### Stack

- **Astro 7**, static output, no UI framework installed (React/Vue/etc. are not used — every interactive bit is inline `<script>` + vanilla DOM APIs inside `.astro` files).
- No CSS framework/Tailwind — every page/component has its own scoped `<style>` block (or `is:global` where cross-component targeting is required — see "Astro style scoping" below). `astro.config.mjs` is an empty `defineConfig({})`; no integrations added.
- `tsconfig.json` extends `astro/tsconfigs/strict`.
- One dependency: `astro` itself (`package.json`). Node `>=22.12.0` required.
- `astro:transitions`' `ClientRouter` is enabled site-wide (registered once in `Layout.astro`'s `<head>`) — every internal navigation is a client-side swap of `<main>`, not a hard page load. Header/footer/upgrade-reminder-bar use `transition:persist` and are never torn down between pages.

### Directory map

```
src/
  layouts/Layout.astro        — the ONE layout every page uses (verified: no page bypasses it)
  components/                 — homepage-only + shared components (see inventory below)
  components/product/         — components shared across /product and /services detail pages
  data/                       — canonical content arrays (services.ts, productCategories.ts, customers.ts)
  pages/                      — file-based routing (see routing map below)
  assets/                     — astro:assets-managed images (logo, hero backgrounds, brand PNGs)
public/
  images/hero/                — plain static files referenced by string path (NOT astro:assets)
```

### Routing map and the `/product/` vs `/services/` split

This is the single most important, least-obvious convention in the codebase: **Products live under `/product/*`, Services live under `/services/*`** — these prefixes are not interchangeable and a page landed in the wrong one earlier in the project's history (since fixed). When adding a new page, decide which branch of `ourBusinessMenu` (in `Layout.astro`) it belongs to and match that prefix.

```
/products                              — summary/index page, mirrors ourBusinessMenu's Products branch
/product/test-equipment-measurement/   — category landing + 4 brand pages (lindos, freedom-astronics, redwood, doewe)
/product/calibration-test-measurement/ — "ATE System" product page (name is legacy — see below)
/product/iot/                          — IoT category landing + 3 sub-product pages

/services                              — summary/index page, mirrors ourBusinessMenu's Services branch
/services/calibration-test-measurement/ — "Calibration and Test Measurement" SERVICE (distinct from the ATE System PRODUCT above — same-sounding name, different page, different branch)
/services/repair-work/
/services/equipment-rental/
/services/training/
/services/customize-solution-provider/  — + 3 children: electronic-design-service, 3d-design-service, rd-service

/our-business    — summary page combining both branches (Services + Products), reuses data/services.ts + data/productCategories.ts
/our-company, /contact, /news-events    — standalone pages
/case-studies    — ORPHANED: still on disk, no longer linked from nav/footer (replaced by /news-events), kept pending confirmation before deletion. Don't assume it's dead code to remove without checking with the user first.
```

**`/product/calibration-test-measurement/` vs `/services/calibration-test-measurement/` are two different, deliberately separate pages** — the directory name is the same because both trace back to the same original "Calibration and Test Measurement" wording, but one was repurposed into the ATE System product page and the other kept the original calibration-service content. Check the frontmatter comment at the top of each before assuming they're duplicates.

The **single source of truth for the nav tree** is `ourBusinessMenu` in `src/layouts/Layout.astro`. It drives: the header's "Our Business" flyout, the footer's Quick Links columns, and (via `data/productCategories.ts` / `data/services.ts`, which are hand-kept in sync with it) `/products`, `/services`, `/our-business`, and the homepage carousel. If you change the nav, `ourBusinessMenu` is the first place to look — then check whether `productCategories.ts`/`services.ts` need the same update.

### Shared data sources (`src/data/`)

Established pattern: **one canonical array per content domain, imported everywhere it's needed** — never hand-duplicate the same card copy across pages. This exists specifically because `/products` drifted stale from the real nav before this pattern was introduced (it had a hardcoded, unrelated fake catalog) — don't reintroduce that failure mode.

- **`services.ts`** — `ServiceItem[]`, the 5 Services entries. Used by `/services`, `/our-business`.
- **`productCategories.ts`** — `ProductCategory[]` (with nested `ProductChild[]`), the 3 Products entries incl. Test Equipment's 4 brand children (with `logo`/`logoAlt`/`logoChipVariant`) and IoT's 3 children. Used by `/products`, `/our-business`, and the homepage `ShowcaseCarousel`.
- **`customers.ts`** — `Customer[]` (`{ name, logoSrc?, href? }`) for the homepage "Our Customers" logo wall. **Currently 100% placeholder data — see the file's own comment block.** No real customer names/logos exist yet, and every entry deliberately omits `logoSrc` so `CustomerLogoGrid` renders its neutral "logo coming soon" placeholder card rather than anything resembling a real (or fabricated) client claim. Before adding real entries, two things need to happen outside of code: (1) get the real logo art, (2) get that customer's explicit sign-off to display their logo publicly. Both are flagged in the file itself, not just here.

If a nav change is made, update `ourBusinessMenu` (Layout.astro) AND whichever of `services.ts`/`productCategories.ts` mirrors that branch — they are not auto-derived from each other.

### Component inventory

| Component | Purpose |
|---|---|
| `layouts/Layout.astro` | The only layout. Head/theme script, header (logo, theme toggle, nav), `<main><slot /></main>`, footer, all global CSS tokens/design-system rules. |
| `components/NavFlyout.astro` | Recursive cascading flyout for "Our Business" — renders itself via `Astro.self` for unbounded nesting depth. Desktop: hover-intent flyouts with keyboard arrow-nav. Mobile/touch: renders as a plain inline accordion (CSS media-query swap, same markup). `MenuItem` accepts an optional `logo`/`logoAlt`/`logoChipVariant` to show a `BrandLogoChip` next to a label. |
| `components/ShowcaseCarousel.astro` | Homepage 3D "coverflow" carousel. `ShowcaseItem[]` prop. Auto-rotates until the visitor interacts (click/drag/arrow), at which point it stops **permanently** (timers are cleared, not just paused/flagged). Cards are `<button>`s that dispatch a `holopreview:select` CustomEvent — they do not navigate directly. |
| `components/HoloPreviewPanel.astro` | Homepage-only sci-fi "hologram" display that mirrors whichever `ShowcaseItem` was last selected in the carousel. Renders a **permanent** wireframe-glyph fallback for any item without a real `image` — this is intentional, design-approved placeholder behavior, not a temporary stand-in to delete once photos exist; new items without a photo should keep falling back to it too. Explicit theme-independent hex colors (not `--color-*` tokens) so the "screen" looks the same in both site themes. |
| `components/CustomerLogoGrid.astro` | Homepage "Our Customers" logo wall. Deliberately separate from `BrandLogoChip` (different purpose: customer attribution wall vs. inline supplier badge). Renders an `<img>` with `object-fit: contain` + grayscale-by-default/color-on-hover when `logoSrc` is set, otherwise a dashed-border placeholder card (icon + "LOGO" caption) — see `data/customers.ts`. |
| `components/product/BrandLogoChip.astro` | Small chip (`src`, `alt`, `size: 'nav'\|'hero'`, `variant: 'light'\|'dark'`) used for the 4 Test Equipment brand logos in both the nav flyout and each brand's own page hero. Backgrounds are explicit hex/rgba, **not** theme tokens — deliberately invariant across light/dark so a brand's logo always sits on the same backing regardless of site theme. Use `variant="dark"` for light/white-colored logo art (currently just DOEWE) or it disappears against the default light chip. |
| `components/product/BrandProductGrid.astro` | Grid of product cards for a brand's own page (`BrandProduct[]`: `{ name, description }`). All 4 brand pages currently pass a single "Coming soon" placeholder entry each — adding real products later is just pushing more entries into that page's array. |
| `components/product/HowItWorksFlow.astro` | Icon → label → description step flow with connecting arrows, used on product/category detail pages. Steps carry their own `iconSvg` (raw inline SVG string via `set:html`) rather than an icon-name enum. |
| `components/product/FaqAccordion.astro` | Single-open FAQ accordion (`FaqEntry[]`: `{ question, answer }`). Uses `is:global` CSS + distinct class names from any page's own inline FAQ markup, since the toggle script needs to reach across the component boundary. |
| `components/product/ComparisonTable.astro` | "Baseline vs. Cavotec" feature comparison table (`ComparisonRow[]`). Horizontal-scrolls on narrow viewports instead of a stacked-card transform. |

`src/pages/product/iot/smart-key-management-system.astro` is the **reference template** several of the above components were extracted from — its own inline copies of these patterns were deliberately left untouched when the shared components were built, so it won't exactly match a freshly-built page using the shared versions.

### Theme system

- Dark is the default/base palette (`:root`); `:root[data-theme='light']` overrides the same custom properties. Every page/component must consume the generic tokens (`--color-bg`, `--color-bg-alt`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-teal`, `--color-amber`, `--color-teal-dark`, `--color-amber-dark`, `--color-on-accent`) — never a raw hex or `--color-indigo`/`--color-surface`/`--color-ink` directly in page-level code, or it won't re-theme.
- `--color-shadow-rgb` and `--color-on-accent` are deliberately **not** overridden per theme (shadows stay dark-tinted, accent-fill text stays dark, in both themes).
- Theme resolution precedence: explicit `localStorage['theme-preference']` > OS `prefers-color-scheme` > dark fallback. Set via an inline, render-blocking `<head>` script (`applyStoredTheme`) to avoid any flash of the wrong theme.
- Because `[data-theme]` lives only in JS-set DOM state (never server-rendered), it has to be explicitly reapplied on: `astro:after-swap` (every ClientRouter transition — the router syncs the persisted `<html>` tag's attributes to the freshly-fetched document, which wipes this attribute back off) and `pageshow` with `event.persisted === true` (bfcache restores, where no real navigation/swap event fires at all). If you ever see intermittent dark→light flips on navigation, check both of these handlers are still wired in `Layout.astro` before assuming it's a new bug.
- Toggle button + `sessionStorage`-based "upgrade notice" reminder bar are separate mechanisms — don't conflate `theme-preference` (localStorage, permanent) with `upgrade-notice-dismissed` (sessionStorage, per-tab-session).

### Global design-system CSS conventions (defined once in `Layout.astro`, reused everywhere)

- **`.tech-card` + `[data-shine]`** — the site-wide card hover treatment: teal glow, animated corner brackets, and a cursor-tracked radial "shine" (driven by JS setting `--shine-x`/`--shine-y`/`--shine-opacity`, animated purely via a registered `@property` CSS transition — no rAF loop). Apply both classes together on any new card-like element that should match existing product/service/brand cards.
- **`[data-reveal]` + `--reveal-i`** — scroll-reveal-on-entry. Defaults to fully visible in CSS (`opacity: 1`) so content never disappears if JS doesn't run or `prefers-reduced-motion` is set; only becomes an animated fade-up once `.reveal-enabled` is added to `<html>` by the page-load script. `--reveal-i` staggers siblings (`transition-delay: calc(var(--reveal-i, 0) * 70ms)`) — set it to the item's index when mapping over an array.
- **`.tick-divider`** — the ruled/measurement-scale section separator used between almost every homepage/page section.
- **`.placeholder-tag`** — small amber "Coming soon" pill, the established visual marker for not-yet-real content (distinct from the "generic empty-state card" pattern used for customer logos / brand product images).
- **`[data-parallax-bg]`** — subtle scroll-linked depth effect for hero/page-header/closing-CTA background grid textures; auto-disabled under `prefers-reduced-motion`, coarse pointers, and narrow viewports.
- All of the above interactive/animated behaviors are wired inside `initPageContentEffects()` in `Layout.astro`'s bottom `<script>`, re-run on every `astro:page-load` (fires on first load AND every subsequent transition) with its own `AbortController` torn down on `astro:before-swap` — **this is the required pattern for any new page-scoped effect**: DOMContentLoaded-style "run once" setup silently only ever applies to whichever page happened to load first.

### Astro-specific gotchas learned on this project

1. **Style scoping is per-file.** A component's scoped `<style>` only matches elements that component itself renders (matched via an injected `data-astro-cid-*` attribute) — targeting another component's markup from outside requires `is:global`, or passing a variant/size via props instead (e.g. `BrandLogoChip`'s `size`/`variant` props, not cross-file CSS overrides).
2. **CRLF + BOM files** (some page/layout files were originally saved this way) can defeat exact-string-match editing tools. If a straightforward edit unexpectedly fails to match, check the file's line endings/BOM before assuming the search string is wrong.
3. **Vite CSS module cache can go stale after a full-file overwrite** — see the Development section above for the symptom and fix (`astro dev stop` / `astro dev --background`).
4. **`justify-content: space-between` rows break if you add a third flex child.** `NavFlyout.astro`'s `.flyout-label-group` wrapper (chip + label as one child) exists specifically so a logo-bearing leaf row (no chevron) still presents exactly two children to its parent's `space-between`, instead of the chip and label springing to opposite ends.

### Known placeholder / pending-content inventory

Grep for `PLACEHOLDER` to find all of these in situ; the highlights worth knowing up front:

- **`data/customers.ts`** — 6 generic placeholder entries, no real customer names or logos. Needs real logo art AND each customer's confirmed permission to display their logo before going live.
- **FREEDOM/ASTRONICS brand** (`/product/test-equipment-measurement/freedom-astronics/`) — the provided logo art only shows "ASTRONICS" branding, not "FREEDOM". Flagged, unresolved: may actually be two separate brands merged into one nav entry. Don't silently split or rename this without confirming with the client.
- **YouTube link** — both `Layout.astro`'s footer `socialLinks` and `/news-events.astro`'s YouTube embed section use a placeholder (`#`/placeholder embed) pending the real channel URL. If it's ever provided, **update both places together**, not just one.
- **`/case-studies`** — orphaned, unlinked page with illustrative (explicitly-labeled non-real) example case studies; kept on disk pending a decision on whether to delete or repurpose it.
- All 4 brand pages (`lindos`, `freedom-astronics`, `redwood`, `doewe`) and the ATE System page use generic, plausible placeholder copy pending real product/positioning details from Cavotec Malaysia — each says so in its own frontmatter comment.
- Every `ShowcaseItem`/`HoloPreviewPanel` entry currently has no real photo (`image` omitted) — the wireframe-glyph fallback is what every homepage card shows today; this is by design, not a bug, until real photos exist.

### Verification conventions used in this project

- Prefer real interaction simulation (actual `.click()`, real keyboard events) over static visual inspection when confirming a fix.
- Mobile-overflow check: inject a same-origin `<iframe>` at 375px width, compare `document.documentElement.scrollWidth` vs `clientWidth` post-load, then remove the iframe.
- Theme changes: force a starting state via `localStorage.setItem('theme-preference', ...)` + reload, rather than relying on whatever the OS/browser currently has cached.
- After any change that could affect page styling, sanity-check `document.styleSheets` for the expected class names before trusting a screenshot — a stale Vite CSS module (see gotcha #3 above) can look identical to "the markup is wrong" until you check this.
