---
name: NITÉ
description: Five one-of-one handmade crochet bags from Belgrade, listed the way a maison lists its bags.
colors:
  paper: "#ffffff"
  tile: "#f4f3f1"
  ink: "#141414"
  grey: "#6b6b6b"
  line: "#e6e4e0"
  night: "#111111"
  night-muted: "rgba(255, 255, 255, 0.72)"
typography:
  wordmark:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "1.625rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.16em"
  display:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(3rem, 5.2vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.08em"
  headline:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(2rem, 4.4vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(2rem, 3.4vw, 2.75rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  product-name:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(2rem, 2.8vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1.05
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.7
  body-small:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.09em"
  button:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.12em"
rounded:
  none: "0"
spacing:
  grid-column-gap: "8px"
  gutter-mobile: "16px"
  gutter: "32px"
  grid-row-gap: "32px"
  bar-h-mobile: "56px"
  bar-h: "60px"
  section-mobile: "64px"
  section: "96px"
components:
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 40px"
    height: "52px"
    width: "100%"
  button-dark-hover:
    backgroundColor: "#3a3a3a"
  button-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 40px"
    height: "52px"
  button-light-hover:
    backgroundColor: "#e7e5e1"
  product-tile:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  header-bar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    height: "{spacing.bar-h}"
  order-band:
    backgroundColor: "{colors.night}"
    textColor: "{colors.paper}"
    padding: "88px 32px"
---

# Design System: NITÉ

## Overview

**Creative North Star: "The Maison Line Sheet"**

NITÉ is presented the way a leather-goods house lists its bags: a white page, square pale tiles, a tiny tracked-uppercase voice for every fact, and a few quiet Bodoni words. The pieces are the only colour on the page. Nothing frames them, labels them as special or pushes them; a bag's name, its piece number, its type and its price sit under the photograph in the same small capitals a Polène or Fendi listing uses, and the whole system gets out of the way so the stitch reads.

Density is catalogue density: narrow gutters, an 8px gap between tiles, hairline rules instead of boxes, and generous vertical pauses (96px) only where the page switches from listing to editorial. The world is flat and square: no radii, no shadows, no gradients, no accent colour. Hierarchy comes from scale contrast between light Bodoni and 11px Inter capitals, and from one black surface (the order band and the order bar) that marks where buying happens.

Motion is slow and soft (a long ease-out), and always optional: tiles crossfade to a second view of the same bag, the product panel rises 14px into place, sections fade in. The confirmed anti-reference is craft-fair rustic: no kraft paper, twine, stitched borders, or handwritten type. Handmade is carried by the photography, never by decoration.

**Key Characteristics:**
- White paper, pale warm-grey tiles, near-black ink, one grey for meta; no accent colour.
- Bodoni Moda for the wordmark, titles and product names at weight 400; Inter for everything else.
- One label voice: 11px Inter, 500, tracked 0.09em, uppercase.
- Square everything, 1px hairlines, no shadows.
- Flat full-width button bars: black on white, white on black.
- A Bodoni NITÉ wordmark heads the footer, beside the link columns, and closes every page.

## Colors

A monochrome maison palette: the bags supply every hue, the system supplies none.

### Neutral
- **Gallery White** (paper): the page ground, header, product panel, lightbox, and the text colour on black surfaces.
- **Linen Tile** (tile): the backdrop behind every product image (grid tiles, rail thumbnails, gallery slots, hand-photo crops), so images load onto a considered surface rather than blank white.
- **Press Ink** (ink): all primary text, the dark order button, the focus ring, selection background.
- **Catalogue Grey** (grey): meta and secondary copy only: subtitles, piece-number lines, descriptions, spec labels, footer links, toolbar. Holds 5.3:1 on paper and 4.8:1 on tile; do not lighten it.
- **Hairline** (line): every 1px divider: header and bar bottoms, toolbar top, section tops, accordion rules, footer base.
- **Showroom Black** (night): the single dark surface, the order band.
- **Night Veil** (night-muted): secondary text on Showroom Black; the one place grey text is expressed as translucency.

### Named Rules
**The Pieces Are The Colour Rule.** No accent, brand tint, or per-bag colour band appears in the interface. If a surface needs emphasis, it gets ink or night, never a hue.

**The One Grey Rule.** Secondary text uses Catalogue Grey on light surfaces and Night Veil on black; no other text greys exist.

## Typography

**Display Font:** Bodoni Moda (with Georgia, serif), self-hosted
**Body Font:** Inter (with system-ui, sans-serif), self-hosted

**Character:** A high-contrast Didone set light and large against small, wide-tracked grotesque capitals: the fashion-house pairing, where the serif speaks rarely and the sans does all the listing.

### Hierarchy
- **Wordmark** (Bodoni 500, 1.625rem desktop / 1.375rem mobile, tracked 0.16em): the centred NITÉ in the header. Tracking compensates with left padding of 0.16em so it sits optically centred.
- **Display** (Bodoni 500, clamp(3rem, 5.2vw, 4.5rem), line-height 1, tracked 0.08em): the footer NITÉ only, at the top left of the footer with a one-line Body Small tagline beneath it.
- **Headline** (Bodoni 400, clamp(2rem, 4.4vw, 3.75rem), 1.02): editorial section titles (manifesto); the made-by-hand title (clamp(1.75rem, 3vw, 2.5rem)) and order title (clamp(2rem, 4vw, 3rem)) are the same voice a step smaller.
- **Title** (Bodoni 400, clamp(2rem, 3.4vw, 2.75rem), 1.05): the left-aligned catalogue title.
- **Product Name** (Bodoni 400, clamp(2rem, 2.8vw, 2.5rem), 1.05): the bag name heading the product panel. Rail thumbnail names use Bodoni at 0.875rem in grey.
- **Body** (Inter 400, 0.9375rem, 1.7): descriptions and editorial copy, capped at 34 to 40em; the manifesto paragraph steps up to 1.0625rem.
- **Body Small** (Inter 400, 0.8125rem, 1.5 to 1.6): catalogue subtitle, spec rows, hints, footer links and notes.
- **Label** (Inter 500, 0.6875rem, 0.09em, uppercase): nav links, toolbar, tile name/meta/price, breadcrumb, product meta, accordion summaries, "next piece" link, step labels, footer column titles. Tile meta, tile price and product meta drop to weight 400.
- **Button** (Inter 500, 0.75rem, 0.12em, uppercase): the label voice one step up, for full-width bars only.

### Named Rules
**The Single Label Voice Rule.** Every small fact on the page speaks in the same tracked capitals (0.6875rem, 0.09em). Add new labels to that shared voice; never invent a second small-caps size.

**The Light Didone Rule.** Bodoni titles are weight 400. Weight 500 is reserved for the NITÉ wordmark in the header and footer.

## Layout

A full-bleed catalogue with a fixed side gutter (32px desktop, 16px below 900px) and a sticky 1px-ruled header bar (60px / 56px) laid out as three columns: links left, NITÉ centred, order link and Instagram mark right. Below 900px the links collapse into a two-line burger menu that drops a ruled list under the bar.

The catalogue grid is 4 columns from 1024px and 2 columns below, with an 8px column gap and a 32px row gap. With exactly five pieces the first tile becomes a 2×2 feature (full-width lead on narrower screens), so five bags fill two tidy rows. Tiles are 4:5. Above the grid sit the page title, a centred rail of 96px square thumbnails (below 900px a non-scrolling index strip: every piece fits the width in 4:5 crops up to 72px wide, 8px apart), and a hairline toolbar.

Editorial sections (manifesto, made by hand) are two-column (title | copy, 48px gap) opened by a hairline and 96px of vertical space (64px mobile), collapsing to one column below 900px. The made-by-hand steps are three 4:5 detail crops at an 8px gap (3:2, single column on mobile).

The product panel is a full-screen dialog: gallery 3fr stacked with 8px gaps on the left, info 2fr sticky on the right (48px/56px padding, max 560px) from 900px. Below 900px the gallery becomes a full-width swipe strip with a "1 / 5" counter, and the order button pins to a fixed bottom bar with a hairline top and safe-area padding.

Every interactive target is at least 44px tall.

## Elevation & Depth

The system is flat. There are no shadows anywhere. Depth is expressed only by stacking whole surfaces: the sticky header over the page, the full-screen product panel over the catalogue, the lightbox over the panel, each opaque white and separated by a 1px hairline. The black order band is the only tonal shift.

### Named Rules
**The Paper Stack Rule.** Layers are opaque full surfaces divided by hairlines; nothing floats, glows, or casts.

## Shapes

Square everything: tiles, thumbnails, gallery slots, buttons, the menu drop-down and panels all have 0 radius. Borders are 1px Hairline rules, used horizontally to divide rather than to box. The only curves in the interface are native to the Instagram brand mark and the letterforms themselves. Controls are drawn in thin 1px strokes: a two-line burger that crosses into an X, a 1.2px-stroke close X, and a plus/minus built from two 1px bars for accordions.

## Components

### Buttons
Flat, full, unapologetic bars, like a maison's "add to bag".
- **Shape:** square (0), 52px tall, 40px side padding.
- **Dark (primary):** Press Ink bar with Gallery White Button-voice text, full width of its column. Used once per product panel for "Poručite putem Instagrama".
- **Light:** Gallery White bar with ink text, min-width 280px, used on the Showroom Black order band.
- **Hover / Focus:** background-colour shift over 0.3s (dark to #3a3a3a, light to #e7e5e1); focus is a 2px ink ring offset 3px (white on the order band).

### Product Tile
The unit of the catalogue.
- **Media:** 4:5 Linen Tile slot, image cover-fitted, no border, no radius, no overlay, no badge.
- **Info:** 12px below the image: name (label voice), "Komad Nº 0X · type" (label voice, 400, grey), price (label voice, 400, 5px extra top margin).
- **Hover:** if the bag has a second distinct view it crossfades in (opacity 0.6s); otherwise the image scales to 1.035 over 1.2s. Hover effects only apply on hover-capable pointers.

### Model Rail
A row of square Linen Tile thumbnails with the bag name in small grey Bodoni beneath; on hover the image scales 1.06 over 0.8s and the name turns ink. On phones it becomes an index strip that never scrolls or half-cuts a piece: 4:5 portrait crops (the grid's ratio) shrinking evenly from 72px, names at 0.8125rem, and a press state that dims the image and inks the name.

### Navigation
Label-voice links in ink with a 1px underline that draws in from the left on hover (0.35s). The mobile menu is a ruled list under the bar; per-bag links appear there in grey. The product panel has its own sticky bar: a breadcrumb in grey ("Torbe / Name", the current name in ink) and a thin X close.

### Accordions
Hairline-ruled `details` rows, 52px summaries in the label voice with a 9px plus that becomes a minus when open. Inside, spec rows are Body Small with grey term left and ink value right-aligned.

### Product Panel (signature)
The full-screen, hash-deep-linked product dialog: fades and rises 14px over 0.42s. Contents in order: Bodoni name, grey label meta, price (1rem), grey description, the dark order bar with a "U poruci navedite: Name" hint beneath it (tapping the bar copies "Zdravo, zanima me Name (Komad Nº 0X)." to the clipboard, the hint confirms it, and Instagram opens; on mobile bar and hint are pinned together at the bottom), a line on what happens after the message, accordions, then an underlined label-voice "Sledeći komad" link.

### Order Band
The page's one black surface: centred Bodoni headline, Night Veil copy, the light button, and the Instagram handle in Night Veil turning white on hover.

### Footer Mark
A two-part top row: the Bodoni NITÉ wordmark with a grey tagline on the left (one third), and four link columns (Kolekcija, Studio, Pratite nas, Nega) of label-voice titles and grey Body Small links on the right. Below 1100px the wordmark stacks above the columns; below 900px the columns go to two. A hairline base row carries the copyright line left and a "Na vrh" link right, both in the 0.6875rem grey.

## Do's and Don'ts

### Do:
- **Do** let the bags carry all colour: interface surfaces are only paper, tile, ink, grey, line and night.
- **Do** put every product image on a Linen Tile (#f4f3f1) slot at a fixed aspect ratio (4:5 in the grid and the mobile rail, 1:1 in the desktop rail).
- **Do** set every small fact in the shared label voice (0.6875rem, 500, 0.09em, uppercase).
- **Do** keep Bodoni titles at weight 400; reserve 500 for the NITÉ wordmark.
- **Do** divide with 1px Hairline rules and space, never with boxes or cards.
- **Do** use the flat full-width button bar for the ordering action, dark on white and light on black.
- **Do** use the long ease-out (cubic-bezier(0.16, 1, 0.3, 1)) and keep fades when reduced motion is requested, dropping travel and scale.
- **Do** keep hit targets at 44px minimum and the grey at or above 4.8:1 on its surface.

### Don't:
- **Don't** round corners or add shadows to any surface, image or control.
- **Don't** introduce an accent colour, brass, or per-bag colour bands.
- **Don't** add badges, ribbons, "UNIKAT" tags, countdowns or scarcity labels to tiles or the product panel.
- **Don't** use craft-fair rustic cues: kraft paper, twine, stitched borders, or handwritten fonts.
- **Don't** add a second small-caps size or tracking value for labels.
- **Don't** replace Bodoni Moda or Inter with system faces for display or labels.
