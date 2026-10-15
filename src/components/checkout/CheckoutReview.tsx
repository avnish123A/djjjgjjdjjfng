import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Minus, Plus, Trash2, Tag, ChevronDown, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/format';
import { validateCheckoutCoupon } from '@/lib/checkout-coupon';

export function CheckoutReview({ locked, onEdit }: { locked: boolean; onEdit: () => void }) {
  const { items, totalPrice, updateQuantity, removeItem, appliedCoupon, discountAmount, applyCoupon, removeCoupon } = useCart();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const ids = [...new Set(items.map(item => item.id))].sort();
  const { data: catalog = [] } = useQuery({
    queryKey: ['checkout-review-products', ids],
    queryFn: async () => {
      const { data, error: fetchError } = await supabase.from('products').select('id, price, original_price, stock, track_inventory').in('id', ids);
      if (fetchError) throw fetchError;
      return data || [];
    },
    enabled: ids.length > 0,
    staleTime: 30_000,
  });
  async function apply() {
    if (loading || locked) return;
    setLoading(true); setError('');
    try { applyCoupon(await validateCheckoutCoupon(code, totalPrice)); setCode(''); onEdit(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not apply coupon.'); }
    finally { setLoading(false); }
  }
  return <>
    {discountAmount > 0 && <motion.div layout={!reduced} className="checkout-savings rounded-lg border border-success/20 bg-success/5 p-3 text-success" role="status">
      <div className="flex items-center gap-2 text-sm font-semibold"><Tag className="h-4 w-4" />You’re saving {formatPrice(discountAmount)}</div>
      <motion.div key={discountAmount} initial={{ scaleX: reduced ? 1 : 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduced ? 0 : .2 }} className="mt-2 h-0.5 origin-left bg-success" />
    </motion.div>}
    <section className="checkout-section" aria-labelledby="review-title">
      <div className="flex items-baseline justify-between gap-2 mb-4"><h2 id="review-title" className="text-lg font-bold">Review your items</h2><span className="text-xs text-muted-foreground">{items.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>
      <motion.ul layout={!reduced} className="divide-y divide-border">
        <AnimatePresence initial={false}>
          {items.map(item => {
            const key = item.variantKey || item.id;
            const product = catalog.find(p => p.id === item.id);
            const max = product?.track_inventory !== false && product ? Math.min(99, product.stock) : 99;
            // A base compare price cannot imply savings on an unknown variant price.
            const original = !item.variantKey && product && Number(product.price) === item.price && Number(product.original_price) > item.price ? Number(product.original_price) : null;
            return <motion.li layout={!reduced} key={key} exit={{ opacity: 0, height: 0 }} transition={{ duration: reduced ? 0 : .2 }} className="flex gap-3 py-4 first:pt-0 last:pb-0 overflow-hidden">
              <img src={item.image} alt={item.name} className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-lg bg-secondary object-contain" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-1"><h3 className="text-sm font-semibold leading-5 break-words flex-1">{item.name}</h3><Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground" disabled={locked} aria-label={`Remove ${item.name}`} onClick={() => { onEdit(); removeItem(key); }}><Trash2 /></Button></div>
                {item.variantSelections && <p className="text-xs text-muted-foreground break-words mb-2">{Object.entries(item.variantSelections).map(([label, value]) => `${label}: ${value}`).join(' · ')}</p>}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div><motion.span key={item.quantity} initial={{ opacity: reduced ? 1 : .5 }} animate={{ opacity: 1 }} className="text-sm font-bold tabular-nums" transition={{ duration: .18 }}>{formatPrice(item.price * item.quantity)}</motion.span>{original && <span className="block text-xs text-muted-foreground line-through">{formatPrice(original * item.quantity)}</span>}</div>
                  <div className="inline-flex h-10 items-center rounded-lg border border-border shrink-0">
                    <Button type="button" variant="ghost" size="icon" className="h-10 w-10" disabled={locked || item.quantity <= 1} aria-label={`Decrease quantity of ${item.name}`} onClick={() => { onEdit(); updateQuantity(key, item.quantity - 1); }}><Minus /></Button>
                    <span className="w-6 text-center text-sm font-semibold tabular-nums" aria-live="polite">{item.quantity}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-10 w-10" disabled={locked || item.quantity >= max} aria-label={`Increase quantity of ${item.name}`} onClick={() => { onEdit(); updateQuantity(key, item.quantity + 1); }}><Plus /></Button>
                  </div>
                </div>
              </div>
            </motion.li>;
          })}
        </AnimatePresence>
      </motion.ul>
    </section>
    <section className="checkout-section">
      {appliedCoupon ? <div className="flex items-center justify-between gap-2"><div className="min-w-0"><p className="flex items-center gap-2 text-sm font-semibold break-all"><Tag className="h-4 w-4 shrink-0 text-success" />{appliedCoupon.code}</p><p className="text-xs text-success mt-1">{formatPrice(discountAmount)} coupon discount</p></div><Button type="button" variant="ghost" size="icon" disabled={locked} aria-label="Remove coupon" onClick={() => { removeCoupon(); onEdit(); }}><X /></Button></div> : <>
        <Button type="button" variant="ghost" className="w-full p-0 h-10 justify-between" aria-expanded={open} aria-controls="checkout-coupon" onClick={() => setOpen(!open)}><span className="flex items-center gap-2"><Tag />Apply coupon</span><ChevronDown className={open ? 'rotate-180' : ''} /></Button>
        <AnimatePresence initial={false}>{open && <motion.div id="checkout-coupon" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : .2 }} className="overflow-hidden">
          <label htmlFor="coupon-code" className="text-xs text-muted-foreground block mt-3 mb-2">Coupon code</label>
          <div className="flex gap-2"><input id="coupon-code" maxLength={100} value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); void apply(); } }} className="w-full min-w-0 h-11 rounded-lg border border-input bg-background px-3 text-base" autoCapitalize="characters" aria-describedby={error ? 'coupon-error' : undefined} /><Button type="button" disabled={loading || locked} onClick={apply} className="h-11">{loading ? <Loader2 className="animate-spin" aria-label="Checking coupon" /> : 'Apply'}</Button></div>
          {error && <p id="coupon-error" role="alert" className="text-xs text-destructive mt-2">{error}</p>}
        </motion.div>}</AnimatePresence>
      </>}
    </section>
  </>;
}