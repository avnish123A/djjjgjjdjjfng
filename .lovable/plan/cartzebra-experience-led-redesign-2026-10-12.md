# CartZebra experience-led redesign

## Direction

**Concept: “The Discovery Stripe.”** CartZebra becomes a confident editorial marketplace built around the pleasure of finding the right thing. The visual signature is a bold, flexible stripe that guides the eye through discovery, selection and delivery—not a generic cart icon.

- **Logo:** create two genuinely distinct premium logo concepts, then take the stronger one through a review gate before replacement. The recommended direction combines a custom-drawn **CZ** symbol with three zebra cuts that also form a forward path; it must remain recognizable at 24px and in one color. Pair it with a custom CartZebra wordmark whose distinctive `Z` echoes the symbol.
- **Palette:** retain Midnight Navy for structure and Warm Cloud for breathing room; refine Indigo toward a more ownable blue-violet action color, use Coral only for moments of delight, and keep Lavender as a quiet discovery surface. Remove residual gold and decorative color noise after contrast checks.
- **Typography:** Plus Jakarta Sans remains the clear interface face. Use Fraunces italic only as a sparse editorial accent, never for controls or dense information. Hierarchy comes from scale, weight and space rather than all-caps tracking.
- **Reference qualities:** premium D2C clarity, magazine-like pacing, marketplace utility, tactile product staging and playful directional graphics—without copying another retailer’s layout.

## Stage 1 — Brand and asset prototype

- Generate two original logo routes as isolated high-quality concepts; refine the selected route into clean source-controlled SVG assets: full logo, standalone symbol, light/dark, monochrome, favicon and app icon.
- Replace the current inline geometric cart/Z and static black/gold assets through `src/components/brand/Logo.tsx`, `public/logo-cartzebra*.svg`, `public/favicon.svg` and `public/manifest.webmanifest`.
- Build a cohesive generated asset kit with one art direction: bright studio lighting, navy/lavender sets, coral directional details, generous negative space and consistent crop rules.
  - Hero: one wide editorial discovery scene with real catalog products shown only from existing product assets, plus generated non-product set dressing.
  - Categories: a coordinated six-image family, not unrelated stock-photo tiles.
  - Campaigns: two companion compositions that remain admin-backed through `promo_banners`.
  - Empty states: cart and search/filter scenes using the CartZebra stripe/symbol.
  - Purchase journey: checkout parcel, order-success reveal and tracking route artwork from one illustration family.
- Do not generate substitute product photography, ratings, people using products, packaging claims or features absent from the catalog.

**Gate 1:** review logo concepts, symbol legibility at 24/32/64px, light/dark contrast, favicon recognition, and a contact sheet of the asset family before changing the whole storefront.

## Stage 2 — Homepage as a discovery story

Replace the current hero + category grid + three repeated product grids sequence in `src/pages/Index.tsx` and `src/components/home/*` with:

1. **Discovery hero** — full-bleed editorial scene, literal CartZebra headline/value proposition, one primary shopping action and one contextual discovery action.
2. **Discovery paths** — a coordinated visual rail for the active database categories, designed to still feel intentional with six or fewer categories.
3. **Curator’s shelf** — one compact, asymmetrical product selection using real featured products; no second near-identical grid.
4. **Campaign diptych** — two admin-managed campaign stories using `promo_banners`, with restrained overlaid copy and consistent art direction.
5. **Current value** — show compare-price offers only when genuine qualifying products exist; otherwise omit the section.
6. **Useful close** — factual shopping help and policy links only after owner-approved content is available.

Remove unsupported marquee, trust and FAQ claims rather than rewriting them as new promises. Keep sparse states deliberate with fewer, larger product moments and no duplicated fallback sections pretending to be “bestsellers.”

**Gate 2:** approve desktop and mobile homepage rhythm with the real current catalog; verify no section appears solely to fill space and no claim lacks a database/policy source.

## Stage 3 — Shared interaction and motion language

Create a small shared motion vocabulary and reuse it rather than adding ad hoc fades:

