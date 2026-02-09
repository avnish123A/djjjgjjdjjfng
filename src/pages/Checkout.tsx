import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Truck, Lock, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Jammu & Kashmir', 'Ladakh',
];

const paymentOptions = [
  { id: 'cod' as const, label: 'Cash on Delivery', desc: 'Pay when you receive', icon: Banknote },
  { id: 'razorpay' as const, label: 'Razorpay', desc: 'UPI, Cards, Net Banking, Wallets', icon: CreditCard },
  { id: 'cashfree' as const, label: 'Cashfree', desc: 'UPI, Cards, Net Banking, EMI', icon: CreditCard },
];

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay' | 'cashfree'>('cod');

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', address2: '', city: '', state: '', pincode: '',
  });

  const shipping = totalPrice >= 999 ? 0 : 99;
  const total = totalPrice + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    setIsSubmitting(true);
    try {
      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
      const { error: orderError } = await supabase.functions.invoke('create-order', {
        body: {
          orderNumber,
          customer: { name: form.name, email: form.email, phone: form.phone },
          shippingAddress: { address: form.address, address2: form.address2, city: form.city, state: form.state, pincode: form.pincode },
          items: items.map(item => ({ productId: item.id, title: item.name, price: item.price, quantity: item.quantity, image: item.image })),
          paymentMethod, subtotal: totalPrice, shipping, discount: 0, total,
        },
      });
      if (orderError) throw orderError;
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success?order=${orderNumber}`);
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </main>
    );
  }

  const inputCls = "w-full px-4 py-3 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all";

  return (
    <main className="min-h-screen bg-secondary/30">
      {/* Simplified Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            LUXE<span className="text-accent">.</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/cart" className="hover:text-foreground">Cart</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-10">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left - Forms */}
            <div className="lg:col-span-7 space-y-6">
              {/* Contact */}
              <section className="bg-card border border-border rounded-xl p-5 lg:p-6">
                <h2 className="font-bold text-base mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required className={inputCls} placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputCls} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Phone *</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className={inputCls} placeholder="+91 98765 43210" />
                  </div>
                </div>
              </section>

              {/* Shipping */}
              <section className="bg-card border border-border rounded-xl p-5 lg:p-6">
                <h2 className="font-bold text-base mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Address Line 1 *</label>
                    <input type="text" name="address" value={form.address} onChange={handleChange} required className={inputCls} placeholder="House/Flat no., Building, Street" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Address Line 2</label>
                    <input type="text" name="address2" value={form.address2} onChange={handleChange} className={inputCls} placeholder="Landmark, Area (optional)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">City *</label>
                    <input type="text" name="city" value={form.city} onChange={handleChange} required className={inputCls} placeholder="City" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">PIN Code *</label>
                    <input type="text" name="pincode" value={form.pincode} onChange={handleChange} required maxLength={6} className={inputCls} placeholder="400001" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">State *</label>
                    <select name="state" value={form.state} onChange={handleChange} required className={inputCls}>
                      <option value="">Select State</option>
                      {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section className="bg-card border border-border rounded-xl p-5 lg:p-6">
                <h2 className="font-bold text-base mb-4">Payment Method</h2>
                <div className="space-y-2.5">
                  {paymentOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                        paymentMethod === opt.id
                          ? 'border-accent bg-accent/5 ring-1 ring-accent/20'
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={opt.id}
                        checked={paymentMethod === opt.id}
                        onChange={() => setPaymentMethod(opt.id)}
                        className="accent-accent w-4 h-4"
                      />
                      <opt.icon className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            {/* Right - Summary */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 bg-card border border-border rounded-xl p-5 lg:p-6 space-y-4">
                <h2 className="font-bold text-base">Order Summary</h2>

                <div className="space-y-3 max-h-[280px] overflow-y-auto scrollbar-hide">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 bg-muted-foreground text-card text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.brand}</p>
                      </div>
                      <span className="text-sm font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium">
                      {shipping === 0 ? <span className="text-success">FREE</span> : formatPrice(shipping)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-xl">{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Including all taxes</p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                      Placing Order...
                    </span>
                  ) : paymentMethod === 'cod' ? 'Place Order (COD)' : 'Proceed to Pay'}
                </Button>

                <p className="text-[11px] text-center text-muted-foreground">
                  By placing your order, you agree to our{' '}
                  <Link to="/policies/terms" className="underline">Terms</Link> and{' '}
                  <Link to="/policies/privacy" className="underline">Privacy Policy</Link>.
                </p>

                <div className="flex items-center justify-center gap-4 pt-2 border-t border-border">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span>SSL Secure</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Safe Checkout</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Truck className="h-3 w-3" />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
