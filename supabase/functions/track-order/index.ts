import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// Rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 10

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

// Mask email: j***n@example.com
function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (local.length <= 2) return `${local[0]}***@${domain}`
  return `${local[0]}***${local[local.length - 1]}@${domain}`
}

// Mask phone: +91 ****3210
function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return '****'
  return '****' + phone.slice(-4)
}

const trackSchema = z.object({
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(4).max(20),
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: 'Too many attempts. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const rawBody = await req.json()
    const parseResult = trackSchema.safeParse(rawBody)
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email and phone number.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { email, phone } = parseResult.data

    // Normalize phone - extract last 10 digits for matching
    const phoneDigits = phone.replace(/\D/g, '').slice(-10)

    // Find orders matching BOTH email AND phone (exact match)
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id, order_number, order_status, payment_status, payment_method,
        subtotal, shipping, discount, total,
        created_at, tracking_number, courier_name,
        customer_name, customer_email, customer_phone,
        order_items (
          id, title, price, quantity, image, color, size
        )
      `)
      .eq('customer_email', email)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Query error:', error)
      return new Response(
        JSON.stringify({ error: 'Something went wrong. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Filter by phone match (last 10 digits)
    const matched = (orders || []).filter(o => {
      const orderPhoneDigits = (o.customer_phone || '').replace(/\D/g, '').slice(-10)
      return orderPhoneDigits === phoneDigits
    })

    if (matched.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No orders found. Please check your email and phone number.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mask sensitive data before returning
    const sanitized = matched.map(o => ({
      id: o.id,
      order_number: o.order_number,
      order_status: o.order_status,
      payment_status: o.payment_status,
      payment_method: o.payment_method,
      subtotal: o.subtotal,
      shipping: o.shipping,
      discount: o.discount,
      total: o.total,
      created_at: o.created_at,
      tracking_number: o.tracking_number,
      courier_name: o.courier_name,
      customer_name: o.customer_name,
      customer_email: maskEmail(o.customer_email),
      customer_phone: maskPhone(o.customer_phone || ''),
      items: (o.order_items || []).map((item: any) => ({
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        color: item.color,
        size: item.size,
      })),
    }))

    return new Response(
      JSON.stringify({ orders: sanitized }),
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
