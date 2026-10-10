/**
 * Pure, environment-neutral order email eligibility rule.
 * No Deno globals, network calls or server dependencies — safe to import
 * from both Edge Functions and client-side unit tests.
 */

/** Is the order in a state where a confirmation email is legitimate? */
export function isConfirmable(order: { payment_method: string; payment_status: string; order_status: string }) {
  if (order.order_status === 'cancelled') return false
  if (order.payment_method === 'cod') return true
  return order.payment_status === 'paid'
}
