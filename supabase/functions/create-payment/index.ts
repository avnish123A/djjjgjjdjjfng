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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { orderId, gateway, checkoutToken } = await req.json()
    const UUID = /^[0-9a-f-]{36}$/i

    if (!orderId || !gateway || !checkoutToken || !UUID.test(orderId) || !UUID.test(checkoutToken) || !['razorpay', 'cashfree'].includes(gateway)) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid payment request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch order — the server-issued checkout token proves this browser created it
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('checkout_token', checkoutToken)
      .maybeSingle()

    if (orderErr || !order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Order must be payable with this gateway
    if (order.payment_status !== 'pending' && order.payment_status !== 'failed') {
      return new Response(
        JSON.stringify({ error: 'This order cannot be paid' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    if (order.payment_method !== gateway) {
      return new Response(
        JSON.stringify({ error: 'Payment method does not match this order' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    if (order.order_status === 'cancelled' || order.stock_released) {
      return new Response(
        JSON.stringify({ error: 'This order has expired. Please place a new order.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch gateway config
    const { data: gatewayConfig } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('gateway_name', gateway)
      .eq('is_enabled', true)
      .single()

    if (!gatewayConfig || !gatewayConfig.key_id || !gatewayConfig.key_secret) {
      return new Response(
        JSON.stringify({ error: `${gateway} is not enabled` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const amountInPaise = Math.round(Number(order.total) * 100)

    // Idempotency: reuse a recent open session for the same order and amount
    const { data: existing } = await supabase
      .from('payment_transactions')
      .select('gateway_order_id, amount, created_at')
      .eq('order_id', order.id)
      .eq('gateway', gateway)
      .eq('status', 'created')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    const fresh = existing && Date.now() - new Date(existing.created_at).getTime() < 15 * 60_000
    if (gateway === 'razorpay' && fresh && Number(existing.amount) === Number(order.total) && existing.gateway_order_id) {
      return new Response(
        JSON.stringify({
          gateway: 'razorpay',
          razorpayOrderId: existing.gateway_order_id,
          razorpayKeyId: gatewayConfig.key_id,
          amount: amountInPaise,
          currency: 'INR',
          orderNumber: order.order_number,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          customerPhone: order.customer_phone,
          isTest: gatewayConfig.environment === 'test',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (gateway === 'razorpay') {
      return await handleRazorpay(supabase, order, gatewayConfig, amountInPaise)
    } else if (gateway === 'cashfree') {
      return await handleCashfree(supabase, order, gatewayConfig, amountInPaise)
    }

    return new Response(
      JSON.stringify({ error: 'Unsupported gateway' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('create-payment error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleRazorpay(supabase: any, order: any, config: any, amountInPaise: number) {
  const isTest = config.environment === 'test'
  const baseUrl = 'https://api.razorpay.com/v1'

  const auth = btoa(`${config.key_id}:${config.key_secret}`)

  const rzpResponse = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order.order_number,
      notes: {
        order_id: order.id,
        customer_email: order.customer_email,
      },
    }),
  })

  if (!rzpResponse.ok) {
    const errText = await rzpResponse.text()
    console.error('Razorpay order creation failed:', errText)
    return new Response(
      JSON.stringify({ error: 'Failed to create Razorpay order' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const rzpOrder = await rzpResponse.json()

  // Log transaction
  await supabase.from('payment_transactions').insert({
    order_id: order.id,
    gateway: 'razorpay',
    gateway_order_id: rzpOrder.id,
    amount: order.total,
    status: 'created',
  })

  return new Response(
    JSON.stringify({
      gateway: 'razorpay',
      razorpayOrderId: rzpOrder.id,
      razorpayKeyId: config.key_id,
      amount: amountInPaise,
      currency: 'INR',
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      isTest,
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleCashfree(supabase: any, order: any, config: any, amountInPaise: number) {
  const isTest = config.environment === 'test'
  const baseUrl = isTest
    ? 'https://sandbox.cashfree.com/pg'
    : 'https://api.cashfree.com/pg'

  const cfResponse = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': config.key_id,
      'x-client-secret': config.key_secret,
      'x-api-version': '2023-08-01',
    },
    body: JSON.stringify({
      order_id: order.order_number,
      order_amount: Number(order.total),
      order_currency: 'INR',
      customer_details: {
        customer_id: order.customer_email.replace(/[^a-zA-Z0-9]/g, '_'),
        customer_email: order.customer_email,
        customer_phone: order.customer_phone || '9999999999',
        customer_name: order.customer_name,
      },
      order_meta: {
        return_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/verify-payment?order_id=${order.id}&gateway=cashfree`,
      },
    }),
  })

  if (!cfResponse.ok) {
    const errText = await cfResponse.text()
    console.error('Cashfree order creation failed:', errText)
    return new Response(
      JSON.stringify({ error: 'Failed to create Cashfree session' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const cfOrder = await cfResponse.json()

  // Log transaction
  await supabase.from('payment_transactions').insert({
    order_id: order.id,
    gateway: 'cashfree',
    gateway_order_id: cfOrder.cf_order_id?.toString() || cfOrder.order_id,
    amount: order.total,
    status: 'created',
  })

  return new Response(
    JSON.stringify({
      gateway: 'cashfree',
      paymentSessionId: cfOrder.payment_session_id,
      cfOrderId: cfOrder.cf_order_id,
      orderToken: cfOrder.order_token,
      environment: config.environment,
      orderNumber: order.order_number,
      isTest,
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
