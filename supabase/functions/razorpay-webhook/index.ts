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
      return new Response('OK', { status: 200 })
    }

    // Verify signature
    if (signature) {
      const encoder = new TextEncoder()
      const key = await crypto.subtle.importKey(
        'raw', encoder.encode(config.webhook_secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
      )
      const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody))
      const expectedSig = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
      if (expectedSig !== signature) {
        console.error('Invalid Razorpay webhook signature')
        return new Response('Invalid signature', { status: 400 })
      }
    }

    const event = JSON.parse(rawBody)
    const eventType = event.event

    console.log('Razorpay webhook event:', eventType)

    if (eventType === 'payment.captured' || eventType === 'payment.authorized') {
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

      // Update transaction
      await supabase
        .from('payment_transactions')
        .update({
          status: 'paid',
          verified: true,
          gateway_payment_id: payment.id,
          raw_response: event,
        })
        .eq('id', txn.id)

      // Update order
      await supabase
        .from('orders')
        .update({ payment_status: 'paid' })
        .eq('id', txn.order_id)

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
            .update({ status: 'failed', raw_response: event })
            .eq('id', txn.id)

          await supabase
            .from('orders')
            .update({ payment_status: 'failed' })
            .eq('id', txn.order_id)
        }
      }
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Razorpay webhook error:', error)
    return new Response('Internal error', { status: 500 })
  }
})
