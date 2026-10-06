// Admin-only endpoint to retry or test-send an order confirmation email.
// Automatic sends happen server-side inside create-order (COD), verify-payment and the payment webhooks.
// Requires the RESEND_API_KEY Edge Function secret.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { sendOrderConfirmation } from '../_shared/order-confirmation-email.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)
    const userClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: userData, error: userError } = await userClient.auth.getUser(authHeader.slice(7))
    if (userError || !userData?.user) return json({ error: 'Unauthorized' }, 401)

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data: isAdmin } = await admin.rpc('has_role', { _user_id: userData.user.id, _role: 'admin' })
    if (!isAdmin) return json({ error: 'Forbidden' }, 403)

    const body = await req.json().catch(() => ({}))
    const orderId = body?.orderId
    const mode = body?.mode === 'test' ? 'test' : 'retry'
    if (typeof orderId !== 'string' || !UUID.test(orderId)) return json({ error: 'Invalid orderId' }, 400)

    const result = await sendOrderConfirmation(admin, orderId, mode)
    const status = result.status === 'failed' ? 502 : 200
    return json(result, status)
  } catch (e) {
    console.error('send-order-confirmation error:', e)
    return json({ status: 'failed', error: 'Internal server error' }, 500)
  }
})
