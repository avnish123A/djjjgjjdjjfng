import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

async function verifyAdmin(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 }
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  // Use getClaims for JWT verification
  const token = authHeader.replace('Bearer ', '')
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token)
  if (claimsError || !claimsData?.claims) {
    console.error('getClaims error:', claimsError?.message)
    return { error: 'Unauthorized', status: 401 }
  }

  const userId = claimsData.claims.sub as string
  if (!userId) {
    return { error: 'Unauthorized', status: 401 }
  }

  // Check admin role
  const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' })
  if (roleError) {
    console.error('has_role error:', roleError.message)
    return { error: 'Forbidden', status: 403 }
  }
  if (!isAdmin) {
    return { error: 'Forbidden', status: 403 }
  }

  return { userId }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const auth = await verifyAdmin(req)
    if ('error' in auth) {
      return new Response(JSON.stringify({ error: auth.error }), {
        status: auth.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    if (req.method === 'GET') {
      const { data, error } = await serviceClient
        .from('payment_settings')
        .select('*')
        .order('priority', { ascending: true })

      if (error) {
        console.error('Failed to load payment settings:', error.message)
        return new Response(JSON.stringify({ error: 'Failed to load payment settings' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Mask secrets - replace actual values with boolean indicators
      const masked = (data || []).map((gw: any) => ({
        id: gw.id,
        gateway_name: gw.gateway_name,
        is_enabled: gw.is_enabled,
        environment: gw.environment,
        priority: gw.priority,
        cod_extra_charge: gw.cod_extra_charge,
        cod_min_order: gw.cod_min_order,
        has_key_id: !!(gw.key_id && gw.key_id.trim()),
        has_key_secret: !!(gw.key_secret && gw.key_secret.trim()),
        has_webhook_secret: !!(gw.webhook_secret && gw.webhook_secret.trim()),
      }))

      return new Response(JSON.stringify(masked), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'PUT') {
      const body = await req.json()
      const { id, changes } = body

      if (!id || !changes) {
        return new Response(JSON.stringify({ error: 'Missing id or changes' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Only include allowed fields
      const allowedFields = ['is_enabled', 'environment', 'key_id', 'key_secret', 'webhook_secret', 'cod_extra_charge', 'cod_min_order']
      const sanitized: Record<string, any> = {}
      for (const field of allowedFields) {
        if (field in changes) {
          // Don't overwrite secrets with empty strings
          if (['key_id', 'key_secret', 'webhook_secret'].includes(field)) {
            if (changes[field] !== undefined && changes[field] !== '') {
              sanitized[field] = changes[field]
            }
          } else {
            sanitized[field] = changes[field]
          }
        }
      }

      if (Object.keys(sanitized).length === 0) {
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      console.log('Updating payment settings for id:', id, 'fields:', Object.keys(sanitized))

      const { error } = await serviceClient
        .from('payment_settings')
        .update(sanitized)
        .eq('id', id)

      if (error) {
        console.error('Failed to update payment settings:', error.message)
        return new Response(JSON.stringify({ error: 'Failed to update payment settings' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('admin-payment-settings error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
