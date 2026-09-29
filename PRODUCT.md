# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People in or near Belgrade buying a handmade crochet bag for themselves. They mostly arrive from Instagram, on a phone, and decide from photos and details before sending a DM.

## Product Purpose

NITÉ (nitestudio.rs) is a single-page site presenting a small, finite set of handmade crochet bags from a Belgrade workshop and sending buyers to Instagram to order. Success means a visitor finds a piece they want, understands what it is (material, stitch, size, price), and sends a DM to buy it.

Internally, this is a final stock clearance: production has ended, and each listed bag is a single physical piece with no restock. That fact shapes how the site works (sold pieces are removed; see Capabilities) but is **not** told to visitors (see Brand Commitments).

## Positioning

Every bag is crocheted entirely by hand, stitch by stitch, and exists in exactly one copy. The texture (dense, irregular bobble stitch; twisted two-tone yarn; hand-set pearls) is the record of how the bag was made, which a machine-made bag cannot copy.

## Operating Context

- Visitors reach the site from the Instagram account `@nite.studio_` (https://www.instagram.com/nite.studio_/), usually on mobile.
- Ordering happens only by Instagram DM. There is no cart, account, or online payment.
- Pickup in person in Belgrade; shipping elsewhere in Serbia is arranged by message.
- All user-facing copy is in Serbian (Latin script).

## Capabilities and Constraints

- Plain static HTML/CSS/JS, no build step or framework; served as-is from `https://nitestudio.rs/`.
- Products come from the `BAGS` array in `js/bags-data.js` and are rendered client-side: a catalogue grid with a model rail, a full-screen product panel per bag (opened by the bag's URL hash), menu and footer links.
- Each bag has a number ("Komad Nº"), name, description, price in RSD, dimensions (currently only Olea and Marée have them; the others show "Mere na upit" until measured), and a spec list (material, stitch, silhouette, handle, details).
- A sold bag is deleted from `BAGS`, not marked as sold. When none are left, the catalogue disappears and the site keeps the page title with a sold-out line, manifesto, "made by hand", the ordering band and footer.
- Product JSON-LD in `index.html` is maintained by hand alongside `BAGS`.
- Terminology: a bag is a "komad" (piece); the set is the "kolekcija".

## Brand Commitments

- Name: NITÉ, from the word for thread ("nit"). Bodoni NITÉ wordmark (the earlier brass circle mark was retired in the 2026-09 catalogue redesign).
- Voice: calm, concrete, craft-focused; describes materials and technique, never hype. Examples: "Ručno heklano, konac po konac", "Nema dve iste", "Ništa nije lepljeno."
- Do not tell visitors that the workshop has closed or that production has ended. Present the bags as one-of-a-kind pieces. The earlier hero line "Poslednji unikatni komadi" was removed with the catalogue redesign (2026-09), so the site no longer hints at an ending.

## Evidence on Hand

- Product photography under `assets/`. Olea has a full 5-image gallery (`assets/olea/`); the other bags currently reuse one image repeated. Final photos for every bag and on-body/styled photos are planned but not yet in the repo.
- Real product facts per bag in `js/bags-data.js`.
- Not available; must not be fabricated: customer reviews or testimonials, press, maker's name or personal story, sales figures, or delivery times beyond "arranged by message".

## Product Principles

1. The piece is the product: every decision helps a visitor see one specific bag clearly, including texture, scale and price.
2. Uniqueness is a fact, not a sales tactic: say "one of one" plainly; no countdowns, fake scarcity or urgency.
3. The path to ordering is one step: from any bag, the way to Instagram DM is obvious.
4. Honest craft language: describe materials and technique exactly; don't invent claims.
5. Removing a sold piece must never break the page: the site stays coherent from five bags down to none.
