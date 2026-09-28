# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

NITÉ is a single-page static site (Serbian, `lang="sr"`) selling the last remaining handmade crochet bags from a Belgrade workshop that has permanently stopped production. This is a final stock clearance, not an ongoing made-to-order shop: each of the 5 listed bags is a single unique physical piece — once it sells, it's gone for good, there's no reorder or restock. Ordering happens entirely off-site via Instagram DM (no cart, no online payment); pickup is in Belgrade, shipping elsewhere in Serbia is arranged by message. When everything sells, the site is meant to collapse down to just hero + manifesto + "made by hand" + contact (see "Marking a bag as sold" below). No build step, no package manager, no framework — plain HTML/CSS/JS served as-is (e.g. from `https://nitestudio.rs/`).

## Running / previewing

There is no build or dev server tooling in this repo. Open `index.html` directly in a browser, or serve the directory with any static file server, e.g.:

```
npx serve .
```

When editing `css/style.css` or `js/*.js`, bump the `?v=` query-string version on the corresponding `<link>`/`<script>` tag in `index.html` (see below) to bust caches, matching the existing pattern.

## Architecture

The whole site is one page (`index.html`) whose product/bag content is rendered client-side from a single data source:

- **`js/bags-data.js`** — defines the `BAGS` array (global, no module system). Each entry is one product ("bag") with `id` (also the section anchor), `num`, `name`, `altNoun` (used to build image alt text as `"{name} {altNoun}"`), `variant`, `imgW`/`imgH` (intrinsic image size, used for `width`/`height` attributes), `images`, `desc`, `price`, optional `dims` (rows of `[abbr, label, value]`, where `value` may itself be a list of `[subLabel, subValue]`), and `specs` (rows of `[label, value]`). This is the single source of truth for products — **to add/edit/remove a bag, edit this array**, not the HTML.
- **`js/script.js`** — an IIFE that reads `BAGS` and renders everything derived from it:
  - nav links and footer links (appended after existing `#collection` link)
  - the infinite-loop showcase slider (`#sliderTrack`, with cloned first/last slides for the loop illusion — see `pos`/`settleIfNeeded` logic)
  - the thumbnail rail (`.collection-thumbs`)
  - each per-bag detail section — fully built in JS (`<section id="{bag.id}" class="bag-section">` + a single `.bag-inner` column) and appended into the empty `<div id="bagSections">` in `index.html`, not filled into pre-existing markup. `.bag-inner` is a flat, single-column stack in this order: kicker ("Komad Nº"), title, desc, main image (a `.lightbox-trigger`), gallery thumbs (only when the bag has >1 image; clicking one swaps the main image and the lightbox source), price, dims, specs, and the "Poručite …" CTA linking to `#connect`
  - it also wires up the lightbox, mobile burger menu, and scroll-reveal (`[data-reveal]`) animations (IntersectionObserver plus a scroll/resize `sweep()` fallback).
  - the hero sold-out state (`renderHeroState()`) — see "Marking a bag as sold".
- **`index.html`** — static shell: hero, manifesto, empty `<div id="bagSections">` (populated entirely by script), "made by hand" section, connect/contact, footer, and structured data (`application/ld+json` for Organization + Products — **must be kept in sync with `BAGS` manually**, it is not generated).
- **`css/style.css`** — single stylesheet, organized by section via comment headers (PAGE, NAV, HERO, SHOWCASE SLIDER, MANIFESTO, COLLECTION, BAG DETAIL SECTIONS, MADE BY HAND, CONNECT, FOOTER, LIGHTBOX, SCROLL REVEAL). Color/spacing tokens are CSS custom properties defined at the top (`--cream`, `--ink`, `--brass`, per-bag accent colors like `--cacao`, `--foret`, `--rouge`, `--bleu`, `--aubergine`, etc.).
- **`css/fonts.css`** — `@font-face` declarations for the self-hosted fonts in `css/fonts/` (Bodoni Moda for display, Inter for UI text).

### Marking a bag as sold

Since each bag is a unique one-off, "sold" is handled by deletion, not a status flag: **delete that bag's object from the `BAGS` array in `js/bags-data.js`**. `script.js` derives everything (nav, slider, thumbnails, detail section, footer links) from that array, so removing the entry is enough — no HTML edits needed. If `BAGS` becomes empty, `script.js` automatically removes `#collection`, the "Kolekcija" nav link and the footer's collection-links column, and switches the hero (subtitle becomes "Trenutno nema dostupnih torbi.", CTA re-points to `#connect`) into a sold-out state (see `hasBags` / `renderHeroState()`), leaving just hero + manifesto + "made by hand" + contact + footer. After deleting a sold bag, also remove its now-stale entry from the `Product` list in the JSON-LD in `index.html`'s `<head>` (see "Content notes" below) and delete its unused image(s) under `assets/` if nothing else references them.

### Per-bag variant styling

Some bags need distinct visual treatment (light/dark text on their accent color, etc.). This is driven by the `variant` field in `bags-data.js` (currently `'rubis'`, `'nuage'`, or `null`), which `script.js` uses to append modifier classes like `bag-desc--rubis`, `bag-image--nuage`, `spec-row--light`, etc. When adding a bag with a strong background color, follow this same `variant` + `--{variant}` class-suffix convention rather than hardcoding one-off styles.

### Content notes

- All user-facing copy is in Serbian.
- Product structured data (JSON-LD in `index.html` `<head>`) duplicates names/descriptions/images from `bags-data.js` — update both when changing product details, since one isn't generated from the other.