- **Hero:** masked image reveal, stripe/path draw and staged copy/action entrance, 250–500ms, once per visit.
- **Scroll sections:** short reveal groups with 40–70ms staggering, capped so large grids do not delay.
- **Category imagery:** crop shift plus directional stripe travel; keyboard focus gets the same information without motion.
- **Product cards:** image crossfade only when a real second image exists, quick-add affordance reveal, and a brief symbol-to-cart confirmation—not a flying product clone.
- **Cart and checkout navigation:** shared-layout handoff for item/summary surfaces only; never delay submission or route changes.
- **Order success:** a one-time parcel/stripe completion sequence tied only to visual celebration, never to payment or email state.
- Use only opacity and transforms for decorative sequences, avoid continuous background motion, reserve looping motion for explicit loading, and disable nonessential animation with `MotionConfig`/`useReducedMotion`.

Target shared motion helpers plus `HeroCarousel` replacement, `CategoryGrid`, `ProductCard`, `Cart`, `Checkout`, `OrderSuccess` and `TrackOrder` presentation layers.

## Stage 4 — Page-by-page UX pass

- **Header/search/mobile navigation:** stronger logo presence, simplified navigation for the small catalog, a proper search panel with query visibility, results/empty feedback, cart count clarity and no duplicate search destinations.
- **Listing/category:** search must filter the actual query; remove unsupported rating sort; move mobile filters into a focused sheet; add coordinated empty artwork and preserve URL-based category state.
- **Product detail:** improve gallery hierarchy, variant/quantity clarity, stock truth and primary-action grouping; retain current validated quantity/Buy Now behavior and remove unsupported service/return assertions.
- **Cart:** introduce the custom empty state, clearer editable line items and a calm summary; retain coupon, shipping and totals calculations unchanged.
- **Checkout:** visual refinement only—preserve the progressive sections, single Payment CTA, validators, submit handler, gateway calls, calculations and mobile-nav safety exactly as functional boundaries.
- **Order Success:** use the selected illustration system and truthful next actions; do not infer paid, emailed or shipped states.
- **Tracking:** replace the CSS-like route sketch with matching generated artwork while preserving authenticated lookup, real statuses, ETA rules and refresh behavior.
- **Footer/content states:** simplify to factual links and validated settings; policy pages show owner-approved CMS content or a clear unpublished state, never fabricated terms.

**Gate 3:** review each page family independently before proceeding: browse (header/home/listing/PDP), purchase (cart/checkout), post-purchase (success/tracking), then informational pages.

## Stage 5 — Integration and verification

- Keep React 18, Vite, Tailwind, Framer Motion and the existing backend integration. Keep categories, products and homepage campaigns database-driven.
- Do not alter schema, RLS, authentication, stock validation, order creation, totals, coupons, payment gateway code, signatures, webhooks, idempotency, email triggers or server-side email delivery.
- Replace visuals in small reviewable batches; retain rollback-friendly old assets until every reference is migrated.
- Run typecheck, production build, tests and relevant lint after every gate; resolve the three currently reported lint issues before the final quality gate.
- Runtime-check public routes with console/network capture and verify search, filters, variants, quantity, quick add, cart edits and checkout navigation without making a real payment.
- Visual-check 320, 360, 390, 412, 768, 1024, 1280 and 1440px: no overflow, clipped logo/type, bottom-nav overlap, unstable image crops or duplicate checkout CTA.
- Check keyboard navigation, visible focus, contrast, image alt text, reduced-motion mode, slow-image loading, empty/sparse catalog states and broken-image fallbacks.

## Acceptance criteria

- New CartZebra logo is original, vector-based, legible at 24px, recognizable as a favicon, and works on light/dark surfaces without gold.
- Homepage has one coherent discovery narrative and no repeated filler grids, false urgency, unsupported claims or fabricated social proof.
- All custom visual assets share lighting, grading, composition and crop rules; no emoji, placeholder collage or fake product photography appears.
- Motion feels consistent and purposeful, does not block actions, and becomes static under reduced-motion preference.
- Search visibly filters products; sparse and empty states look intentional; mobile controls remain reachable without overlap.
- Checkout/payment/order/email/security behavior and backend boundaries are unchanged.
- Build, typecheck, tests and relevant lint pass; runtime console is clean on verified routes. Any check blocked by Coming Soon or unavailable authenticated data is reported explicitly, not claimed as passed.
