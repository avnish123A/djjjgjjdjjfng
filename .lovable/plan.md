

# Premium Minimalist E-Commerce Design Polish

This plan refines your existing Luxury Monochrome (Apple/Nike-inspired) theme to pixel-perfect Shopify standards. The foundation is solid -- this is a precision pass to elevate every detail.

---

## What's Already Done Well

- Color palette (Black/White/Electric Blue #0066FF) is correctly applied
- Inter font family with proper weights
- Product cards with 3:4 aspect ratio, hover actions, badges
- Sticky header with announcement bar and backdrop blur
- Trust badges in footer and dedicated section
- Indian Rupee formatting, checkout flow, policy pages
- Framer Motion animations throughout

---

## What Needs Refinement

### 1. Design System Token Cleanup

**CSS Variables** -- Fine-tune to match the exact spec:
- `--background` should map precisely to `#FFFFFF` (currently `0 0% 100%` -- correct)
- `--foreground` is `0 0% 7%` (`#121212`) -- update to `0 0% 0%` for pure `#000000`
- `--secondary` (Neutral 1) should be `240 5% 97%` to match `#F5F5F7` exactly
- `--muted-foreground` (Neutral 2) should be `240 2% 54%` for `#86868B`
- `--success` should be `142 69% 49%` for Apple Green `#34C759`
- `--destructive` should be `4 100% 50%` for `#FF3B30`

**Tailwind Config** updates:
- Add responsive container padding (`2rem` on larger screens instead of uniform `1rem`)
- Add `text-price` font size (`1.5rem` / 700 weight)
- Add `text-body-lg` size (`1.125rem` / 400 / 1.6 line-height)

### 2. Header & Navigation Polish

- Increase desktop header height from `h-16` (64px) to match the spec exactly (already correct)
- Add a slight `translateY` hide-on-scroll-down / show-on-scroll-up behavior
- Desktop nav links: increase from `text-[13px]` to `text-sm` (14px) with `500` weight
- Search input: add a subtle focus transition with accent ring color
- Mobile header: reduce to 56px height
- Cart badge: ensure `bounce-in` animation on count change

### 3. Product Card Refinement

- Add secondary image on hover (fade transition) when product has multiple images
- Increase card border-radius from `rounded-xl` to `rounded-2xl` (12px)
- Refine hover shadow to exactly `0 8px 24px rgba(0,0,0,0.12)`
- Add to Cart button on hover: slide-up animation (currently translate-y, make smoother)
- Mobile: make wishlist heart always visible with slightly larger touch target (44px minimum)
- Color swatches: increase to 16px (`w-4 h-4`) for better visibility

### 4. Product Listing Page

- Desktop grid: support 4 columns on large screens (already done), add 5-column option for `2xl`
- Add active filter chips bar above grid when filters are applied
- Skeleton loading: add shimmer animation instead of plain pulse
- Sort dropdown: style with custom chevron icon, remove native browser styling
- Add product count next to page title more prominently

### 5. Product Detail Page

- Image gallery: add zoom-on-hover cursor effect for desktop
- Thumbnail strip: increase active border to accent color instead of foreground
- Price section: make current price use accent color for emphasis
- Size chips: increase minimum width to 56px as per spec
- Add to Cart button: add loading spinner + checkmark success animation
- Buy Now button: add as secondary CTA below Add to Cart
- Trust badges: add icon accent color highlight on hover
- Mobile sticky bar: increase height to 64px, add price display

### 6. Cart Page

- Add "Move to Wishlist" text link below remove button on each item
- Coupon section: make it collapsible by default ("Have a coupon?" toggle)
- Order summary: add estimated delivery text with calendar icon
- Add "You save X" green text when discounts are applied
- Improve mobile summary: make it sticky at bottom with collapsible detail

### 7. Checkout Page

- Add step indicator progress bar (Cart > Information > Shipping > Payment)
- Checkout header: simplify to only show logo + breadcrumb (remove main nav) -- already partially done
- Add express checkout section placeholder at top (Shop Pay / Google Pay styling)
- Payment method cards: add subtle icon illustrations
- Order summary on mobile: make collapsible, show only total by default
- Add "Estimated delivery: 3-5 days" in the summary section

### 8. 404 Page Redesign

- Replace plain design with branded illustration-style empty state
- Add search bar and popular category links
- Match the premium aesthetic with generous whitespace

### 9. Order Success Page

- Enhance checkmark animation (scale spring + confetti-style micro-animation)
- Add estimated delivery date prominently
- Add order timeline visual (Ordered > Processing > Shipped > Delivered)

### 10. Mobile Bottom Navigation Bar (New Component)

- Create `BottomNav.tsx` component
- 60px height, fixed at bottom, white background with top border shadow
- 5 icons: Home, Categories (grid), Search, Wishlist (heart), Account (user)
- Active state: accent color icon + small label text
- Only show on mobile (`lg:hidden`)
- Integrate into `StorefrontLayout`

### 11. Newsletter Section Polish

- Add subtle geometric shape decorations (circles at 10% opacity) behind content
- Increase input + button to be on the same line with rounded-full styling (already done)
- Add a subtle gradient overlay background instead of flat foreground color

### 12. Global Animation Refinements

- Add scroll-triggered fade-up with stagger for product grids (100ms between items)
- Smooth page transitions: wrap routes in `AnimatePresence` with fade
- Button press: add `active:scale-[0.98]` to all interactive buttons
- Image loading: add blur-up placeholder effect using CSS blur filter
- Back-to-top button: floating button that appears after 500px scroll

---

## Technical Details

### Files to Create
- `src/components/layout/BottomNav.tsx` -- Mobile bottom navigation
- `src/components/layout/BackToTop.tsx` -- Scroll-to-top floating button

### Files to Edit
- `src/index.css` -- CSS variable refinements, utility classes (shimmer, blur-up)
- `tailwind.config.ts` -- Additional font sizes, container padding, shadow refinements
- `src/components/layout/Header.tsx` -- Scroll direction detection, mobile height
- `src/components/products/ProductCard.tsx` -- Secondary image hover, shadow refinement, touch targets
- `src/pages/ProductListing.tsx` -- Active filter chips, grid columns, shimmer skeleton
- `src/pages/ProductDetail.tsx` -- Zoom cursor, Buy Now button, success animation, mobile bar
- `src/pages/Cart.tsx` -- Move to wishlist, collapsible coupon, savings display
- `src/pages/Checkout.tsx` -- Step progress bar, express checkout section, collapsible mobile summary
- `src/pages/NotFound.tsx` -- Full redesign with brand styling
- `src/pages/OrderSuccess.tsx` -- Enhanced animation, delivery timeline
- `src/components/home/NewsletterSignup.tsx` -- Background decoration
- `src/components/ui/button.tsx` -- Add `active:scale-[0.98]` to base styles
- `src/App.tsx` -- Add BottomNav to StorefrontLayout

### No Database Changes Required
This is purely a frontend design refinement -- no schema or backend changes needed.

