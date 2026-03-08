

## Security Fix: Payment Gateway Secrets Exposure

### The Issue
There is one error-level security finding: **Payment gateway secrets (API keys, webhook secrets) are directly readable by admin users via client-side queries** to the `payment_settings` table. This means `key_secret`, `webhook_secret`, and `key_id` values are visible in browser memory, dev tools, and network traffic.

### Approach: Edge Function Proxy

Create an edge function `admin-payment-settings` that:
1. **GET**: Returns payment settings with secrets masked (only boolean flags like `has_key_secret: true`)
2. **PUT**: Accepts updates (including new secret values) and writes them server-side

Then update `AdminPayments.tsx` to use the edge function instead of direct Supabase queries.

### Changes

**1. New edge function: `supabase/functions/admin-payment-settings/index.ts`**
- Verifies the caller is an authenticated admin (via `has_role` RPC)
- GET: Fetches payment settings, strips `key_id`, `key_secret`, `webhook_secret`, returns `has_key_id`, `has_key_secret`, `has_webhook_secret` booleans instead
- PUT: Accepts gateway ID + changes, updates the `payment_settings` table using service role

**2. Update `supabase/config.toml`**
- Add `[functions.admin-payment-settings]` with `verify_jwt = false` (auth handled inside the function)

**3. Update `src/pages/admin/AdminPayments.tsx`**
- Change `fetchGateways` to call the edge function GET endpoint instead of direct Supabase query
- Change `handleSave` and `handleToggleEnabled` to call the edge function PUT endpoint
- Update the `GatewayConfig` interface: secret fields become optional (only present when admin types new values), add `has_key_id`, `has_key_secret`, `has_webhook_secret` booleans
- Input fields for secrets show placeholder "••••••••" when `has_key_secret` is true but no edit value; only send secret fields in updates when the admin actually changes them
- Validation logic updated to check `has_key_id`/`has_key_secret` booleans instead of actual secret values

**4. Remove the admin SELECT RLS policy on `payment_settings`**
- Drop the "Admins can read payment settings" SELECT policy since admins should only access settings through the edge function
- Keep INSERT, UPDATE, DELETE policies for direct admin operations that don't expose secrets

### Technical Details
- The edge function uses `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS
- Auth verification done by extracting the JWT from the Authorization header and calling `has_role`
- Secrets are never returned to the client; only status indicators
- When saving, if a secret field is empty/unchanged, it's omitted from the update to avoid overwriting existing secrets with empty strings

