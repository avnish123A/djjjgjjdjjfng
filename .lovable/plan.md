

## Fix: Admin Payment Gateway Panel

### Root Cause Analysis

After inspecting the codebase, database, edge function logs, and live behavior:

1. **Backend is working**: The `admin-payment-settings` edge function is deployed, the `payment_settings` table has 3 rows (razorpay, cashfree, cod), and `get-active-gateways` returns correctly.
2. **The edge function code is correct** — auth via `getUser()`, admin role check via service client, proper CORS headers.
3. **The frontend code structure is correct** — proper `callEdgeFunction`, state management, toggle handlers.

**The likely root cause**: The edge function may not be deployed with the latest code (logs show no request processing, only boot/shutdown). Additionally, the frontend has a subtle UX issue — the `getUser(token)` call in the edge function might be failing because the deployed version still has `getClaims()` (from a previous iteration that was written but may not have been deployed).

### Plan

#### 1. Redeploy Edge Functions
- Force redeploy `admin-payment-settings` and `get-active-gateways` to ensure the latest code is live.

#### 2. Harden the Admin Payments Frontend (`src/pages/admin/AdminPayments.tsx`)
- **Add network error handling**: Wrap `callEdgeFunction` with a try/catch that shows specific error messages (timeout, network error, auth error) instead of generic "Failed to fetch".
- **Add request timeout**: Use `AbortController` with a 15-second timeout to prevent hanging requests.
- **Fix toggle responsiveness**: Add optimistic UI updates — immediately flip the toggle visually, then revert on error.
- **Improve error visibility**: Show inline error banners per-gateway card instead of only toasts (toasts can be missed on mobile).

#### 3. Ensure Checkout Sync (`src/pages/Checkout.tsx`)
- The checkout already uses `supabase.functions.invoke('get-active-gateways')` which is correct and working (confirmed via curl — returns empty array because no gateways are enabled yet).
- Add a fallback message when no gateways are available: "No payment methods available. Please contact support."

#### 4. Edge Function Stability (`supabase/functions/admin-payment-settings/index.ts`)
- Add request logging at the entry point (`console.log('Request received:', req.method)`) so we can confirm requests are reaching the function.
- Add `updated_at: new Date().toISOString()` to PUT updates so the timestamp reflects when settings were last changed.

### Files to Modify
- `supabase/functions/admin-payment-settings/index.ts` — Add entry logging + updated_at field
- `src/pages/admin/AdminPayments.tsx` — Add AbortController timeout, optimistic toggles, better error handling
- Redeploy edge functions

### What Will NOT Change
- Database schema (already correct)
- `get-active-gateways` function (already working)
- Checkout page (already correctly fetches gateways)
- RLS policies (correctly configured — no SELECT for anon users, admin-only via edge function proxy)

