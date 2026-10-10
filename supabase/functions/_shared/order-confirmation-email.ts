/**
 * CartZebra order confirmation email (server-side only).
 *
 * Required Edge Function secrets:
 *   RESEND_API_KEY  – Resend API key (never exposed to the browser)
 * Required configuration:
 *   EMAIL_FROM      – sender, e.g. `CartZebra <orders@cartzebra.com>` (domain must be verified in Resend)
 *   SITE_URL        – public storefront URL used for the Track My Order link
 *
 * All content is read from trusted database rows; nothing comes from the browser.
 * Idempotency: one row per (order_id, email_type) in public.email_events.
 * Email failures are recorded and never change order or payment state.
 */

import { validContactEmail, validContactPhone } from './contact-validation.ts'
import { DELIVERY_ESTIMATE_TEXT } from './delivery-policy.ts'

export const ORDER_CONFIRMATION = 'ORDER_CONFIRMATION'
export const ORDER_CONFIRMATION_TEST = 'ORDER_CONFIRMATION_TEST'

export type EmailConfig =
  | { ok: true; apiKey: string; from: string; siteUrl: string }
  | { ok: false; error: string; missing: string[] }

/** Reads Resend config from Edge Function secrets. Never returns secret values in errors. */
export function getEmailConfig(): EmailConfig {
  const resendApiKey = (Deno.env.get('RESEND_API_KEY') || '').trim()
  const emailFrom = (Deno.env.get('EMAIL_FROM') || '').trim()
  const siteUrl = (Deno.env.get('SITE_URL') || '').trim()
  const missing: string[] = []
  const errors: string[] = []
  if (!resendApiKey) { missing.push('RESEND_API_KEY'); errors.push('Resend API key is not configured') }
  if (!emailFrom) { missing.push('EMAIL_FROM'); errors.push('Email sender is not configured') }
  if (!siteUrl) { missing.push('SITE_URL'); errors.push('Site URL is not configured') }
  if (missing.length) return { ok: false, error: errors.join('; '), missing }
  return { ok: true, apiKey: resendApiKey, from: emailFrom, siteUrl: siteUrl.replace(/\/+$/, '') }
}

/** Single Resend sender used by order confirmations and admin test emails. */
export async function sendViaResend(
  cfg: { apiKey: string; from: string },
  msg: { to: string; subject: string; html: string; idempotencyKey?: string },
): Promise<{ ok: true; messageId: string | null } | { ok: false; error: string }> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  let res: Response
  try {
    const headers: Record<string, string> = { Authorization: `Bearer ${cfg.apiKey}`, 'Content-Type': 'application/json' }
    if (msg.idempotencyKey) headers['Idempotency-Key'] = msg.idempotencyKey
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers,
      body: JSON.stringify({ from: cfg.from, to: [msg.to], subject: msg.subject, html: msg.html }),
      signal: controller.signal,
    })
  } catch (e) {
    return { ok: false, error: `Network error contacting Resend: ${(e as Error).message}` }
  } finally {
    clearTimeout(timeout)
  }
  const bodyText = await res.text()
  if (!res.ok) {
    let m = bodyText
    try { m = JSON.parse(bodyText)?.message || bodyText } catch { /* keep text */ }
    return { ok: false, error: `Resend ${res.status}: ${String(m).slice(0, 300)}` }
  }
  let messageId: string | null = null
  try { messageId = JSON.parse(bodyText)?.id ?? null } catch { /* ignore */ }
  return { ok: true, messageId }
}
const STALE_PENDING_MS = 2 * 60 * 1000

export type SendResult =
  | { status: 'sent'; messageId: string | null }
  | { status: 'skipped'; reason: string }
  | { status: 'failed'; error: string }

const esc = (v: unknown): string =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c))

