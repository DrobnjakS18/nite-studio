# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

NITÉ is a single-page static site (Serbian, `lang="sr"`) selling the last remaining handmade crochet bags from a Belgrade workshop that has permanently stopped production. This is a final stock clearance, not an ongoing made-to-order shop: each of the 5 listed bags is a single unique physical piece — once it sells, it's gone for good, there's no reorder or restock. Ordering happens entirely off-site via Instagram DM (no cart, no online payment); pickup is in Belgrade, shipping elsewhere in Serbia is arranged by message. When everything sells, the catalogue disappears and the site keeps just the page title (with a sold-out line) + manifesto + "made by hand" + ordering + footer (see "Marking a bag as sold" below). No build step, no package manager, no framework — plain HTML/CSS/JS served as-is (e.g. from `https://nitestudio.rs/`).

## Running / previewing

There is no build or dev server tooling in this repo. Open `index.html` directly in a browser, or serve the directory with any static file server, e.g.:

```
npx serve .
```

When editing `css/style.css` or `js/*.js`, bump the `?v=` query-string version on the corresponding `<link>`/`<script>` tag in `index.html` (see below) to bust caches, matching the existing pattern.

## Architecture

The whole site is one page (`index.html`) whose product/bag content is rendered client-side from a single data source:

- **`js/bags-data.js`** — defines the `BAGS` array (global, no module system). Each entry is one product ("bag") with `id` (its URL hash, e.g. `#cacao` opens Olea), `num`, `name`, `altNoun` (used in alt text as `"{name} {altNoun}"` and in the tile meta line), `variant` (legacy, currently unused by the page), `imgW`/`imgH` (the real pixel size of that bag's original photos — used for `width`/`height` and as the largest `srcset` candidate), `images`, `desc`, `price`, optional `dims` (rows of `[abbr, label, value]`, where `value` may itself be a list of `[subLabel, subValue]`), and `specs` (rows of `[label, value]`). This is the single source of truth for products — **to add/edit/remove a bag, edit this array**, not the HTML.
- **`js/script.js`** — an IIFE that reads `BAGS` and renders everything derived from it:
  - `renderCatalogue()`: the model rail (`#rail`), the piece count, the product grid (`#grid`; with exactly 5 bags the first gets a 2×2 feature tile on desktop, otherwise all tiles are equal; a tile crossfades to the bag's second distinct photo on hover), the bag links in the mobile menu (`#navBags`) and the footer's Kolekcija column. Every tile/rail/nav/footer item is a plain `<a href="#{bag.id}">`.
  - the product panel (`#product`): a full-screen modal dialog driven by the URL hash (`syncFromHash()` on load and `hashchange`), so links, the Back button and shared links like `/#rubis` all work. It shows the de-duplicated gallery (stacked on desktop, a swipe strip with a counter on mobile), name, piece number, price, description, the black "Poručite putem Instagrama" bar (`https://ig.me/m/nite.studio_`; `wireOrder()` copies "Zdravo, zanima me {name} (Komad Nº {num})." to the clipboard on tap, since ig.me cannot prefill a DM) with the "U poruci navedite: {name}" hint under it, a what-happens-next note, Detalji/Dimenzije accordions (`<details>`), and a "Sledeći komad" link (it uses `location.replace`, so paging through pieces adds no history entries). While open, the skip link/header/main/footer are `inert`, Tab is trapped, Escape closes, and focus returns to the opener (or that bag's grid tile if the opener is hidden). Closing a panel opened from the page calls `history.back()`; closing a deep-linked one drops the hash with `history.replaceState`. Any hash change also closes an open lightbox, so Back never leaves a zoomed photo behind. A hash listed in `SOLD_IDS` shows a notice under the catalogue title instead (`showSoldNotice()`).
  - the lightbox (zooms one gallery photo above the panel; Escape closes only the topmost layer), the mobile burger menu (keeps `aria-expanded` in sync), and scroll-reveal (`[data-reveal]`, IntersectionObserver plus a scroll/resize `sweep()` fallback). Reveal only hides content under `html.js`, a class set by an inline script in `<head>`, so a JS failure leaves the page visible.
- **`index.html`** — static shell: sticky header (nav left, centred NITÉ wordmark, Porudžbina + Instagram right), `#collection` catalogue (Bodoni "Torbe" title, empty `#rail`, toolbar, empty `#grid`), `#manifesto`, `#made`, the black `#connect` ordering band, footer (NITÉ wordmark and tagline beside four link columns, then a copyright/"Na vrh" base row), the empty `#product` panel and `#lightbox`, plus structured data (`application/ld+json` for Organization + Products — **must be kept in sync with `BAGS` manually**, it is not generated).
- **`css/style.css`** — single stylesheet, organized by section via comment headers (HEADER, CATALOGUE, STORY, MADE BY HAND, ORDER BAND, BUTTONS, FOOTER, PRODUCT PANEL, LIGHTBOX, SCROLL REVEAL, REDUCED MOTION). Tokens are CSS custom properties at the top: `--paper`, `--tile` (light grey behind photos), `--ink`, `--grey` (secondary text, passes AA on paper and tile), `--line` (hairlines), `--night` (ordering band), `--gutter`, `--bar-h`, `--ease-out`. Small labels share one tracked-uppercase rule (the `.caps` selector group). Font sizes are in rem so they follow the browser text-size setting; keep new ones in rem.
- **`css/fonts.css`** — `@font-face` declarations for the self-hosted fonts in `css/fonts/` (Bodoni Moda for display, Inter for UI text).

### Marking a bag as sold

Since each bag is a unique one-off, "sold" is handled by deletion, not a status flag: **delete that bag's object from the `BAGS` array in `js/bags-data.js`**. `script.js` derives everything (rail, grid, product panel, menu and footer links) from that array, so removing the entry is enough — no HTML edits needed. If `BAGS` becomes empty, `renderCatalogue()` removes the rail, toolbar and grid, the "Kolekcija" nav link and the footer's Kolekcija column, and replaces the line under "Torbe" with "Trenutno nema dostupnih torbi." plus a link to `#connect`, and swaps the ordering band's copy for a sold-out version, leaving title + manifesto + "made by hand" + ordering band + footer. Then add its `id` to `SOLD_IDS` at the top of `bags-data.js`, so old Instagram posts and shared links to `#{id}` show a quiet "Ovaj komad je pronašao vlasnika" notice under the title instead of silently landing on the page. After deleting a sold bag, also remove its now-stale entry from the `Product` list in the JSON-LD in `index.html`'s `<head>` (see "Content notes" below) and, if it was Olea (`assets/cacao.jpg`), point the `og:image`/`twitter:image` meta tags at a bag that is still for sale; then delete its unused image(s) under `assets/` (including the `-480`/`-960` WebP variants) if nothing else references them.

### Product images

Every photo listed in a bag's `images` needs two resized WebP siblings next to it, named `{basename}-480.webp` and `{basename}-960.webp` (e.g. `assets/foret.jpg` → `assets/foret-480.webp`, `assets/foret-960.webp`). `srcsetFor()` in `script.js` builds `srcset` from that naming convention, with the original as the largest candidate, so a new photo without its variants will produce broken `srcset` entries. Set `imgW`/`imgH` to the originals' real size.

### Content notes

- All user-facing copy is in Serbian.
- Product structured data (JSON-LD in `index.html` `<head>`) duplicates names/descriptions/images from `bags-data.js` — update both when changing product details, since one isn't generated from the other.
