# Architecture Rules

- Keep catalog merchandising fields additive and use `archived_at` plus `is_active` for safe retirement, because historical orders must retain product references.
- Keep homepage campaign tiles database-backed through `promo_banners`, because storefront merchandising must remain admin-manageable.
- Preserve all checkout, payment, stock-validation, idempotency, webhook, and RLS paths unchanged during presentation work, because they are security boundaries.