const inr = (n: unknown) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`

const safeUrl = (u: unknown): string | null => {
  const s = String(u ?? '')
  return /^https:\/\/[^\s"'<>]+$/i.test(s) ? s : null
}

const METHOD_LABEL: Record<string, string> = { cod: 'Cash on Delivery', razorpay: 'Online (Razorpay)', cashfree: 'Online (Cashfree)' }

export { isConfirmable } from './order-email-eligibility.ts'
import { isConfirmable } from './order-email-eligibility.ts'

/**
 * Sends (at most once successfully) the order confirmation email.
 * `mode: 'auto'` – called from trusted order/payment paths.
 * `mode: 'retry'` – admin retry; only re-sends when the last attempt failed.
 * `mode: 'test'` – admin test send to the order's own address, logged separately.
 */
export async function sendOrderConfirmation(
  supabase: any,
  orderId: string,
  mode: 'auto' | 'retry' | 'test' = 'auto',
): Promise<SendResult> {
  const emailType = mode === 'test' ? ORDER_CONFIRMATION_TEST : ORDER_CONFIRMATION
  try {
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('id, order_number, customer_name, customer_email, customer_phone, subtotal, shipping, discount, total, cod_extra_charge, shipping_address, payment_method, payment_status, order_status, order_date')
      .eq('id', orderId)
      .maybeSingle()
    if (orderErr || !order) return { status: 'failed', error: 'Order not found' }
    if (!isConfirmable(order)) return { status: 'skipped', reason: 'Order is not confirmed (payment not verified or cancelled)' }

    const recipient = String(order.customer_email || '').trim().toLowerCase()
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(recipient)) return { status: 'failed', error: 'Order has no valid email address' }

    // ---- Claim the send slot (idempotent) ----
    const claimed = await claim(supabase, orderId, emailType, recipient, mode)
    if (!claimed.ok) return { status: 'skipped', reason: claimed.reason }
    const eventId = claimed.id
    const attempt = claimed.attempt

    const fail = async (error: string): Promise<SendResult> => {
      await supabase.from('email_events').update({ status: 'failed', error_message: error.slice(0, 500) }).eq('id', eventId)
      return { status: 'failed', error }
    }

    const cfg = getEmailConfig()
    if (!cfg.ok) return await fail(cfg.error)

    const [{ data: items }, { data: settingsRows }] = await Promise.all([
      supabase.from('order_items').select('title, image, quantity, price, size, color').eq('order_id', orderId),
      supabase.from('site_settings').select('key, value').in('key', ['contact_email', 'contact_phone', 'contact_business_hours']),
    ])
    const settings: Record<string, string> = {}
    for (const r of settingsRows || []) settings[r.key] = r.value

    const html = renderHtml(order, items || [], settings, cfg.siteUrl)
    const subject = `${mode === 'test' ? '[Test] ' : ''}Your CartZebra order #${order.order_number} is confirmed`

    const sent = await sendViaResend(cfg, { to: recipient, subject, html, idempotencyKey: `${eventId}-${attempt}` })
    if (!sent.ok) {
      console.error(`Resend failed for order ${orderId}: ${sent.error}`)
      return await fail(sent.error)
    }
    const messageId = sent.messageId

    await supabase.from('email_events').update({
      status: 'sent', provider_message_id: messageId, error_message: null, sent_at: new Date().toISOString(),
    }).eq('id', eventId)
    return { status: 'sent', messageId }
  } catch (e) {
    console.error('sendOrderConfirmation error:', e)
    return { status: 'failed', error: 'Unexpected error while sending email' }
  }
}

async function claim(supabase: any, orderId: string, emailType: string, recipient: string, mode: string)
  : Promise<{ ok: true; id: string; attempt: number } | { ok: false; reason: string }> {
  const { data: inserted } = await supabase
    .from('email_events')
    .insert({ order_id: orderId, email_type: emailType, recipient, status: 'pending', provider: 'resend', attempt_count: 1 })
    .select('id, attempt_count')
    .maybeSingle()
  if (inserted) return { ok: true, id: inserted.id, attempt: inserted.attempt_count }

  const { data: existing } = await supabase
    .from('email_events')
    .select('id, status, attempt_count, updated_at')
    .eq('order_id', orderId).eq('email_type', emailType).maybeSingle()
  if (!existing) return { ok: false, reason: 'Could not record email event' }

  if (existing.status === 'sent' && mode !== 'test') return { ok: false, reason: 'Confirmation email already sent' }
  if (existing.status === 'pending' && Date.now() - new Date(existing.updated_at).getTime() < STALE_PENDING_MS) {
    return { ok: false, reason: 'A send is already in progress' }
  }
  // Automatic paths never re-send after a failure; only admin retry/test can.
  if (existing.status === 'failed' && mode === 'auto') return { ok: false, reason: 'Previous attempt failed; admin retry required' }

  // Compare-and-swap on status + attempt_count so concurrent retries cannot both win
  const { data: updated } = await supabase
    .from('email_events')
    .update({ status: 'pending', recipient, error_message: null, attempt_count: existing.attempt_count + 1 })
    .eq('id', existing.id).eq('status', existing.status).eq('attempt_count', existing.attempt_count)
    .select('id, attempt_count')
  if (!updated || updated.length === 0) return { ok: false, reason: 'A send is already in progress' }
  return { ok: true, id: updated[0].id, attempt: updated[0].attempt_count }
}

