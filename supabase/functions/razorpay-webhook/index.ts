import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    // Get webhook secret
    const { data: config } = await supabase
      .from('payment_settings')
      .select('webhook_secret')
      .eq('gateway_name', 'razorpay')
      .single()

    if (!config?.webhook_secret) {
      console.error('Razorpay webhook secret not configured')
      return new Response('Unauthorized', { status: 401 })
    }

    // Signature is REQUIRED — reject unsigned requests
    if (!signature) {
      console.error('Missing Razorpay webhook signature header')
      return new Response('Unauthorized', { status: 401 })
    }

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(config.webhook_secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    )
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody))
    const expectedSig = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
    if (expectedSig !== signature) {
      console.error('Invalid Razorpay webhook signature')
      return new Response('Invalid signature', { status: 401 })
    }

    const event = JSON.parse(rawBody)
    const eventType = event.event

    console.log('Razorpay webhook event:', eventType)

    if (eventType === 'payment.authorized') {
      // Authorized is NOT paid — wait for payment.captured
      console.log('Razorpay payment authorized (not captured yet):', event.payload?.payment?.entity?.order_id)
    } else if (eventType === 'payment.captured') {
      const payment = event.payload?.payment?.entity
      if (!payment) return new Response('OK', { status: 200 })

      const razorpayOrderId = payment.order_id

      // Find transaction by gateway_order_id
      const { data: txn } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('gateway_order_id', razorpayOrderId)
        .eq('gateway', 'razorpay')
        .single()

      if (!txn) {
        console.error('Transaction not found for razorpay order:', razorpayOrderId)
        return new Response('OK', { status: 200 })
      }

      // Idempotent: skip if already verified
      if (txn.verified && txn.status === 'paid') {
        return new Response('OK', { status: 200 })
      }

      // Amount (paise) and currency must match what we recorded for this order
      const expectedPaise = Math.round(Number(txn.amount) * 100)
      if (Number(payment.amount) !== expectedPaise || (payment.currency && payment.currency !== 'INR')) {
        console.error('Razorpay amount/currency mismatch for order:', txn.order_id)
        await supabase.from('payment_transactions')
          .update({ status: 'amount_mismatch', raw_response: sanitize(event) })
          .eq('id', txn.id)
        return new Response('OK', { status: 200 })
      }

      // Update transaction once (duplicate webhook deliveries become no-ops)
      const { data: updated } = await supabase
        .from('payment_transactions')
        .update({
          status: 'paid',
          verified: true,
          gateway_payment_id: payment.id,
          raw_response: sanitize(event),
        })
        .eq('id', txn.id)
        .neq('status', 'paid')
        .select('id')

      if (updated && updated.length > 0) {
        await supabase
          .from('orders')
          .update({ payment_status: 'paid' })
          .eq('id', txn.order_id)
          .neq('payment_status', 'paid')
      }

      console.log('Payment verified via webhook for order:', txn.order_id)
    } else if (eventType === 'payment.failed') {
      const payment = event.payload?.payment?.entity
      if (payment?.order_id) {
        const { data: txn } = await supabase
          .from('payment_transactions')
          .select('id, order_id')
          .eq('gateway_order_id', payment.order_id)
          .eq('gateway', 'razorpay')
          .single()

        if (txn) {
          await supabase
            .from('payment_transactions')
            .update({ status: 'failed', raw_response: sanitize(event) })
            .eq('id', txn.id)
            .neq('status', 'paid')

          // Never downgrade a paid order; release reserved stock exactly once
          await supabase
            .from('orders')
            .update({ payment_status: 'failed' })
            .eq('id', txn.order_id)
            .eq('payment_status', 'pending')
          await supabase.rpc('release_order_stock', { p_order_id: txn.order_id })
        }
      }
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Razorpay webhook error:', error)
    return new Response('Internal error', { status: 500 })
  }
})

// Keep only non-sensitive payment metadata (no card/VPA/bank/contact details)
function sanitize(event: any) {
  const p = event?.payload?.payment?.entity || {}
  return {
    event: event?.event, created_at: event?.created_at,
    payment: { id: p.id, order_id: p.order_id, amount: p.amount, currency: p.currency, status: p.status, method: p.method, error_code: p.error_code, error_description: p.error_description },
  }
}
