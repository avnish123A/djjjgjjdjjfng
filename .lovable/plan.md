

## Plan: Assign Unique Images & Fresh Descriptions to All 46 Products

### Problem
- 46 products exist but only 12 unique Unsplash images are used — many products share the same photo.
- Descriptions are brief and repetitive.

### What We'll Do

**Cannot copy from Aachho.com** — their images, product names, and descriptions are copyrighted. Instead, we'll:

1. **Assign 46 unique, high-quality Unsplash images** — each product gets a distinct ethnic fashion photo. Images will be selected to match the product category (e.g., saree photos for sarees, kurta photos for kurtas, jewelry photos for jewelry).

2. **Write fresh, detailed original descriptions** for all 46 products — each 2-3 sentences covering fabric, design details, and styling suggestions. Inspired by the luxury ethnic fashion tone but entirely original text.

### Execution

Single database migration with 46 `UPDATE` statements:
- Each product gets a unique Unsplash image URL (no duplicates)
- Each product gets a new 2-3 sentence description
- Update `images` array (primary + secondary image where possible)

### Categories & Product Counts
| Category | Products |
|----------|----------|
| Suit Sets | ~4 |
| Kurta Sets | ~4 |
| Co-ord Sets | ~4 |
| Anarkali | ~4 |
| Lehenga Sets | ~4 |
| Sarees | ~4 |
| Dresses | ~4 |
| Men Kurtas | ~4 |
| Sherwanis | ~3 |
| Jewellery | ~4 |
| Bags | ~3 |
| Dupattas & Scarves | ~4 |

### Files Changed
- **Database only** — 46 UPDATE queries
- **`src/data/products.ts`** — update static fallback images to match

### No UI Changes Needed
Components already render from DB dynamically.

