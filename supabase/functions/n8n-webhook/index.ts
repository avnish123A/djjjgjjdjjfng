import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify admin auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token)
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const userId = claimsData.claims.sub as string

    // Verify admin role
    const serviceClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data: roleData } = await serviceClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle()

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL')
    if (!webhookUrl) {
      return new Response(JSON.stringify({ error: 'N8N_WEBHOOK_URL not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const body = await req.json()
    const { event, order_id } = body

    if (!event || !order_id) {
      return new Response(JSON.stringify({ error: 'Missing event or order_id' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Fetch full order data
    const { data: order, error: orderError } = await serviceClient
      .from('orders')
      .select(`
        id, order_number, order_status, payment_status, payment_method,
        subtotal, shipping, discount, total,
        created_at, order_date, tracking_number, courier_name,
        customer_name, customer_email, customer_phone, shipping_address,
        order_items (id, title, price, quantity, image, color, size)
      `)
      .eq('id', order_id)
      .maybeSingle()

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Fire webhook async (don't block response)
    const webhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      order: {
        id: order.id,
        order_number: order.order_number,
        status: order.order_status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        total: order.total,
        subtotal: order.subtotal,
        shipping: order.shipping,
        discount: order.discount,
        tracking_number: order.tracking_number,
        courier_name: order.courier_name,
        order_date: order.order_date,
        customer: {
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
          address: order.shipping_address,
        },
        items: order.order_items,
      },
    }

    // Send to n8n (fire-and-forget pattern with timeout)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (!webhookResponse.ok) {
        console.error(`n8n webhook returned ${webhookResponse.status}`)
      }
    } catch (webhookErr) {
      clearTimeout(timeout)
      console.error('n8n webhook failed:', webhookErr)
      // Don't fail the request — webhook is best-effort
    }

    return new Response(
      JSON.stringify({ success: true, event, order_id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
