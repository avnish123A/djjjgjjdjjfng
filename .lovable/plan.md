# CartZebra Storefront and Catalog Refresh

## Goal
Refresh the existing CartZebra shopping experience and starter catalog without changing its brand, authentication, checkout, payments, stock controls, or order security.

## Implementation
1. **Audit and protect existing data**
   - Map catalog foreign keys and inspect categories, products, orders, customers, order items, and payment records.
   - Classify only unmistakable test/demo rows for removal or archiving; preserve every uncertain or historical customer, order, payment, and audit record.
   - Use inactive/archive states instead of destructive deletion where records may be referenced.

2. **Create an admin-managed catalog foundation**
   - Add safe, additive catalog fields where missing: stable slugs, SKU, SEO title/description, featured state, sort order, specifications/features, and archive timestamps.
   - Extend category management with image, slug, SEO, active state, and sort order.
   - Replace destructive catalog actions with archive/deactivate behavior where practical.
   - Keep all product and category content editable in Admin.

3. **Seed a coherent starter catalog**
   - Establish six focused categories: Accessories, Beauty, Electronics, Fashion, Gifts, and Home & Living, adjusted only if existing real products require it.
   - Add original CartZebra product names, descriptions, prices, stock, SKUs, SEO, and licensed/generated imagery.
   - Do not create ratings, reviews, comparison prices, discounts, or urgency unless supported by real data.

4. **Refresh the storefront**
   - Establish one cohesive CartZebra art direction across categories and campaigns: premium D2C ecommerce meets modern marketplace and editorial fashion/lifestyle—not boxed stock photography or template advertising.
   - Produce category and campaign imagery as a coordinated visual set with consistent lighting, color grading, proportions, typography, corner radius, and spacing.
   - Upgrade category cards and two editorial campaign banners with readable overlays, restrained motion, and clear Explore links; category imagery must feel like one authored collection, and banners must feel editorial rather than promotional templates.
   - Remove stale flash-countdown, gourmet, ethnic, EkamTech, and other legacy sample language.
   - Improve product cards with mobile Quick Add, database stock messaging, real compare-price logic, optional second-image hover, and smooth cart feedback.
   - Make search and category URLs reliably filter live catalog data.

5. **Complete product detail behavior**
   - Refine gallery, pricing, stock, quantity, cart, Buy Now, delivery check, details, specifications, shipping/returns, related products, and mobile purchase bar.
   - Add persistent wishlist behavior only if wishlist controls remain visible.
   - Remove unsupported ratings, reviews, guarantees, delivery promises, and fake serviceability results.

6. **Preserve recently improved flows**
   - Keep the one-page Contact → Delivery → Payment checkout and all payment-security logic unchanged.
   - Retain the neutral order-tracking experience and truthful status timeline.
   - Retain progressive Admin loading, local retries, and immediate shell rendering.

7. **Authorized-source decision**
   - Check only for a public/official Propshop24 API, export, affiliate feed, or authorized integration.
   - If none is available, import nothing from Propshop24 and use original CartZebra content while keeping the schema import-ready.

8. **Verification**
   - Run typecheck and inspect the generated build status.
   - Browser-test homepage, search/category filtering, product detail, cart, checkout, tracking, and responsive layouts.
   - Compare the finished homepage against the supplied screenshots at desktop and mobile sizes. Reject and refine any category or banner treatment that reads as unrelated stock imagery, Canva-style advertising, or a generic Shopify template.
   - Visually verify consistent lighting, grading, image ratios, type, radii, and spacing across the entire homepage before acceptance.
   - Test Admin product/category/banner editing when an authorized admin session is available.
   - Search source and live content for prohibited legacy references and report only tests actually completed.

## Technical notes
- Database changes will be additive migrations with explicit grants and existing RLS preserved.
- Existing order/payment foreign keys and historical rows remain intact.
- Images will be generated or licensed project assets; no hotlinks or copied third-party media.
- Motion stays transform/opacity-based, approximately 150–350ms, with reduced-motion support.

## Assumption
The lone ₹1 “sample” product is clearly demo data, but it will only be archived after confirming it is not referenced by historical order items. Any ambiguous row will be preserved.
