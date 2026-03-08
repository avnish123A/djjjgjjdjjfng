

## Plan: Transform EkamWear → EkamTech Electronics Store

This is a major rebrand and data overhaul. The existing DB-driven architecture (categories, products, hero_slides, site_settings) means most changes are data + styling — the component structure stays intact.

---

### Phase 1: Database — Clear Old Data & Insert New

**Delete old data** (via insert tool):
- Delete all `product_attribute_values`, `product_attributes`, `order_items`, `products`, `categories`, `hero_slides`
- Update `site_settings` keys for new brand

**Insert 6 new categories**:
| Category | Image (Unsplash) |
|----------|-----------------|
| Smartphones | phone image |
| Laptops | laptop image |
| Tablets | tablet image |
| Mobile Accessories | accessories image |
| Laptop Accessories | laptop accessories image |
| Smart Gadgets | gadgets image |

**Insert ~50 products** across categories:
- Smartphones: iPhone 16 Pro, Samsung Galaxy S25, OnePlus 13, Xiaomi 15, Pixel 9, etc.
- Laptops: MacBook Air M4, HP Pavilion, Dell XPS 15, Lenovo ThinkPad, ASUS ROG, etc.
- Tablets: iPad Air, Galaxy Tab S10, Lenovo Tab P12, etc.
- Accessories: cases, chargers, earbuds, stands, etc.
- Each with unique Unsplash tech images, specs-rich descriptions, realistic INR pricing (₹999–₹1,99,999)

**Update hero_slides**: Tech-focused banners (e.g., "Next-Gen Tech, Now Within Reach")

**Update site_settings**: Brand name, announcement text, contact info for EkamTech

---

### Phase 2: Color Palette & Typography

**Update `src/index.css`** CSS variables:
- `--background`: #F8FAFC (210 40% 98%)
- `--foreground`: #111827 (220 26% 14%) — stays similar
- `--primary`: #0F172A (222 47% 11%) — deep navy
- `--accent`: #2563EB (217 91% 60%) — blue
- Secondary cyan: #06B6D4 used for badges/highlights
- Update all related HSL values (card, muted, border, sidebar, badges, etc.)

**Update `tailwind.config.ts`**:
- Font family: `Inter`, `Space Grotesk` for display instead of Playfair Display
- Update font import in CSS

**Update `.font-display`** utility class to use Space Grotesk instead of Playfair Display

---

### Phase 3: Component Text & Branding Updates

**Files to update:**

1. **`src/index.css`** — New color palette + font import (Space Grotesk + Inter)
2. **`tailwind.config.ts`** — Font families
3. **`src/components/layout/Header.tsx`** — Logo reference → EkamTech, search placeholder → "Search phones, laptops..."
4. **`src/components/layout/Footer.tsx`** — Brand name, description, footer links (tech-relevant), copyright
5. **`src/components/layout/MobileMenu.tsx`** — Logo reference
6. **`src/components/home/HeroCarousel.tsx`** — Fallback text → tech copy
7. **`src/components/home/FeaturedProducts.tsx`** — Section title → "Latest Arrivals" / "New Launches"
8. **`src/components/home/BestSellers.tsx`** — Section label → "Top Rated"
9. **`src/components/home/CategoryGrid.tsx`** — Fallback categories → tech categories, section copy
10. **`src/components/home/FAQSection.tsx`** — Tech-relevant FAQs
11. **`src/components/home/TrustSection.tsx`** — Tech trust badges (warranty, genuine products, fast delivery)
12. **`src/components/home/NewsletterSignup.tsx`** — Tech-focused copy
13. **`src/components/home/Testimonials.tsx`** — Tech product reviews
14. **`src/components/products/ProductCard.tsx`** — Change aspect ratio from 3:4 (fashion) to 1:1 (tech products)
15. **`src/data/categories.ts`** — Static fallback → tech categories
16. **`src/data/products.ts`** — Static fallback → tech products
17. **`src/data/productTypes.ts`** — Add electronics product type with specs attributes
18. **`src/pages/Index.tsx`** — Possibly add new sections (Flash Deals, Latest Laptops, etc.) or rename existing

---

### Phase 4: Logo

- Header/Footer/MobileMenu currently reference `/logo-ekamwear.png`
- Will update references to a text-based logo or create a simple SVG "EkamTech" wordmark since we don't have a logo file

---

### Execution Order
1. DB: Delete old data
2. DB: Insert new categories (6)
3. DB: Insert new products (~50)
4. DB: Update hero_slides and site_settings
5. Code: Update color palette (index.css + tailwind.config.ts)
6. Code: Update all component text/branding (Header, Footer, MobileMenu, Homepage sections)
7. Code: Update static fallback data files
8. Code: Adjust ProductCard aspect ratio for tech products