export function renderHtml(order: any, items: any[], settings: Record<string, string>, siteUrl: string) {
  const isCod = order.payment_method === 'cod'
  const addr = order.shipping_address || {}
  const date = new Date(order.order_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })
  const trackUrl = `${siteUrl}/track-order?order=${encodeURIComponent(order.order_number)}`
  const status = String(order.order_status || 'placed').replace(/_/g, ' ')
  const firstName = String(order.customer_name || '').trim().split(/\s+/)[0] || 'there'

  const itemRows = items.map((it) => {
    const img = safeUrl(it.image)
    const variant = [it.size ? `Size: ${esc(it.size)}` : '', it.color ? `Colour: ${esc(it.color)}` : ''].filter(Boolean).join(' · ')
    const line = Number(it.price) * Number(it.quantity)
    return `<tr>
<td style="padding:14px 0;border-bottom:1px solid #E4E1F0;width:64px;vertical-align:top">${img
      ? `<img src="${esc(img)}" width="56" height="56" alt="${esc(it.title)}" style="display:block;width:56px;height:56px;border-radius:8px;object-fit:cover;background:#F7F5F0">`
      : `<div style="width:56px;height:56px;border-radius:8px;background:#F7F5F0"></div>`}</td>
<td style="padding:14px 12px;border-bottom:1px solid #E4E1F0;vertical-align:top;font-size:14px;color:#0B1020">
<div style="font-weight:600">${esc(it.title)}</div>
${variant ? `<div style="font-size:12px;color:#596176;margin-top:3px">${variant}</div>` : ''}
<div style="font-size:12px;color:#596176;margin-top:3px">Qty ${esc(it.quantity)} × ${esc(inr(it.price))}</div></td>
<td style="padding:14px 0;border-bottom:1px solid #E4E1F0;vertical-align:top;text-align:right;font-size:14px;font-weight:600;color:#0B1020;white-space:nowrap">${esc(inr(line))}</td>
</tr>`
  }).join('')

  const row = (label: string, value: string, strong = false) =>
    `<tr><td style="padding:5px 0;font-size:${strong ? 16 : 14}px;color:${strong ? '#0B1020' : '#596176'};${strong ? 'font-weight:700' : ''}">${label}</td><td style="padding:5px 0;text-align:right;font-size:${strong ? 16 : 14}px;color:#0B1020;${strong ? 'font-weight:700' : ''}">${value}</td></tr>`

  const codFee = Number(order.cod_extra_charge || 0)
  const discount = Number(order.discount || 0)
  const totals = [
    row('Subtotal', esc(inr(order.subtotal))),
    discount > 0 ? row('Discount', `−${esc(inr(discount))}`) : '',
    row('Shipping', Number(order.shipping) === 0 ? 'Free' : esc(inr(order.shipping))),
    isCod && codFee > 0 ? row('COD fee', esc(inr(codFee))) : '',
    `<tr><td colspan="2" style="border-top:1px solid #E4E1F0;padding-top:6px"></td></tr>`,
    row('Total', esc(inr(order.total)), true),
  ].join('')

  const paymentCopy = isCod
    ? `Your order is confirmed. Please keep <strong>${esc(inr(order.total))}</strong> ready when your order arrives.`
    : 'Payment received successfully. Your CartZebra order is confirmed.'

  const addrLines = [
    addr.address || addr.address_line1 || addr.street,
    addr.address2 || addr.address_line2,
    [addr.city, addr.state].filter(Boolean).join(', '),
    addr.pincode || addr.postal_code ? `PIN ${addr.pincode || addr.postal_code}` : '',
  ].filter(Boolean).map((l) => esc(l)).join('<br>')

  // Malformed (e.g. concatenated) contact values are omitted, never guessed at.
  const supportEmail = validContactEmail(settings.contact_email)
  const supportPhone = validContactPhone(settings.contact_phone)
  const supportBits: string[] = []
  if (supportEmail) supportBits.push(`Email <a href="mailto:${esc(supportEmail)}" style="color:#0B1020">${esc(supportEmail)}</a>`)
  if (supportPhone) supportBits.push(`Call ${esc(supportPhone)}`)
  const supportLine = supportBits.length ? supportBits.join(' · ') : `Visit <a href="${esc(siteUrl)}/contact" style="color:#0B1020">our contact page</a>`

  const label = (t: string) => `<div style="font-size:11px;color:#596176;margin-bottom:3px">${t}</div>`

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Order confirmed</title></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0B1020">
<div style="display:none;max-height:0;overflow:hidden">Order #${esc(order.order_number)} is confirmed. ${isCod ? 'Pay on delivery.' : 'Payment received.'}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5F0"><tr><td align="center" style="padding:24px 8px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #E4E1F0;border-radius:16px">
<tr><td style="background:#0B1020;border-radius:16px 16px 0 0;padding:22px 20px">
<span style="font-size:22px;font-weight:800;color:#FFFFFF;letter-spacing:0">Cart<span style="color:#B9B4FF">Zebra</span></span><br><span style="font-size:11px;color:#B9B4FF">Shop Smart. Discover More.</span>
</td></tr>
<tr><td style="padding:0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td height="5" width="45%" bgcolor="#6C63FF"></td><td height="5" width="35%" bgcolor="#B9B4FF"></td><td height="5" width="20%" bgcolor="#FF765F"></td></tr></table></td></tr>
<tr><td align="center" style="padding:12px 20px 0;background:#F7F5F0">
<!-- Real, verified publicly hosted static fallback. No GIF URL is configured. Text content remains usable with images disabled. -->
<img src="https://cartzebra.lovable.app/__l5e/assets-v1/f566c1f2-9c9e-4e63-9537-93978a6fc609/checkout-parcel.jpg" width="320" height="240" alt="A striped CartZebra parcel with indigo and coral ribbons" style="display:block;width:100%;max-width:320px;height:auto;border:0">
</td></tr>
<tr><td style="padding:24px 20px 8px">
<h1 style="margin:0 0 8px;font-size:24px;line-height:1.25;font-weight:700;color:#0B1020">Thanks for your order, ${esc(firstName)}!</h1>
<p style="margin:0 0 20px;font-size:15px;color:#596176">Your order has been successfully confirmed.</p>
<div style="background:#F4F3FF;border:1px solid #E4E1F0;border-radius:12px;padding:14px 16px;font-size:14px;color:#0B1020">${paymentCopy}</div>
</td></tr>
<tr><td style="padding:16px 20px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="padding:8px 0;width:50%;vertical-align:top">${label('Order')}<div style="font-size:14px;font-weight:600">#${esc(order.order_number)}</div></td>
<td style="padding:8px 0;width:50%;vertical-align:top">${label('Order date')}<div style="font-size:14px;font-weight:600">${esc(date)}</div></td>
</tr><tr>
<td style="padding:8px 0;vertical-align:top">${label('Payment')}<div style="font-size:14px;font-weight:600">${esc(METHOD_LABEL[order.payment_method] || order.payment_method)}</div></td>
<td style="padding:8px 0;vertical-align:top">${label('Status')}<div style="font-size:14px;font-weight:600;text-transform:capitalize">${esc(status)}</div></td>
</tr></table>
</td></tr>
<tr><td style="padding:8px 20px">
<h2 style="margin:0 0 4px;font-size:16px;font-weight:700">Order summary</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemRows}</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px">${totals}</table>
</td></tr>
<tr><td style="padding:20px 20px 8px">
<h2 style="margin:0 0 8px;font-size:16px;font-weight:700">Delivering to</h2>
<p style="margin:0;font-size:14px;line-height:1.6;color:#596176"><strong style="color:#0B1020">${esc(order.customer_name)}</strong><br>${addrLines}${order.customer_phone ? `<br>Phone: ${esc(order.customer_phone)}` : ''}</p>
<p style="margin:12px 0 0;font-size:12px;line-height:1.6;color:#596176">${esc(DELIVERY_ESTIMATE_TEXT)}. This is our usual delivery window; check Track Order for your confirmed delivery date when available.</p>
</td></tr>
<tr><td align="center" style="padding:20px">
<a href="${esc(trackUrl)}" style="display:inline-block;background:#0B1020;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:15px;padding:14px 32px;border-radius:12px">Track My Order</a>
<p style="margin:10px 0 0;font-size:12px;color:#596176">Use your order email and phone number to view live status.</p>
</td></tr>
<tr><td style="padding:20px 20px;border-top:1px solid #E4E1F0">
<h3 style="margin:0 0 6px;font-size:14px;font-weight:700">Need help with your order?</h3>
<p style="margin:0;font-size:13px;line-height:1.6;color:#596176">${supportLine}${settings.contact_business_hours ? `<br>${esc(settings.contact_business_hours)}` : ''}</p>
</td></tr>
<tr><td style="padding:16px 20px 24px;font-size:12px;color:#596176">CartZebra · Shop Smart. Discover More.<br>You received this email because you placed an order at CartZebra.</td></tr>
</table></td></tr></table></body></html>`
}
