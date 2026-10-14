import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ChevronRight, Lock, ShieldCheck, Truck, ChevronDown, Calendar, X, Tag } from 'lucide-react';
import { PurchaseParcel } from '@/components/brand/PurchaseParcel';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';
import { supabase } from '@/integrations/supabase/client';

const Cart = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, appliedCoupon, discountAmount, applyCoupon, removeCoupon } = useCart();
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const shipping = totalPrice >= 999 ? 0 : 99;
  const total = totalPrice + shipping - discountAmount;
  const freeShippingRemaining = 999 - totalPrice;

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) { toast.error('Please enter a coupon code'); return; }

    setCouponLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) { toast.error('Invalid coupon code'); return; }

      // Check expiry
      if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
        toast.error('This coupon has expired');
        return;
      }

      // Check min order
      if (totalPrice < Number(data.min_order)) {
        toast.error(`Minimum order of ${formatPrice(Number(data.min_order))} required for this coupon`);
        return;
      }

      applyCoupon({
        code: data.code,
        discount: Number(data.discount),
        minOrder: Number(data.min_order),
      });
      toast.success(`Coupon "${data.code}" applied! ${Number(data.discount)}% off`);
      setCouponCode('');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-md mx-auto text-center">
            <PurchaseParcel />
            <h1 className="text-2xl font-bold mb-3 tracking-tight">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8 text-sm">
              Looks like you haven't added any items yet.
            </p>
            <Button asChild className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-8">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      {/* Free Shipping Progress */}
      {freeShippingRemaining > 0 && totalPrice > 0 && (
        <div className="bg-secondary">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Add {formatPrice(freeShippingRemaining)} more for <span className="text-success font-semibold">FREE delivery</span>
                </p>
                <div className="mt-1.5 h-1 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totalPrice / 999) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 lg:py-10">
        <h1 className="text-xl lg:text-2xl font-bold mb-8 tracking-tight">
          My cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-4 p-4 bg-card border border-border rounded-2xl"
                >
                  <Link to={`/product/${item.id}`} className="shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-secondary">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-[0.1em]">{item.brand}</p>
                        <Link
                          to={`/product/${item.id}`}
                          className="font-medium text-sm hover:text-accent transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        {item.variantSelections && Object.keys(item.variantSelections).length > 0 && (
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {Object.entries(item.variantSelections).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <Button variant="ghost"
                          onClick={() => { removeItem(item.variantKey || item.id); toast('Item removed'); }}
                          className="min-h-11 min-w-11 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-3 mt-3">
                      <div className="inline-flex items-center border border-border rounded-lg">
                        <Button variant="ghost"
                          onClick={() => updateQuantity(item.variantKey || item.id, item.quantity - 1)}
                          className="h-11 w-11 flex items-center justify-center hover:bg-secondary transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-2 text-sm font-semibold tabular-nums">{item.quantity}</span>
                        <Button variant="ghost"
                          onClick={() => updateQuantity(item.variantKey || item.id, item.quantity + 1)}
                          className="h-11 w-11 flex items-center justify-center hover:bg-secondary transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-card border border-border shadow-soft rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-lg">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                {/* Applied Coupon */}
                {appliedCoupon && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-success" />
                      <span className="text-success font-medium">{appliedCoupon.code} (-{appliedCoupon.discount}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-success">-{formatPrice(discountAmount)}</span>
                      <Button variant="ghost" onClick={removeCoupon} className="p-0.5 text-muted-foreground hover:text-destructive">
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Collapsible Coupon */}
                {!appliedCoupon && (
                  <div className="pt-1">
                    <Button variant="ghost"
                      onClick={() => setCouponOpen(!couponOpen)}
                      className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>Have a coupon code?</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${couponOpen ? 'rotate-180' : ''}`} />
                    </Button>
                    <AnimatePresence>
                      {couponOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex gap-2 pt-2">
                            <input
                              type="text"
                              aria-label="Coupon code" placeholder="Coupon code"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                              className="min-w-0 w-0 flex-1 px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 uppercase"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-4"
                              onClick={handleApplyCoupon}
                              disabled={couponLoading}
                            >
                              {couponLoading ? '...' : 'Apply'}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-xl">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Including all taxes</p>
              </div>

              {/* Estimated Delivery */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background rounded-lg px-3 py-2">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>Delivery information will be confirmed for your order.</span>
              </div>

              <Button asChild size="lg" className="w-full gap-2 h-12 text-base font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/checkout">
                  Proceed to checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              {/* Trust */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>SSL Secure</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Safe Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
