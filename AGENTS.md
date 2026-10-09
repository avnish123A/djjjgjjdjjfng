# Architecture Rules

- Keep catalog merchandising fields additive and use `archived_at` plus `is_active` for safe retirement, because historical orders must retain product references.
- Keep homepage campaign tiles database-backed through `promo_banners`, because storefront merchandising must remain admin-manageable.
- Preserve all checkout, payment, stock-validation, idempotency, webhook, and RLS paths unchanged during presentation work, because they are security boundaries.
- Scope purchase-experience tokens to `.purchase-theme` and share decorative parcel artwork across purchase pages, because the storefront theme and transactional truth must remain independent.
- Render confirmation emails through the existing server-only template and sender, because styling must not introduce a second email flow or alter duplicate protection.
