# Architecture Rules

- Keep catalog merchandising fields additive and use `archived_at` plus `is_active` for safe retirement, because historical orders must retain product references.
- Keep homepage campaign tiles database-backed through `promo_banners`, because storefront merchandising must remain admin-manageable.
- Preserve all checkout, payment, stock-validation, idempotency, webhook, and RLS paths unchanged during presentation work, because they are security boundaries.
- Scope public design tokens to `.storefront-theme`, inherit them in purchase pages, and leave root/sidebar tokens admin-owned, because storefront consistency must not alter admin styling or transactional logic.
- Wrap the public layout in MotionConfig with user reduced-motion preference, because decorative transitions must respect accessibility without changing routes or business behavior.
- Render confirmation emails through the existing server-only template and sender, because styling must not introduce a second email flow or alter duplicate protection.
- Re-export the server-shared delivery policy through the storefront delivery helper, because email and storefront policy wording must have one source without changing order-specific ETA handling.
