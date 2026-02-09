import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Truck, Lock } from 'lucide-react';
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

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay' | 'cashfree'>('cod');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
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

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

      const { data: order, error: orderError } = await supabase.functions.invoke('create-order', {
        body: {
          orderNumber,
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
          },
          shippingAddress: {
            address: form.address,
            address2: form.address2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          items: items.map(item => ({
            productId: item.id,
            title: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          paymentMethod,
          subtotal: totalPrice,
          shipping,
          discount: 0,
          total,
        },
      });

      if (orderError) throw orderError;

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success?order=${orderNumber}`);
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button variant="accent" asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/cart" className="hover:text-foreground transition-colors">Cart</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Checkout</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <h1 className="text-2xl lg:text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <section className="border border-border rounded-xl p-6">
                <h2 className="font-bold text-lg mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="border border-border rounded-xl p-6">
                <h2 className="font-bold text-lg mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Address Line 1 *</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                      placeholder="House/Flat no., Street name"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Address Line 2</label>
                    <input
                      type="text"
                      name="address2"
                      value={form.address2}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                      placeholder="Landmark, Area (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                      maxLength={6}
                      className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                      placeholder="400001"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">State *</label>
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                    >
                      <option value="">Select State</option>
                      {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="border border-border rounded-xl p-6">
                <h2 className="font-bold text-lg mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/5">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-accent"
                    />
                    <div>
                      <p className="text-sm font-medium">Cash on Delivery (COD)</p>
                      <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/5">
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="accent-accent"
                    />
                    <div>
                      <p className="text-sm font-medium">Razorpay</p>
                      <p className="text-xs text-muted-foreground">UPI, Cards, Net Banking, Wallets</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/5">
                    <input
                      type="radio"
                      name="payment"
                      value="cashfree"
                      checked={paymentMethod === 'cashfree'}
                      onChange={() => setPaymentMethod('cashfree')}
                      className="accent-accent"
                    />
                    <div>
                      <p className="text-sm font-medium">Cashfree</p>
                      <p className="text-xs text-muted-foreground">UPI, Cards, Net Banking, EMI</p>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            {/* Right - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 border border-border rounded-xl p-6 space-y-4">
                <h2 className="font-bold text-lg">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
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
                      {shipping === 0 ? <span className="text-success">Free</span> : formatPrice(shipping)}
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
                  variant="accent"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Placing Order...' : paymentMethod === 'cod' ? 'Place Order (COD)' : 'Proceed to Pay'}
                </Button>

                {/* Trust indicators */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span>SSL Secure</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Safe Checkout</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
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
