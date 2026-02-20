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

    const { orderId, gateway } = await req.json()

    if (!orderId || !gateway) {
      return new Response(
        JSON.stringify({ error: 'Missing orderId or gateway' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch order
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderErr || !order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if already paid
    if (order.payment_status === 'paid') {
      return new Response(
        JSON.stringify({ error: 'Order already paid' }),
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

    if (!gatewayConfig) {
      return new Response(
        JSON.stringify({ error: `${gateway} is not enabled` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const amountInPaise = Math.round(Number(order.total) * 100)

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
