// Admin-only email configuration & health check.
// Reports whether required secrets are configured (never their values)
// and summarizes email_events delivery stats.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200, headers: corsHeaders })
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405)

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

    // Configuration presence checks — booleans only, never values
    const config = {
      resend_api_key: !!(Deno.env.get('RESEND_API_KEY') || '').trim(),
      email_from: !!(Deno.env.get('EMAIL_FROM') || '').trim(),
      site_url: !!(Deno.env.get('SITE_URL') || '').trim(),
    }

    // Delivery stats from email_events
    const { count: failedCount, error: failedError } = await admin
      .from('email_events')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'failed')
    if (failedError) {
      console.error('email-health-check stats error:', failedError.message)
      return json({ error: 'Failed to load email stats' }, 500)
    }

    const { data: lastSent } = await admin
      .from('email_events')
      .select('email_type, recipient, sent_at')
      .eq('status', 'sent')
      .order('sent_at', { ascending: false })
      .limit(1)

    const { data: lastFailed } = await admin
      .from('email_events')
      .select('email_type, recipient, updated_at, error_message')
      .eq('status', 'failed')
      .order('updated_at', { ascending: false })
      .limit(1)

    return json({
      config,
      stats: {
        failed_count: failedCount ?? 0,
        last_sent: lastSent?.[0] ?? null,
        last_failed: lastFailed?.[0] ?? null,
      },
    })
  } catch (e) {
    console.error('email-health-check error:', e)
    return json({ error: 'Internal server error' }, 500)
  }
})
