## Plan: Editorial Gastronomy E-commerce Transformation

### Phase 1: Design System Overhaul
- **Color Palette**: Oatmeal canvas (`#F5F2EB`), Vantablack ink (`#0A0A0A`), Truffle accent (`#6B5E4C`), Oxblood hover (`#4A1515`)
- **Typography**: Playfair Display (serif, tight tracking) for heroes + GT-style italics for whisper subheads; Inter ALL CAPS wide-tracked for utility/buttons
- Update `index.css` and `tailwind.config.ts`

### Phase 2: Database — Clear & Rebuild
- Delete all electronics products, categories, hero_slides
- Insert new gourmet categories: **Single-Origin Oils**, **Artisan Vinegars**, **Heritage Spices**, **Wild Honey**, **Rare Teas**, **Cured Salts**
- Insert ~30 luxury food products with origin coordinates, harvest year, tasting notes in descriptions
- Update site_settings for new brand name (e.g., "Terroir & Co." or keep EkamTech rebranded)

### Phase 3: Component Redesign

**Header**: Minimal editorial — logo left, sparse nav, no search bar prominence. Parchment bg, serif wordmark.

**HeroCarousel**: Full-bleed editorial imagery, overlapping serif text, asymmetric layout. Slow transitions.

**CategoryGrid**: Replace circular icons with full-width editorial category cards with overlapping text.

**ProductCard**: "Museum artifact" style — origin coordinates, harvest year, tasting notes, elegant hover scale (3-5% over 1.5s).

**New: Kinetic Marquee**: Infinite looping text band ("100% TRACEABLE — SINGLE ESTATE — COLD PRESSED").

**BestSellers / FeaturedProducts**: Magazine asymmetric grid layout with sticky narrative panels.

**TrustSection**: Refined with editorial trust language.

**Footer**: Minimal, editorial. Serif headings, wide-tracked links.

**BankOffersStrip → Remove** (not relevant to gastronomy)

### Phase 4: Micro-interactions
- Image hover: scale 1.03-1.05 over 1.5s ease
- Button hover: color inversion with line-draw effect
- Hardware-accelerated animations only (transform, opacity)
- Lazy loading with blur placeholders

### Phase 5: Brand Identity
- New brand name decision needed
- Update all text references

### Files Changed
- `src/index.css` — full palette + utilities
- `tailwind.config.ts` — typography + colors
- All homepage components
- `Header.tsx`, `Footer.tsx`, `MobileMenu.tsx`
- `ProductCard.tsx`
- New `Marquee.tsx` component
- Database: categories, products, hero_slides, site_settings
- `src/data/products.ts`, `src/data/categories.ts`

### No Changes
- Checkout flow, cart logic, admin panel, payment integrations
