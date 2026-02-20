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
    const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const body = await req.json()
    const { gateway, orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body

    if (!gateway || !orderId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch transaction
    const { data: txn } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('order_id', orderId)
      .eq('gateway', gateway)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!txn) {
      return new Response(
        JSON.stringify({ error: 'Transaction not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prevent duplicate verification
    if (txn.verified && txn.status === 'paid') {
      return new Response(
        JSON.stringify({ success: true, status: 'already_verified' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch gateway config for secrets
    const { data: gatewayConfig } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('gateway_name', gateway)
      .single()

    if (!gatewayConfig) {
      return new Response(
        JSON.stringify({ error: 'Gateway config not found' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let verified = false

    if (gateway === 'razorpay') {
      verified = await verifyRazorpaySignature(
        razorpayOrderId || txn.gateway_order_id,
        razorpayPaymentId,
        razorpaySignature,
        gatewayConfig.key_secret
      )
    } else if (gateway === 'cashfree') {
      // For Cashfree, verify by fetching order status from API
      verified = await verifyCashfreePayment(txn, gatewayConfig)
    }

    if (verified) {
      // Update transaction
      await supabase
        .from('payment_transactions')
        .update({
          status: 'paid',
          verified: true,
          gateway_payment_id: razorpayPaymentId || txn.gateway_payment_id,
          raw_response: body,
        })
        .eq('id', txn.id)

      // Update order
      await supabase
        .from('orders')
        .update({ payment_status: 'paid' })
        .eq('id', orderId)

      // Fire n8n webhook (best-effort)
      triggerN8nWebhook(supabase, orderId)

      return new Response(
        JSON.stringify({ success: true, status: 'verified' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // Mark as failed
      await supabase
        .from('payment_transactions')
        .update({ status: 'failed', raw_response: body })
        .eq('id', txn.id)

      await supabase
        .from('orders')
        .update({ payment_status: 'failed' })
        .eq('id', orderId)

      return new Response(
        JSON.stringify({ success: false, status: 'verification_failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('verify-payment error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const payload = `${orderId}|${paymentId}`
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    )
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
    const expectedSignature = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
    return expectedSignature === signature
  } catch (e) {
    console.error('Razorpay signature verification error:', e)
    return false
  }
}

async function verifyCashfreePayment(txn: any, config: any): Promise<boolean> {
  try {
    const isTest = config.environment === 'test'
    const baseUrl = isTest
      ? 'https://sandbox.cashfree.com/pg'
      : 'https://api.cashfree.com/pg'

    const response = await fetch(`${baseUrl}/orders/${txn.gateway_order_id}/payments`, {
      headers: {
        'x-client-id': config.key_id,
        'x-client-secret': config.key_secret,
        'x-api-version': '2023-08-01',
      },
    })

    if (!response.ok) return false

    const payments = await response.json()
    // Check if any payment is successful
    return Array.isArray(payments) && payments.some((p: any) => p.payment_status === 'SUCCESS')
  } catch (e) {
    console.error('Cashfree verification error:', e)
    return false
  }
}

async function triggerN8nWebhook(supabase: any, orderId: string) {
  try {
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL')
    if (!webhookUrl) return

    const { data: order } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single()

    if (!order) return

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'payment_verified',
        timestamp: new Date().toISOString(),
        order: {
          id: order.id,
          order_number: order.order_number,
          status: order.order_status,
          payment_status: 'paid',
          payment_method: order.payment_method,
          total: order.total,
          customer: {
            name: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone,
          },
          items: order.order_items,
        },
      }),
      signal: controller.signal,
    }).catch(() => {})

    clearTimeout(timeout)
  } catch {
    // Best-effort
  }
}
