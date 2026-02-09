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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body = await req.json()
    const {
      orderNumber,
      customer,
      shippingAddress,
      items,
      paymentMethod,
      subtotal,
      shipping,
      discount,
      total,
    } = body

    // Validate required fields
    if (!orderNumber || !customer?.name || !customer?.email || !items?.length) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Find or create customer
    let customerId: string | null = null
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', customer.email)
      .maybeSingle()

    if (existingCustomer) {
      customerId = existingCustomer.id
      await supabase
        .from('customers')
        .update({
          total_orders: (existingCustomer as any).total_orders + 1,
          total_spent: (existingCustomer as any).total_spent + total,
        })
        .eq('id', customerId)
    } else {
      const { data: newCustomer, error: custError } = await supabase
        .from('customers')
        .insert({
          name: customer.name,
          email: customer.email,
          phone: customer.phone || '',
          total_orders: 1,
          total_spent: total,
        })
        .select('id')
        .single()

      if (custError) {
        console.error('Customer creation error:', custError)
      } else {
        customerId = newCustomer.id
      }
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: customerId,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone || '',
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
        order_status: 'placed',
        subtotal,
        shipping,
        discount: discount || 0,
        total,
      })
      .select('id')
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId || null,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      image: item.image || '',
      color: item.color || null,
      size: item.size || null,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items error:', itemsError)
    }

    // Update product stock
    for (const item of items) {
      if (item.productId) {
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.productId)
          .single()

        if (product) {
          await supabase
            .from('products')
            .update({ stock: Math.max(0, product.stock - item.quantity) })
            .eq('id', item.productId)
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        orderNumber,
      }),
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
