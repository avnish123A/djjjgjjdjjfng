import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/format';
import { z } from 'zod';

const couponCodeSchema = z.string().trim().min(1, 'Please enter a coupon code').max(100, 'Coupon code is too long').transform(code => code.toUpperCase());

/** Shared client eligibility check; order creation remains the authoritative validator. */
export async function validateCheckoutCoupon(input: string, subtotal: number) {
  const parsed = couponCodeSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || 'Invalid coupon code');
  const { data, error } = await supabase.from('coupons').select('*').eq('code', parsed.data).eq('is_active', true).maybeSingle();
  if (error) throw new Error('Could not check this coupon. Please try again.');
  if (!data) throw new Error('Invalid coupon code');
  if (data.expiry_date && new Date(data.expiry_date) < new Date()) throw new Error('This coupon has expired');
  if (subtotal < Number(data.min_order)) throw new Error(`Minimum order of ${formatPrice(Number(data.min_order))} required for this coupon`);
  return { code: data.code, discount: Number(data.discount), minOrder: Number(data.min_order) };
}