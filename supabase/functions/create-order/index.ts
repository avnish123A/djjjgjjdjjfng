import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple in-memory rate limiter (per isolate)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = 10 // max 10 orders per IP per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

// Input validation schema
const orderSchema = z.object({
  orderNumber: z.string().min(1).max(50),
  customer: z.object({
    name: z.string().trim().min(1).max(200),
    email: z.string().trim().email().max(255),
    phone: z.string().regex(/^[\d\s\+\-\(\)]+$/).min(10).max(20),
  }),
  shippingAddress: z.object({
    address: z.string().trim().min(1).max(500),
    address2: z.string().max(500).optional().default(''),
    city: z.string().trim().min(1).max(100),
    state: z.string().trim().min(1).max(100),
    pincode: z.string().regex(/^\d{6}$/, 'Invalid PIN code'),
  }),
  items: z.array(z.object({
    productId: z.string().uuid().nullable().optional(),
    title: z.string().min(1).max(500),
    price: z.number().min(0).max(999999),
    quantity: z.number().int().min(1).max(100),
    image: z.string().max(2000).optional().default(''),
    color: z.string().max(50).nullable().optional(),
    size: z.string().max(50).nullable().optional(),
  })).min(1).max(50),
  paymentMethod: z.enum(['cod', 'razorpay', 'cashfree']),
  subtotal: z.number().min(0).max(9999999),
  shipping: z.number().min(0).max(9999),
  discount: z.number().min(0).max(9999999).optional().default(0),
  total: z.number().min(0).max(9999999),
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Rate limiting by IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const rawBody = await req.json()

    // Validate input with Zod
    const parseResult = orderSchema.safeParse(rawBody)
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: parseResult.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { orderNumber, customer, shippingAddress, items, paymentMethod, subtotal, shipping, discount, total } = parseResult.data

    // Server-side price verification against database
    for (const item of items) {
      if (item.productId) {
        const { data: product } = await supabase
          .from('products')
          .select('price, stock, is_active')
          .eq('id', item.productId)
          .single()

        if (!product) {
          return new Response(
            JSON.stringify({ error: `Product not found: ${item.title}` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        if (!product.is_active) {
          return new Response(
            JSON.stringify({ error: `Product is no longer available: ${item.title}` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        if (Math.abs(Number(product.price) - item.price) > 0.01) {
          return new Response(
            JSON.stringify({ error: `Price mismatch for ${item.title}. Please refresh and try again.` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        if (product.stock < item.quantity) {
          return new Response(
            JSON.stringify({ error: `Insufficient stock for ${item.title}. Only ${product.stock} available.` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
    }

    // Verify total calculation server-side
    const expectedTotal = subtotal + shipping - discount
    if (Math.abs(expectedTotal - total) > 0.01) {
      return new Response(
        JSON.stringify({ error: 'Total calculation mismatch. Please refresh and try again.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify subtotal matches sum of item prices
    const calculatedSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    if (Math.abs(calculatedSubtotal - subtotal) > 0.01) {
      return new Response(
        JSON.stringify({ error: 'Subtotal mismatch. Please refresh and try again.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate server-side order number (don't trust client)
    const serverOrderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Find or create customer
    let customerId: string | null = null
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id, total_orders, total_spent')
      .eq('email', customer.email)
      .maybeSingle()

    if (existingCustomer) {
      customerId = existingCustomer.id
      await supabase
        .from('customers')
        .update({
          total_orders: existingCustomer.total_orders + 1,
          total_spent: Number(existingCustomer.total_spent) + total,
        })
        .eq('id', customerId)
    } else {
      const { data: newCustomer, error: custError } = await supabase
        .from('customers')
        .insert({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
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
        order_number: serverOrderNumber,
        customer_id: customerId,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        payment_status: 'pending',
        order_status: 'placed',
        subtotal,
        shipping,
        discount,
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
    const orderItems = items.map((item) => ({
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
        orderNumber: serverOrderNumber,
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
