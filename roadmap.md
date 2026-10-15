# CartZebra reference-led frontend implementation

## Current scope — Checkout phase two
- [ ] Implement checkout-local identity, review items, coupons, early existing payment choices and grouped form
- [ ] Implement desktop bill and keyboard-aware mobile checkout bar
- [ ] Verify Cashfree One Click/COD eligibility; preserve production flow if unavailable
- [ ] Verify tests, preview compilation and responsive checkout; report access/payment blockers without publishing

- [ ] Stage A: finalized SVG identity, public tokens and working responsive search header
- [ ] Stage B: illustrated hero, coordinated categories, real-data discovery shelf
- [ ] Stage C: purchase/browse/tracking/footer presentation; remove unsupported public claims
- [ ] Stage D: responsive, accessibility, runtime and test verification

## Gate 1 — Brand and visual asset prototype
- [x] Present two original CartZebra logo concepts and select Discovery Stripe
- [ ] Refine the selected logo into SVG light/dark/monochrome, standalone symbol and favicon assets
- [x] Produce the first visual asset family for review before storefront-wide replacement
- [ ] Correct inconsistent category frames (clouds/gold) and approve the final cohesive contact sheet

## Gate 2 — Homepage discovery story
- [ ] Replace repeated product grids with a sparse-catalog editorial sequence
- [ ] Remove unsupported marquee, trust and FAQ claims
- [ ] Verify real catalog and database-backed campaign behavior

## Gate 3 — Browse, purchase and post-purchase UX
- [ ] Apply shared motion language and generated empty/purchase states
- [ ] Refine header/search/mobile navigation, listing, PDP and cart
- [ ] Refine checkout presentation only; preserve its single CTA and all transaction logic
- [ ] Refine Order Success and Tracking without inferring private or unavailable states

## Final verification
- [ ] Build, typecheck, tests and relevant lint pass
- [ ] Runtime and responsive QA at 320, 360, 390, 412, 768, 1024, 1280 and 1440px
- [ ] Keyboard, contrast, reduced-motion, slow-image and sparse/empty-state checks

## Owner-content blockers
- [ ] Confirm delivery, returns, shipping and business claims
- [ ] Provide owner-approved Privacy, Terms, Return and Shipping content
