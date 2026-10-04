import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

const UUID = /^[0-9a-f-]{36}$/i

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const body = await req.json()
    const { gateway, orderId, checkoutToken, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body

    if (!gateway || !orderId || !checkoutToken || !UUID.test(orderId) || !UUID.test(checkoutToken)) {
      return json({ error: 'Missing required fields' }, 400)
    }

    // Order must belong to the browser holding the server-issued checkout token
    const { data: order } = await supabase
      .from('orders')
      .select('id, total, payment_method, payment_status')
      .eq('id', orderId)
      .eq('checkout_token', checkoutToken)
      .maybeSingle()
    if (!order || order.payment_method !== gateway) {
      return json({ error: 'Order not found' }, 404)
    }
    if (order.payment_status === 'paid') {
      return json({ success: true, status: 'already_verified' })
    }

    // Fetch the transaction we created for this order
    let txnQuery = supabase
      .from('payment_transactions')
      .select('*')
      .eq('order_id', orderId)
      .eq('gateway', gateway)
    if (gateway === 'razorpay') {
      if (typeof razorpayOrderId !== 'string' || typeof razorpayPaymentId !== 'string' || typeof razorpaySignature !== 'string') {
        return json({ error: 'Missing payment details' }, 400)
      }
      // Stored gateway order ID must match what the browser reports
      txnQuery = txnQuery.eq('gateway_order_id', razorpayOrderId)
    }
    const { data: txn } = await txnQuery.order('created_at', { ascending: false }).limit(1).maybeSingle()
    if (!txn) return json({ error: 'Transaction not found' }, 404)

    if (txn.verified && txn.status === 'paid') {
      return json({ success: true, status: 'already_verified' })
    }

    const { data: gatewayConfig } = await supabase
      .from('payment_settings')
      .select('key_id, key_secret, environment')
      .eq('gateway_name', gateway)
      .single()
    if (!gatewayConfig?.key_secret) return json({ error: 'Gateway not configured' }, 500)

    let verified = false
    let paymentId: string | null = null

    if (gateway === 'razorpay') {
      const sigOk = await verifyRazorpaySignature(txn.gateway_order_id, razorpayPaymentId, razorpaySignature, gatewayConfig.key_secret)
      // Signature alone is not enough: confirm the payment with Razorpay itself
      verified = sigOk && await confirmRazorpayPayment(razorpayPaymentId, txn, gatewayConfig)
      paymentId = razorpayPaymentId
    } else if (gateway === 'cashfree') {
      const res = await verifyCashfreePayment(txn, gatewayConfig)
      verified = res.ok
      paymentId = res.paymentId
    }

    if (!verified) {
      // Unverified callbacks never change order state; webhooks stay authoritative for failures
      console.warn('Payment verification failed for order', orderId)
      return json({ success: false, status: 'verification_failed' }, 400)
    }

    // Only flip to paid once (guards against duplicate callbacks racing the webhook)
    const { data: updated } = await supabase
      .from('payment_transactions')
      .update({ status: 'paid', verified: true, gateway_payment_id: paymentId || txn.gateway_payment_id })
      .eq('id', txn.id)
      .neq('status', 'paid')
      .select('id')
    if (updated && updated.length > 0) {
      await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', orderId).neq('payment_status', 'paid')
      triggerN8nWebhook(supabase, orderId)
    }

    return json({ success: true, status: 'verified' })
  } catch (error) {
    console.error('verify-payment error:', error)
    return json({ error: 'Internal server error' }, 500)
  }
})

async function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(`${orderId}|${paymentId}`))
    const expected = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
    return expected === signature
  } catch (e) {
    console.error('Razorpay signature verification error:', e)
    return false
  }
}

async function confirmRazorpayPayment(paymentId: string, txn: any, config: any): Promise<boolean> {
  try {
    const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `Basic ${btoa(`${config.key_id}:${config.key_secret}`)}` },
    })
    if (!res.ok) return false
    const p = await res.json()
    const expectedPaise = Math.round(Number(txn.amount) * 100)
    return p.order_id === txn.gateway_order_id &&
      p.status === 'captured' &&
      Number(p.amount) === expectedPaise &&
      p.currency === 'INR'
  } catch (e) {
    console.error('Razorpay payment fetch error:', e)
    return false
  }
}

async function verifyCashfreePayment(txn: any, config: any): Promise<{ ok: boolean; paymentId: string | null }> {
  try {
    const baseUrl = config.environment === 'test' ? 'https://sandbox.cashfree.com/pg' : 'https://api.cashfree.com/pg'
    // Cashfree order_id is our order_number; gateway_order_id may hold cf_order_id, so look up by receipt
    const { data: orderRow } = await (globalThis as any).__sb?.from?.('orders') ?? { data: null }
    void orderRow
    const response = await fetch(`${baseUrl}/orders/${encodeURIComponent(txn.cf_lookup_id || txn.gateway_order_id)}/payments`, {
      headers: {
        'x-client-id': config.key_id,
        'x-client-secret': config.key_secret,
        'x-api-version': '2023-08-01',
      },
    })
    if (!response.ok) return { ok: false, paymentId: null }
    const payments = await response.json()
    const expected = Number(txn.amount)
    const hit = Array.isArray(payments) && payments.find((p: any) =>
      p.payment_status === 'SUCCESS' &&
      Math.abs(Number(p.payment_amount) - expected) < 0.01 &&
      (!p.payment_currency || p.payment_currency === 'INR'))
    return hit ? { ok: true, paymentId: String(hit.cf_payment_id) } : { ok: false, paymentId: null }
  } catch (e) {
    console.error('Cashfree verification error:', e)
    return { ok: false, paymentId: null }
  }
}

async function triggerN8nWebhook(supabase: any, orderId: string) {
  try {
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL')
    if (!webhookUrl) return
    const { data: order } = await supabase.from('orders').select('*, order_items(*)').eq('id', orderId).single()
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
          customer: { name: order.customer_name, email: order.customer_email, phone: order.customer_phone },
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
