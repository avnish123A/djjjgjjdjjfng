import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Truck, Lock, CreditCard, Banknote, Check, Calendar, Tag, X, ArrowLeft, MapPin, User, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Jammu & Kashmir', 'Ladakh',
];

const paymentOptions = [
  { id: 'cod' as const, label: 'Cash on Delivery', desc: 'Pay when you receive your order', icon: Banknote, badge: 'No extra charge' },
  { id: 'razorpay' as const, label: 'Razorpay', desc: 'UPI, Cards, Net Banking, Wallets', icon: CreditCard, badge: 'Recommended' },
  { id: 'cashfree' as const, label: 'Cashfree', desc: 'UPI, Cards, Net Banking, EMI', icon: CreditCard, badge: null },
];

type Step = 'contact' | 'shipping' | 'payment';

const stepConfig: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: 'contact', label: 'Contact', icon: User },
  { key: 'shipping', label: 'Shipping', icon: MapPin },
  { key: 'payment', label: 'Payment', icon: CreditCard },
];

const Checkout = () => {
  const { items, totalPrice, clearCart, appliedCoupon, discountAmount, removeCoupon } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay' | 'cashfree'>('cod');
  const [currentStep, setCurrentStep] = useState<Step>('contact');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', address2: '', city: '', state: '', pincode: '',
  });

  const shipping = totalPrice >= 999 ? 0 : 99;
  const total = totalPrice + shipping - discountAmount;

  const stepIndex = stepConfig.findIndex(s => s.key === currentStep);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validateContact = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^[\d\s\+\-\(\)]{10,}$/.test(form.phone)) errs.phone = 'Invalid phone number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const validateShipping = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.state) errs.state = 'State is required';
    if (!form.pincode.trim()) errs.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Must be 6 digits';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const goNext = () => {
    if (currentStep === 'contact' && validateContact()) setCurrentStep('shipping');
    else if (currentStep === 'shipping' && validateShipping()) setCurrentStep('payment');
  };

  const goBack = () => {
    if (currentStep === 'shipping') setCurrentStep('contact');
    else if (currentStep === 'payment') setCurrentStep('shipping');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 'payment') { goNext(); return; }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    setIsSubmitting(true);
    try {
      const { data, error: orderError } = await supabase.functions.invoke('create-order', {
        body: {
          orderNumber: 'pending',
          customer: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() },
          shippingAddress: { address: form.address.trim(), address2: form.address2.trim(), city: form.city.trim(), state: form.state, pincode: form.pincode.trim() },
          items: items.map(item => ({ productId: item.id, title: item.name, price: item.price, quantity: item.quantity, image: item.image })),
          paymentMethod, subtotal: totalPrice, shipping, discount: discountAmount, total,
          couponCode: appliedCoupon?.code || null,
        },
      });
      if (orderError) throw orderError;
      if (data?.error) throw new Error(data.error);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success?order=${data.orderNumber}`);
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-3 tracking-tight">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6 text-sm">Add some items before checking out.</p>
          <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8">
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </main>
    );
  }

  const inputCls = (field: string) =>
    `w-full px-4 py-3 border rounded-xl text-sm bg-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 ${
      errors[field] ? 'border-destructive ring-1 ring-destructive/20' : 'border-border'
    }`;

  return (
    <main className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="bg-background border-b border-border sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-extrabold tracking-tight font-display">
              EKAM<span className="text-primary">GIFT</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/cart" className="hover:text-foreground transition-colors">Cart</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">Checkout</span>
            </nav>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:hidden">
              <Lock className="h-3 w-3" />
              <span>Secure</span>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="container mx-auto px-4 pb-4">
          <div className="flex items-center justify-center gap-0">
            {stepConfig.map((s, i) => {
              const isCompleted = i < stepIndex;
              const isCurrent = i === stepIndex;
              return (
                <div key={s.key} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (isCompleted) setCurrentStep(s.key);
                    }}
                    disabled={!isCompleted}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-primary text-primary-foreground'
                        : isCurrent
                          ? 'bg-foreground text-background ring-4 ring-foreground/10'
                          : 'bg-border text-muted-foreground'
                    }`}>
                      {isCompleted ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                    </div>
                    <span className={`text-[10px] font-medium transition-colors ${
                      isCurrent ? 'text-foreground' : isCompleted ? 'text-primary' : 'text-muted-foreground'
                    }`}>{s.label}</span>
                  </button>
                  {i < stepConfig.length - 1 && (
                    <div className={`w-12 sm:w-20 h-[2px] mx-2 mb-5 transition-colors duration-300 ${
                      i < stepIndex ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-10">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* Left — Form Steps */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {/* Contact Step */}
                {currentStep === 'contact' && (
                  <motion.section
                    key="contact"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="bg-background border border-border rounded-2xl p-6 space-y-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-bold text-lg">Contact Information</h2>
                        <p className="text-xs text-muted-foreground">We'll use this to send order updates</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-1.5">Full Name <span className="text-destructive">*</span></label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} className={inputCls('name')} placeholder="Enter your full name" />
                        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Email <span className="text-destructive">*</span></label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className={inputCls('email')} placeholder="you@example.com" />
                        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Phone <span className="text-destructive">*</span></label>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputCls('phone')} placeholder="+91 98765 43210" />
                        {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button type="button" variant="ghost" asChild className="gap-1.5">
                        <Link to="/cart"><ArrowLeft className="h-4 w-4" /> Back to Cart</Link>
                      </Button>
                      <Button type="button" onClick={goNext} className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8 gap-1.5">
                        Continue <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.section>
                )}

                {/* Shipping Step */}
                {currentStep === 'shipping' && (
                  <motion.section
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="bg-background border border-border rounded-2xl p-6 space-y-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-bold text-lg">Shipping Address</h2>
                        <p className="text-xs text-muted-foreground">Where should we deliver your order?</p>
                      </div>
                    </div>

                    {/* Contact summary */}
                    <div className="bg-secondary/70 rounded-xl px-4 py-3 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Contact: </span>
                        <span className="font-medium">{form.name}</span> · {form.email}
                      </div>
                      <button type="button" onClick={() => setCurrentStep('contact')} className="text-xs text-primary font-medium hover:underline">Edit</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-1.5">Address Line 1 <span className="text-destructive">*</span></label>
                        <input type="text" name="address" value={form.address} onChange={handleChange} className={inputCls('address')} placeholder="House/Flat no., Building, Street" />
                        {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-1.5">Address Line 2</label>
                        <input type="text" name="address2" value={form.address2} onChange={handleChange} className={inputCls('address2')} placeholder="Landmark, Area (optional)" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">City <span className="text-destructive">*</span></label>
                        <input type="text" name="city" value={form.city} onChange={handleChange} className={inputCls('city')} placeholder="City" />
                        {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">PIN Code <span className="text-destructive">*</span></label>
                        <input type="text" name="pincode" value={form.pincode} onChange={handleChange} maxLength={6} className={inputCls('pincode')} placeholder="400001" />
                        {errors.pincode && <p className="text-xs text-destructive mt-1">{errors.pincode}</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-1.5">State <span className="text-destructive">*</span></label>
                        <select name="state" value={form.state} onChange={handleChange} className={inputCls('state')}>
                          <option value="">Select State</option>
                          {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button type="button" variant="ghost" onClick={goBack} className="gap-1.5">
                        <ArrowLeft className="h-4 w-4" /> Back
                      </Button>
                      <Button type="button" onClick={goNext} className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8 gap-1.5">
                        Continue <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.section>
                )}

                {/* Payment Step */}
                {currentStep === 'payment' && (
                  <motion.section
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="bg-background border border-border rounded-2xl p-6 space-y-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-bold text-lg">Payment Method</h2>
                        <p className="text-xs text-muted-foreground">Choose how you'd like to pay</p>
                      </div>
                    </div>

                    {/* Summaries */}
                    <div className="space-y-2">
                      <div className="bg-secondary/70 rounded-xl px-4 py-3 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Contact: </span>
                          <span className="font-medium">{form.name}</span> · {form.phone}
                        </div>
                        <button type="button" onClick={() => setCurrentStep('contact')} className="text-xs text-primary font-medium hover:underline">Edit</button>
                      </div>
                      <div className="bg-secondary/70 rounded-xl px-4 py-3 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Ship to: </span>
                          <span className="font-medium">{form.address}, {form.city} - {form.pincode}</span>
                        </div>
                        <button type="button" onClick={() => setCurrentStep('shipping')} className="text-xs text-primary font-medium hover:underline">Edit</button>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {paymentOptions.map((opt) => (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                            paymentMethod === opt.id
                              ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                              : 'border-border hover:border-muted-foreground/30 hover:bg-secondary/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={opt.id}
                            checked={paymentMethod === opt.id}
                            onChange={() => setPaymentMethod(opt.id)}
                            className="accent-primary w-4 h-4"
                          />
                          <opt.icon className="h-5 w-5 text-muted-foreground shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold">{opt.label}</p>
                              {opt.badge && (
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  opt.badge === 'Recommended' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
                                }`}>{opt.badge}</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{opt.desc}</p>
                          </div>
                          {paymentMethod === opt.id && <Check className="h-4 w-4 text-primary shrink-0" />}
                        </label>
                      ))}
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button type="button" variant="ghost" onClick={goBack} className="gap-1.5">
                        <ArrowLeft className="h-4 w-4" /> Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8 h-12 text-base font-semibold gap-2 min-w-[180px]"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : paymentMethod === 'cod' ? (
                          <>Place Order</>
                        ) : (
                          <>Pay {formatPrice(total)}</>
                        )}
                      </Button>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Trust Bar below form */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> 256-bit SSL Encryption</div>
                <div className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> 100% Safe Checkout</div>
                <div className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Free Delivery over ₹999</div>
              </div>
            </div>

            {/* Right — Order Summary (always visible) */}
            <div className="lg:col-span-5">
              <div className="sticky top-[140px] bg-background border border-border rounded-2xl p-6 space-y-4">
                <h2 className="font-bold text-base flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Order Summary
                  <span className="text-xs text-muted-foreground font-normal">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                </h2>

                <div className="space-y-3 max-h-[250px] overflow-y-auto scrollbar-hide pr-1">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 group">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground">{item.brand}</p>
                      </div>
                      <span className="text-sm font-semibold shrink-0 tabular-nums">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium tabular-nums">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium">
                      {shipping === 0 ? <span className="text-primary font-semibold">FREE</span> : formatPrice(shipping)}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-primary" />
                        <span className="text-primary font-medium text-xs">{appliedCoupon.code} (-{appliedCoupon.discount}%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-primary">-{formatPrice(discountAmount)}</span>
                        <button type="button" onClick={removeCoupon} className="p-0.5 text-muted-foreground hover:text-destructive transition-colors">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/70 rounded-xl px-3 py-2.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>Estimated delivery: <strong className="text-foreground">3-5 business days</strong></span>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-xl tabular-nums">{formatPrice(total)}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">Including all taxes</p>
                </div>

                <p className="text-[11px] text-center text-muted-foreground pt-2">
                  By placing your order, you agree to our{' '}
                  <Link to="/policies/terms" className="underline hover:text-foreground transition-colors">Terms</Link> &{' '}
                  <Link to="/policies/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
