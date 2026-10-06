import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { sendOrderConfirmation } from '../_shared/order-confirmation-email.ts'

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
    const timestamp = req.headers.get('x-webhook-timestamp') || ''
    const signature = req.headers.get('x-webhook-signature') || ''

    // Get webhook secret
    const { data: config } = await supabase
      .from('payment_settings')
      .select('webhook_secret, key_id, key_secret, environment')
      .eq('gateway_name', 'cashfree')
      .single()

    // Signature is REQUIRED — reject unsigned requests
    if (!signature || !timestamp || !config?.webhook_secret) {
      console.error('Missing Cashfree webhook signature, timestamp, or secret')
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    try {
      const encoder = new TextEncoder()
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(config.webhook_secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )
      const payload = timestamp + rawBody
      const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
      const expectedSig = Array.from(new Uint8Array(sig))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      if (expectedSig !== signature) {
        console.error('Cashfree webhook signature mismatch')
        return new Response('Invalid signature', { status: 401, headers: corsHeaders })
      }
      console.log('Cashfree webhook signature verified')
    } catch (sigError) {
      console.error('Signature verification error:', sigError)
      return new Response('Invalid signature', { status: 401, headers: corsHeaders })
    }

    const event = JSON.parse(rawBody)
    const eventType = event.type || event.event

    console.log('Cashfree webhook event:', eventType)

    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' || event.data?.payment?.payment_status === 'SUCCESS') {
      const paymentData = event.data?.payment || event.data
      const cfOrderId = event.data?.order?.order_id || paymentData?.order_id

      if (!cfOrderId) {
        console.error('No order ID in Cashfree webhook')
        return new Response('OK', { status: 200 })
      }

      // Find transaction
      // Cashfree order_id is our merchant order number
      const txn = await findTxn(supabase, cfOrderId)

      if (!txn) {
        console.error('Transaction not found for Cashfree order:', cfOrderId)
        return new Response('OK', { status: 200 })
      }

      // Idempotent
      if (txn.verified && txn.status === 'paid') {
        return new Response('OK', { status: 200 })
      }

      // Webhook amount/currency must match what we recorded
      const whAmount = Number(paymentData?.payment_amount)
      const whCurrency = paymentData?.payment_currency
      if (!(Math.abs(whAmount - Number(txn.amount)) < 0.01) || (whCurrency && whCurrency !== 'INR')) {
        console.error('Cashfree amount/currency mismatch for order:', txn.order_id)
        await supabase.from('payment_transactions').update({ status: 'amount_mismatch' }).eq('id', txn.id).neq('status', 'paid')
        return new Response('OK', { status: 200 })
      }

      // Confirm via API call (required)
      {
        const isTest = config.environment === 'test'
        const baseUrl = isTest ? 'https://sandbox.cashfree.com/pg' : 'https://api.cashfree.com/pg'

        const verifyResponse = await fetch(`${baseUrl}/orders/${cfOrderId}/payments`, {
          headers: {
            'x-client-id': config.key_id,
            'x-client-secret': config.key_secret,
            'x-api-version': '2023-08-01',
          },
        })

        if (!verifyResponse.ok) {
          console.error('Cashfree API verification unavailable')
          return new Response('Retry later', { status: 500 })
        }
        const payments = await verifyResponse.json()
        const successPayment = Array.isArray(payments) && payments.find((p: any) =>
          p.payment_status === 'SUCCESS' && Math.abs(Number(p.payment_amount) - Number(txn.amount)) < 0.01)
        if (!successPayment) {
          console.error('No matching successful payment found via API verification')
          return new Response('OK', { status: 200 })
        }
      }

      const { data: updated } = await supabase
        .from('payment_transactions')
        .update({
          status: 'paid',
          verified: true,
          gateway_payment_id: paymentData?.cf_payment_id?.toString() || null,
          raw_response: sanitize(event),
        })
        .eq('id', txn.id)
        .neq('status', 'paid')
        .select('id')

      if (updated && updated.length > 0) {
        await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', txn.order_id).neq('payment_status', 'paid')
        const __mail = sendOrderConfirmation(supabase, txn.order_id).then((r) => console.log('order confirmation email:', r.status)).catch(() => {})
        // @ts-ignore EdgeRuntime is provided by the Supabase runtime
        if (typeof EdgeRuntime !== 'undefined') EdgeRuntime.waitUntil(__mail); else await __mail
      }

      console.log('Payment verified via Cashfree webhook for order:', txn.order_id)
    } else if (eventType === 'PAYMENT_FAILED_WEBHOOK' || event.data?.payment?.payment_status === 'FAILED') {
      const cfOrderId = event.data?.order?.order_id

      if (cfOrderId) {
        const txn = await findTxn(supabase, cfOrderId)

        if (txn) {
          await supabase
            .from('payment_transactions')
            .update({ status: 'failed', raw_response: sanitize(event) })
            .eq('id', txn.id)
            .neq('status', 'paid')

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
    console.error('Cashfree webhook error:', error)
    return new Response('Internal error', { status: 500 })
  }
})

async function findTxn(supabase: any, merchantOrderId: string) {
  const { data: order } = await supabase.from('orders').select('id').eq('order_number', merchantOrderId).maybeSingle()
  if (!order) return null
  const { data: txn } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('gateway', 'cashfree')
    .eq('order_id', order.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return txn
}

// Keep only non-sensitive payment metadata
function sanitize(event: any) {
  const p = event?.data?.payment || {}
  return {
    type: event?.type, event_time: event?.event_time,
    order_id: event?.data?.order?.order_id,
    payment: { cf_payment_id: p.cf_payment_id, payment_status: p.payment_status, payment_amount: p.payment_amount, payment_currency: p.payment_currency, payment_group: p.payment_group },
  }
}
