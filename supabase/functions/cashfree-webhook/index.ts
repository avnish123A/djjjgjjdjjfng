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
    const timestamp = req.headers.get('x-webhook-timestamp') || ''
    const signature = req.headers.get('x-webhook-signature') || ''

    // Get webhook secret
    const { data: config } = await supabase
      .from('payment_settings')
      .select('webhook_secret, key_id, key_secret, environment')
      .eq('gateway_name', 'cashfree')
      .single()

    // TODO: Verify Cashfree webhook signature using their HMAC method
    // For now, we verify by checking payment status via API

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
      const { data: txn } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('gateway', 'cashfree')
        .or(`gateway_order_id.eq.${cfOrderId}`)
        .single()

      if (!txn) {
        console.error('Transaction not found for Cashfree order:', cfOrderId)
        return new Response('OK', { status: 200 })
      }

      // Idempotent
      if (txn.verified && txn.status === 'paid') {
        return new Response('OK', { status: 200 })
      }

      // Verify via API call
      if (config) {
        const isTest = config.environment === 'test'
        const baseUrl = isTest ? 'https://sandbox.cashfree.com/pg' : 'https://api.cashfree.com/pg'

        const verifyResponse = await fetch(`${baseUrl}/orders/${cfOrderId}/payments`, {
          headers: {
            'x-client-id': config.key_id,
            'x-client-secret': config.key_secret,
            'x-api-version': '2023-08-01',
          },
        })

        if (verifyResponse.ok) {
          const payments = await verifyResponse.json()
          const successPayment = Array.isArray(payments) && payments.find((p: any) => p.payment_status === 'SUCCESS')

          if (!successPayment) {
            console.error('No successful payment found via API verification')
            return new Response('OK', { status: 200 })
          }
        }
      }

      // Update transaction
      await supabase
        .from('payment_transactions')
        .update({
          status: 'paid',
          verified: true,
          gateway_payment_id: paymentData?.cf_payment_id?.toString() || '',
          raw_response: event,
        })
        .eq('id', txn.id)

      // Update order
      await supabase
        .from('orders')
        .update({ payment_status: 'paid' })
        .eq('id', txn.order_id)

      console.log('Payment verified via Cashfree webhook for order:', txn.order_id)
    } else if (eventType === 'PAYMENT_FAILED_WEBHOOK' || event.data?.payment?.payment_status === 'FAILED') {
      const cfOrderId = event.data?.order?.order_id

      if (cfOrderId) {
        const { data: txn } = await supabase
          .from('payment_transactions')
          .select('id, order_id')
          .eq('gateway', 'cashfree')
          .or(`gateway_order_id.eq.${cfOrderId}`)
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
    console.error('Cashfree webhook error:', error)
    return new Response('Internal error', { status: 500 })
  }
})
