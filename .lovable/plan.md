

## Plan: Expand EkamWear Product Catalog & Categories (Aachho-Inspired)

### What We Have Now
- 3 categories in DB: Women Ethnic Wear, Men Ethnic Wear, Accessories
- 17 products with Unsplash placeholder images
- All using "EkamWear" brand

### What We'll Do

**Important**: We cannot copy Aachho's product images, names, or descriptions — that's copyrighted content. Instead, we'll create an **original catalog inspired by the same category structure** using royalty-free Unsplash images and original product descriptions.

---

### 1. Expand Categories in Database

Delete existing 3 categories and create a richer category structure matching the Aachho-style navigation:

| Category | Subcategory-style products |
|----------|--------------------------|
| Suit Sets | Chanderi, Georgette, Cotton suits |
| Kurta Sets | Printed, Embroidered, Block-print |
| Co-ord Sets | Crop top + pants, ethnic fusion |
| Anarkali | Floor-length, short, velvet |
| Lehenga Sets | Bridal, festive, lightweight |
| Sarees | Silk, Chiffon, Bandhani |
| Dresses | Maxi, Midi, A-line ethnic |
| Men Kurtas | Lucknowi, Pathani, Cotton |
| Sherwanis | Wedding, festive |
| Jewellery | Earrings, Necklaces, Bangles |
| Bags | Potli, Clutch, Tote |
| Dupattas & Scarves | Silk, Cotton, Embroidered |

---

### 2. Delete All Existing Products & Insert New Catalog (~50+ products)

Each product will have:
- Original creative name and description
- Realistic INR pricing (₹999 - ₹12,999)
- High-quality Unsplash fashion images
- Proper sizes (XS-3XL), colors, badges
- Category assignment
- Product type: `apparel` for clothing, `standard` for accessories

---

### 3. Update Hero Slide in Database

Replace the old "Gifts That Speak Louder" hero slide with ethnic fashion content:
- Title: "Timeless Ethnic Elegance"
- Subtitle: "New Collection 2026"
- Description about handcrafted ethnic fashion
- CTAs pointing to /products

---

### 4. Update Site Settings

Update these `site_settings` keys:
- `hero_title`, `hero_subtitle`, `hero_description` → ethnic fashion copy
- `announcement_text` → fashion-relevant offer
- `contact_email` → hello@ekamwear.store

---

### 5. Update Static Fallback Data

- `src/data/products.ts` — update with ethnic fashion fallback products
- `src/data/categories.ts` — update with new category slugs

---

### 6. No UI Changes

The existing components (CategoryGrid, ProductListing, ProductCard, BestSellers, FeaturedProducts) already read from DB dynamically — they'll automatically reflect the new data.

---

### Execution Order
1. Delete old categories & products from DB (cascade cleans up attributes)
2. Insert new categories (12 categories)
3. Insert new products (~50 products with Unsplash images)
4. Update hero_slides and site_settings
5. Update static fallback files

