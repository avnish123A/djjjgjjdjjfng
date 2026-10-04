import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, CreditCard, Banknote, Check, Calendar, Tag, X, MapPin, User, Package, Loader2, Pencil, AlertCircle, RotateCw, ChevronUp } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { generateCartHash } from '@/lib/cartHash';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Jammu & Kashmir', 'Ladakh',
];

interface ActiveGateway {
  gateway_name: string;
  is_enabled: boolean;
  environment: string;
  priority: number;
  cod_extra_charge: number;
  cod_min_order: number;
}

const gatewayDisplay: Record<string, { label: string; desc: string; icon: React.ElementType; badge: string | null }> = {
  cod: { label: 'Cash on Delivery', desc: 'Pay when you receive your order', icon: Banknote, badge: 'No extra charge' },
  razorpay: { label: 'Razorpay', desc: 'UPI, Cards, Net Banking, Wallets', icon: CreditCard, badge: 'Recommended' },
  cashfree: { label: 'Cashfree', desc: 'UPI, Cards, Net Banking, EMI', icon: CreditCard, badge: null },
};

const getCodDisplay = (gw: ActiveGateway) => {
  if (gw.gateway_name !== 'cod') return gatewayDisplay[gw.gateway_name] || { label: gw.gateway_name, desc: '', icon: CreditCard, badge: null };
  const charge = Number(gw.cod_extra_charge) || 0;
  return {
    ...gatewayDisplay.cod,
    badge: charge > 0 ? `+₹${charge} fee` : 'No extra charge',
  };
};

type Step = 'contact' | 'shipping' | 'payment';

type CheckoutForm = { name: string; email: string; phone: string; address: string; address2: string; city: string; state: string; pincode: string };

const getContactErrors = (f: CheckoutForm) => {
  const e: Record<string, string> = {};
  if (!f.name.trim()) e.name = 'Please enter your full name';
  if (!f.email.trim()) e.email = 'Please enter your email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'That email looks incomplete — e.g. name@gmail.com';
  const digits = f.phone.replace(/\D/g, '');
  if (!f.phone.trim()) e.phone = 'Please enter your mobile number';
  else if (!/^[\d\s+\-()]+$/.test(f.phone) || digits.length < 10 || digits.length > 13) e.phone = 'Enter a 10-digit mobile number';
  return e;
};

const getShippingErrors = (f: CheckoutForm) => {
  const e: Record<string, string> = {};
  if (!f.address.trim()) e.address = 'Please enter your house / street address';
  if (!f.city.trim()) e.city = 'Please enter your city';
  if (!f.state) e.state = 'Please choose your state';
  if (!f.pincode.trim()) e.pincode = 'Please enter your PIN code';
  else if (!/^\d{6}$/.test(f.pincode.trim())) e.pincode = 'PIN code must be 6 digits';
  return e;
};

const fieldLabels: Record<string, string> = { name: 'name', email: 'email', phone: 'mobile number', address: 'address', city: 'city', state: 'state', pincode: 'PIN code' };

const Checkout = () => {
  const { items, totalPrice, clearCart, appliedCoupon, discountAmount, removeCoupon, refreshCart } = useCart();

  // Re-check prices & stock once when checkout opens; never silently charge a different amount
  useEffect(() => {
    refreshCart().then((msg) => { if (msg) toast.warning(msg); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');
  const [currentStep, setCurrentStep] = useState<Step>('contact');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [gatewaysError, setGatewaysError] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  // Order already created on the server whose online payment hasn't started/finished — reused on retry
  const pendingOrderRef = useRef<{ orderId: string; orderNumber: string; checkoutToken: string; method: string } | null>(null);
  const reduceMotion = useReducedMotion();
  const [activeGateways, setActiveGateways] = useState<ActiveGateway[]>([]);
  const [gatewaysLoading, setGatewaysLoading] = useState(true);

  // Anti-double-click: ref-based lock prevents concurrent submissions
  const submissionLockRef = useRef(false);
  // Idempotency key: unique per submission attempt
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', address2: '', city: '', state: '', pincode: '',
  });

  const fetchGateways = useCallback(async () => {
    setGatewaysLoading(true);
    setGatewaysError(false);
    try {
      const { data, error } = await supabase.functions.invoke('get-active-gateways');
      if (error || !Array.isArray(data?.gateways)) throw error || new Error('Invalid gateways response');
      setActiveGateways(data.gateways);
      const first = data.gateways[0];
      if (first) setPaymentMethod(first.gateway_name);
    } catch (err) {
      console.error('[Checkout] Failed to load payment methods:', err);
      setGatewaysError(true);
    } finally {
      setGatewaysLoading(false);
    }
  }, []);

  useEffect(() => { fetchGateways(); }, [fetchGateways]);

  const codGateway = activeGateways.find(g => g.gateway_name === 'cod');
  const codExtraCharge = paymentMethod === 'cod' && codGateway ? (Number(codGateway.cod_extra_charge) || 0) : 0;
  const codMinOrder = codGateway ? (Number(codGateway.cod_min_order) || 0) : 0;
  const isCodBelowMin = paymentMethod === 'cod' && codMinOrder > 0 && totalPrice < codMinOrder;

  const shipping = totalPrice >= 999 ? 0 : 99;
  const total = totalPrice + shipping - discountAmount + codExtraCharge;

  const contactErrors = getContactErrors(form);
  const shippingErrors = getShippingErrors(form);
  const contactValid = Object.keys(contactErrors).length === 0;
  const shippingValid = Object.keys(shippingErrors).length === 0;
  const errors: Record<string, string> = { ...contactErrors, ...shippingErrors };
  const showError = (field: string) => (touched[field] ? errors[field] : undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const v = name === 'pincode' ? value.replace(/\D/g, '').slice(0, 6) : value;
    setForm(prev => ({ ...prev, [name]: v }));
    // Contact/address changes invalidate an order that was created but never paid
    pendingOrderRef.current = null;
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (value) setTouched(prev => ({ ...prev, [name]: true }));
  };

  /** Pre-submit validation pipeline */
  const runCheckoutValidation = (): string | null => {
    // 1. Cart not empty
    if (items.length === 0) return 'Your cart is empty';

    // 2. Payment method selected and available
    if (!paymentMethod) return 'Please select a payment method';
    const selectedGw = activeGateways.find(g => g.gateway_name === paymentMethod);
    if (!selectedGw) return 'Selected payment method is not available';

    // 3. COD minimum check
    if (isCodBelowMin) return `Minimum order of ₹${codMinOrder} required for COD`;

    // 4. No gateways available at all
    if (activeGateways.length === 0) return 'No payment methods available. Please try again later.';

    return null; // All checks passed
  };

  const markTouched = (fields: string[]) => setTouched(prev => ({ ...prev, ...Object.fromEntries(fields.map(f => [f, true])) }));

  const goNext = () => {
    if (currentStep === 'contact') {
      markTouched(Object.keys(contactErrors));
      if (contactValid) setCurrentStep(shippingValid ? 'payment' : 'shipping');
    } else if (currentStep === 'shipping') {
      markTouched(Object.keys(shippingErrors));
      if (shippingValid) setCurrentStep('payment');
    }
  };

  // Move focus to the newly opened section's heading for keyboard/screen-reader users
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => document.getElementById(`section-${currentStep}`)?.focus(), 240);
    return () => clearTimeout(t);
  }, [currentStep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 'payment') { goNext(); return; }

    // Anti-double-click guard
    if (submissionLockRef.current) return;

    // Run validation pipeline
    const validationError = runCheckoutValidation();
    if (validationError) {
      setPaymentError(validationError);
      return;
    }
    if (!contactValid) { setCurrentStep('contact'); markTouched(Object.keys(contactErrors)); return; }
    if (!shippingValid) { setCurrentStep('shipping'); markTouched(Object.keys(shippingErrors)); return; }
    setPaymentError(null);

    // Lock submissions
    submissionLockRef.current = true;
    setIsSubmitting(true);

    try {
      // Payment initialization failed earlier for an order that already exists: retry payment only
      const pending = pendingOrderRef.current;
      if (pending && pending.method === paymentMethod && (paymentMethod === 'razorpay' || paymentMethod === 'cashfree')) {
        await startOnlinePayment(pending.orderId, pending.orderNumber, pending.checkoutToken);
        return;
      }

      // Generate cart hash for tamper detection
      const cartHash = await generateCartHash(
        items.map(item => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
          variantKey: item.variantKey,
        }))
      );

      // Use current idempotency key, then rotate for next attempt
      const currentIdempotencyKey = idempotencyKeyRef.current;

      const { data, error: orderError } = await supabase.functions.invoke('create-order', {
        body: {
          orderNumber: 'pending',
          customer: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() },
          shippingAddress: { address: form.address.trim(), address2: form.address2.trim(), city: form.city.trim(), state: form.state, pincode: form.pincode.trim() },
          items: items.map(item => ({ productId: item.id, title: item.name, price: item.price, quantity: item.quantity, image: item.image })),
          paymentMethod, subtotal: totalPrice, shipping, discount: discountAmount, total,
          codExtraCharge,
          couponCode: appliedCoupon?.code || null,
          cartHash,
          idempotencyKey: currentIdempotencyKey,
        },
      });
      if (orderError) throw orderError;
      if (data?.error) throw new Error(data.error);

      const { orderId, orderNumber, checkoutToken } = data;

      // Rotate idempotency key after successful order creation
      idempotencyKeyRef.current = crypto.randomUUID();

      if (paymentMethod === 'razorpay' || paymentMethod === 'cashfree') {
        pendingOrderRef.current = { orderId, orderNumber, checkoutToken, method: paymentMethod };
        await startOnlinePayment(orderId, orderNumber, checkoutToken);
        return;
      }

      // COD — order complete
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success?order=${orderNumber}`);
    } catch (error: any) {
      console.error('Order error:', error);
      const raw = typeof error?.message === 'string' ? error.message : '';
      setPaymentError(raw && raw.length < 200 && !/fetch|network|functions|edge/i.test(raw)
        ? raw
        : 'We couldn\'t place your order. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
      submissionLockRef.current = false;
    }
  };

  const startOnlinePayment = async (orderId: string, orderNumber: string, checkoutToken: string) => {
    const { data: paymentData, error: payErr } = await supabase.functions.invoke('create-payment', {
      body: { orderId, gateway: paymentMethod, checkoutToken },
    });
    if (payErr || paymentData?.error) {
      console.error('[Checkout] Payment initialization failed:', payErr || paymentData?.error);
      throw new Error(`We couldn't start the payment. Your order ${orderNumber} is saved — tap Pay to try again.`);
    }
    if (paymentMethod === 'razorpay') await openRazorpay(paymentData, orderId, orderNumber, checkoutToken);
    else await openCashfree(paymentData, orderId, orderNumber, checkoutToken);
  };

  const openRazorpay = (paymentData: any, orderId: string, orderNumber: string, checkoutToken: string) => {
    return new Promise<void>((resolve, reject) => {
      const loadScript = () => {
        if ((window as any).Razorpay) return Promise.resolve();
        return new Promise<void>((res, rej) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => res();
          script.onerror = () => rej(new Error('Failed to load Razorpay SDK'));
          document.body.appendChild(script);
        });
      };

      loadScript().then(() => {
        const options = {
          key: paymentData.razorpayKeyId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          name: 'CartZebra',
          description: `Order ${orderNumber}`,
          order_id: paymentData.razorpayOrderId,
          prefill: {
            name: paymentData.customerName,
            email: paymentData.customerEmail,
            contact: paymentData.customerPhone,
          },
          handler: async (response: any) => {
            try {
              const { data: verifyData } = await supabase.functions.invoke('verify-payment', {
                body: {
                  gateway: 'razorpay',
                  orderId,
                  checkoutToken,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                },
              });
              if (verifyData?.success) {
                pendingOrderRef.current = null;
                clearCart();
                toast.success('Payment successful! Order confirmed.');
                navigate(`/order-success?order=${orderNumber}`);
              } else {
                setPaymentError(`We couldn't confirm your payment yet. Please don't pay again — check Track Order for ${orderNumber} or contact support.`);
              }
            } catch {
              setPaymentError(`We couldn't confirm your payment yet. Please don't pay again — check Track Order for ${orderNumber} or contact support.`);
            }
            setIsSubmitting(false);
            submissionLockRef.current = false;
            resolve();
          },
          modal: {
            ondismiss: () => {
              setPaymentError(`Payment cancelled. Your order ${orderNumber} is saved — tap Pay to try again.`);
              setIsSubmitting(false);
              submissionLockRef.current = false;
              resolve();
            },
          },
          theme: { color: '#000000' },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
          console.error('Razorpay payment failed:', response.error);
          setPaymentError(`${response.error?.description || 'Payment failed'}. You can try again or choose another method.`);
          setIsSubmitting(false);
          submissionLockRef.current = false;
          resolve();
        });
        rzp.open();
      }).catch(reject);
    });
  };

  const openCashfree = async (paymentData: any, orderId: string, orderNumber: string, checkoutToken: string) => {
    try {
      if (!(window as any).Cashfree) {
        const script = document.createElement('script');
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        await new Promise<void>((res, rej) => {
          script.onload = () => res();
          script.onerror = () => rej(new Error('Failed to load Cashfree SDK'));
          document.body.appendChild(script);
        });
      }

      const cashfree = new (window as any).Cashfree({
        mode: paymentData.isTest ? 'sandbox' : 'production',
      });

      const result = await cashfree.checkout({
        paymentSessionId: paymentData.paymentSessionId,
        redirectTarget: '_modal',
      });

      if (result?.paymentDetails || result?.error === undefined) {
        const { data: verifyData } = await supabase.functions.invoke('verify-payment', {
          body: { gateway: 'cashfree', orderId, checkoutToken },
        });
        if (verifyData?.success) {
          pendingOrderRef.current = null;
          clearCart();
          toast.success('Payment successful! Order confirmed.');
          navigate(`/order-success?order=${orderNumber}`);
        } else {
          setPaymentError(`We couldn't confirm your payment yet. Please don't pay again — check Track Order for ${orderNumber} or contact support.`);
        }
      } else {
        setPaymentError(`Payment was not completed. Your order ${orderNumber} is saved — tap Pay to try again.`);
      }
    } catch (err: any) {
      console.error('Cashfree error:', err);
      setPaymentError('Payment could not be completed. Please try again.');
    } finally {
      setIsSubmitting(false);
      submissionLockRef.current = false;
    }
  };

  if (items.length === 0) {
    return (
      <main className="bg-background">
        <div className="container mx-auto px-4 py-20 text-center max-w-md">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-5">
            <Package className="h-7 w-7 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-tight">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6 text-sm">Add a few things you love, then come back to check out.</p>
          <Button asChild className="rounded-full px-8">
            <Link to="/products">Continue shopping</Link>
          </Button>
        </div>
      </main>
    );
  }

  const order: Step[] = ['contact', 'shipping', 'payment'];
  const stepPos = order.indexOf(currentStep);
  const isDone = (s: Step) => order.indexOf(s) < stepPos && (s === 'contact' ? contactValid : shippingValid);
  const dur = reduceMotion ? 0 : 0.22;

  const inputCls = (field: string) =>
    `w-full h-12 px-4 border rounded-xl text-base sm:text-sm bg-background transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus:border-foreground/40 ${
      showError(field) ? 'border-destructive' : 'border-border'
    }`;

  const Field = ({ name, label, optional, children, className = '' }: { name: string; label: string; optional?: boolean; children: React.ReactNode; className?: string }) => (
    <div className={className}>
      <label htmlFor={`co-${name}`} className="block text-[13px] font-medium mb-1.5">
        {label} {optional && <span className="text-muted-foreground font-normal">(optional)</span>}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {showError(name) && (
          <motion.p
            id={`co-${name}-err`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
            className="text-xs text-destructive mt-1.5 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3 shrink-0" /> {showError(name)}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  const aria = (name: string) => ({
    id: `co-${name}`,
    name,
    'aria-invalid': !!showError(name),
    'aria-describedby': showError(name) ? `co-${name}-err` : undefined,
  });

  const missingHint = (errs: Record<string, string>) => {
    const keys = Object.keys(errs);
    if (keys.length === 0) return null;
    return `Add your ${keys.map(k => fieldLabels[k]).join(', ')} to continue`;
  };

  const SectionHeader = ({ step, index, title, icon: Icon, summary }: { step: Step; index: number; title: string; icon: React.ElementType; summary?: React.ReactNode }) => {
    const done = isDone(step);
    const active = currentStep === step;
    return (
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200 ${
          done ? 'bg-foreground text-background' : active ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'
        }`}>
          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <motion.span key="c" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: dur }}>
                <Check className="h-4 w-4" />
              </motion.span>
            ) : (
              <motion.span key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{index}</motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex-1 min-w-0">
          <h2 id={`section-${step}`} tabIndex={-1} className={`font-semibold text-base leading-8 outline-none ${active || done ? 'text-foreground' : 'text-muted-foreground'}`}>
            <Icon className="inline h-4 w-4 mr-1.5 -mt-0.5 text-muted-foreground" aria-hidden />{title}
          </h2>
          {done && !active && summary && <div className="text-sm text-muted-foreground mt-0.5 break-words">{summary}</div>}
        </div>
        {done && !active && (
          <button
            type="button"
            onClick={() => setCurrentStep(step)}
            className="shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 transition-colors"
            aria-label={`Edit ${title.toLowerCase()}`}
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        )}
      </div>
    );
  };

  const Expand = ({ open, children }: { open: boolean; children: React.ReactNode }) => (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="pt-5">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const cardCls = (step: Step) =>
    `bg-card border rounded-2xl p-4 sm:p-6 transition-colors duration-200 ${currentStep === step ? 'border-foreground/20 shadow-sm' : 'border-border'}`;

  const ctaLabel = paymentMethod === 'cod' ? `Place order · ${formatPrice(total)}` : `Pay ${formatPrice(total)}`;
  const canPay = !isSubmitting && !gatewaysLoading && activeGateways.length > 0 && !isCodBelowMin && contactValid && shippingValid;

  const PrimaryCta = ({ className = '' }: { className?: string }) => (
    <Button
      type="submit"
      disabled={!canPay}
      className={`h-12 rounded-full text-base font-semibold w-full transition-all duration-200 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isSubmitting ? (
          <motion.span key="s" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Loader2 className="h-4 w-4 animate-spin" /> Processing…
          </motion.span>
        ) : (
          <motion.span key={ctaLabel} className="flex items-center gap-2" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: reduceMotion ? 0 : 0.15 }}>
            {paymentMethod !== 'cod' && <Lock className="h-4 w-4" />} {ctaLabel}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );

  const summaryRows = (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">{formatPrice(totalPrice)}</span></div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Delivery</span>
        <span>{shipping === 0 ? <span className="font-semibold text-success">Free</span> : <span className="tabular-nums">{formatPrice(shipping)}</span>}</span>
      </div>
      {appliedCoupon && (
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5 text-success"><Tag className="h-3.5 w-3.5" /> {appliedCoupon.code}</span>
          <span className="flex items-center gap-1.5">
            <span className="text-success tabular-nums">−{formatPrice(discountAmount)}</span>
            <button type="button" onClick={removeCoupon} aria-label="Remove coupon" className="p-0.5 text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
          </span>
        </div>
      )}
      {codExtraCharge > 0 && (
        <div className="flex justify-between"><span className="text-muted-foreground">COD fee</span><span className="tabular-nums">{formatPrice(codExtraCharge)}</span></div>
      )}
    </div>
  );

  return (
    <main className="bg-secondary/40 pb-32 lg:pb-12">
      <div className="container mx-auto px-4 pt-5 lg:pt-8 max-w-6xl">
        <div className="flex items-baseline justify-between mb-4 lg:mb-6">
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Checkout</h1>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="h-3 w-3" /> Secure checkout</span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
            {/* Left — progressive sections */}
            <div className="lg:col-span-7 space-y-3">
              {/* Contact */}
              <section className={cardCls('contact')} aria-labelledby="section-contact">
                {SectionHeader({ step: 'contact', index: 1, title: 'Contact', icon: User,
                  summary: <>{form.name} · {form.phone}<br className="sm:hidden" /><span className="hidden sm:inline"> · </span>{form.email}</> })}
                {Expand({ open: currentStep === 'contact', children: (<>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Field({ name: "name", label: "Full name", className: "sm:col-span-2", children: (<input {...aria('name')} type="text" autoComplete="name" value={form.name} onChange={handleChange} onBlur={handleBlur} className={inputCls('name')} placeholder="e.g. Priya Sharma" />) })}
                    {Field({ name: "phone", label: "Mobile number", children: (<input {...aria('phone')} type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={handleChange} onBlur={handleBlur} className={inputCls('phone')} placeholder="98765 43210" />) })}
                    {Field({ name: "email", label: "Email", children: (<input {...aria('email')} type="email" inputMode="email" autoComplete="email" value={form.email} onChange={handleChange} onBlur={handleBlur} className={inputCls('email')} placeholder="you@example.com" />) })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">We'll send order updates here. You'll need these to track your order.</p>
                  <div className="mt-5">
                    <Button type="button" onClick={goNext} disabled={!contactValid} className="h-12 rounded-full w-full sm:w-auto sm:px-10 font-semibold">
                      Continue to delivery
                    </Button>
                    {!contactValid && <p className="text-xs text-muted-foreground mt-2" aria-live="polite">{missingHint(contactErrors)}</p>}
                  </div>
                </>) })}
              </section>

              {/* Delivery */}
              <section className={cardCls('shipping')} aria-labelledby="section-shipping">
                {SectionHeader({ step: 'shipping', index: 2, title: 'Delivery address', icon: MapPin,
                  summary: <>{form.address}{form.address2 ? `, ${form.address2}` : ''}, {form.city}, {form.state} – {form.pincode}</> })}
                {Expand({ open: currentStep === 'shipping', children: (<>
                  <div className="grid grid-cols-2 gap-4">
                    {Field({ name: "address", label: "House no., building, street", className: "col-span-2", children: (<input {...aria('address')} type="text" autoComplete="address-line1" value={form.address} onChange={handleChange} onBlur={handleBlur} className={inputCls('address')} placeholder="Flat 12B, Sunrise Apartments, MG Road" />) })}
                    {Field({ name: "address2", label: "Landmark / area", optional: true, className: "col-span-2", children: (<input {...aria('address2')} type="text" autoComplete="address-line2" value={form.address2} onChange={handleChange} className={inputCls('address2')} placeholder="Near City Mall" />) })}
                    {Field({ name: "pincode", label: "PIN code", children: (<input {...aria('pincode')} type="text" inputMode="numeric" autoComplete="postal-code" value={form.pincode} onChange={handleChange} onBlur={handleBlur} className={inputCls('pincode')} placeholder="400001" />) })}
                    {Field({ name: "city", label: "City", children: (<input {...aria('city')} type="text" autoComplete="address-level2" value={form.city} onChange={handleChange} onBlur={handleBlur} className={inputCls('city')} placeholder="Mumbai" />) })}
                    {Field({ name: "state", label: "State", className: "col-span-2", children: (<select {...aria('state')} autoComplete="address-level1" value={form.state} onChange={(e) => { handleChange(e); setTouched(p => ({ ...p, state: true })); }} className={inputCls('state')}>
                        <option value="">Choose state</option>
                        {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>) })}
                  </div>
                  <div className="mt-5">
                    <Button type="button" onClick={goNext} disabled={!shippingValid} className="h-12 rounded-full w-full sm:w-auto sm:px-10 font-semibold">
                      Continue to payment
                    </Button>
                    {!shippingValid && <p className="text-xs text-muted-foreground mt-2" aria-live="polite">{missingHint(shippingErrors)}</p>}
                  </div>
                </>) })}
              </section>

              {/* Payment */}
              <section className={cardCls('payment')} aria-labelledby="section-payment">
                {SectionHeader({ step: 'payment', index: 3, title: 'Payment', icon: CreditCard })}
                {Expand({ open: currentStep === 'payment', children: (<>
                  <div className="space-y-2.5" role="radiogroup" aria-label="Payment method">
                    {gatewaysLoading ? (
                      [0, 1].map(i => <div key={i} className="h-[68px] rounded-xl bg-secondary animate-pulse" />)
                    ) : gatewaysError ? (
                      <div className="rounded-xl border border-border p-4 text-sm flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">We couldn't load payment options.</span>
                        <Button type="button" variant="outline" size="sm" onClick={fetchGateways} className="rounded-full gap-1.5"><RotateCw className="h-3.5 w-3.5" /> Retry</Button>
                      </div>
                    ) : activeGateways.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-3">No payment methods are available right now. Please try again shortly.</p>
                    ) : (
                      activeGateways.map((gw) => {
                        const display = getCodDisplay(gw);
                        const IconComp = display.icon;
                        const codMin = Number(gw.cod_min_order) || 0;
                        const isDisabled = gw.gateway_name === 'cod' && codMin > 0 && totalPrice < codMin;
                        const selected = paymentMethod === gw.gateway_name;
                        return (
                          <label
                            key={gw.gateway_name}
                            className={`flex items-center gap-3 p-4 border rounded-xl transition-colors duration-150 focus-within:ring-2 focus-within:ring-ring/40 ${
                              isDisabled ? 'border-border opacity-50 cursor-not-allowed'
                                : selected ? 'border-foreground bg-secondary/60 cursor-pointer'
                                : 'border-border hover:bg-secondary/40 cursor-pointer'
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={gw.gateway_name}
                              checked={selected}
                              onChange={() => { if (!isDisabled) { setPaymentMethod(gw.gateway_name); setPaymentError(null); } }}
                              disabled={isDisabled}
                              className="accent-foreground w-4 h-4"
                            />
                            <IconComp className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold">{display.label}</span>
                                {display.badge && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{display.badge}</span>}
                                {gw.environment === 'test' && gw.gateway_name !== 'cod' && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warning/15 text-warning">Test mode</span>}
                              </div>
                              <p className="text-xs text-muted-foreground">{display.desc}</p>
                              {isDisabled && <p className="text-xs text-destructive mt-1">Available on orders of ₹{codMin} or more</p>}
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>

                  <AnimatePresence>
                    {paymentError && (
                      <motion.div
                        role="alert"
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.18 }}
                        className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm flex gap-2"
                      >
                        <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <span>{paymentError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-5 hidden lg:block">
                    {PrimaryCta({})}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground flex items-start gap-1.5">
                    <Lock className="h-3 w-3 mt-0.5 shrink-0" />
                    {paymentMethod === 'cod'
                      ? 'Pay in cash when your order arrives.'
                      : 'You\u2019ll complete payment on the secure payment partner window. CartZebra never sees or stores your card or UPI details.'}
                  </p>
                </>) })}
              </section>

              <p className="text-[11px] text-muted-foreground px-1">
                By placing your order you agree to our{' '}
                <Link to="/policies/terms" className="underline hover:text-foreground">Terms</Link> and{' '}
                <Link to="/policies/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
              </p>
            </div>

            {/* Right — sticky summary (desktop) / collapsible (mobile) */}
            <aside className="lg:col-span-5 lg:sticky lg:top-24 order-first lg:order-none">
              <div className="bg-card border border-border rounded-2xl">
                <button
                  type="button"
                  className="lg:hidden w-full flex items-center justify-between px-4 py-3.5 text-sm"
                  onClick={() => setSummaryOpen(o => !o)}
                  aria-expanded={summaryOpen}
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    {summaryOpen ? 'Hide' : 'Show'} order summary · {items.reduce((n, i) => n + i.quantity, 0)} items
                    <ChevronUp className={`h-4 w-4 transition-transform duration-200 ${summaryOpen ? '' : 'rotate-180'}`} />
                  </span>
                  <motion.span key={total} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="font-bold tabular-nums">{formatPrice(total)}</motion.span>
                </button>
                <div className={`${summaryOpen ? 'block' : 'hidden'} lg:block px-4 pb-4 lg:p-6 space-y-4 border-t lg:border-t-0 border-border`}>
                  <h2 className="hidden lg:block font-semibold">Order summary</h2>
                  <ul className="space-y-3 max-h-[240px] overflow-y-auto pt-3 lg:pt-0 pr-1">
                    {items.map(item => (
                      <li key={item.variantKey || item.id} className="flex gap-3 items-center">
                        <div className="relative shrink-0">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary">
                            <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[10px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">{item.quantity}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                          {item.variantSelections && Object.keys(item.variantSelections).length > 0 && (
                            <p className="text-[11px] text-muted-foreground line-clamp-1">{Object.values(item.variantSelections).join(' · ')}</p>
                          )}
                        </div>
                        <span className="text-sm font-semibold tabular-nums">{formatPrice(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-border pt-4">{summaryRows}</div>
                  <div className="border-t border-border pt-4 flex justify-between items-baseline">
                    <span className="font-semibold">Total</span>
                    <motion.span key={total} initial={{ opacity: 0.4, y: 2 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="font-bold text-xl tabular-nums">
                      {formatPrice(total)}
                    </motion.span>
                  </div>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 shrink-0" /> Usually delivered in 7–14 days
                  </p>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">Add {formatPrice(999 - totalPrice)} more for free delivery.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {/* Mobile bottom bar — only once payment is open, so it never hides the form */}
          <AnimatePresence>
            {currentStep === 'payment' && (
              <motion.div
                initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
                transition={{ duration: dur }}
                className="lg:hidden fixed inset-x-0 bottom-[60px] z-40 border-t border-border bg-background/95 backdrop-blur px-4 py-3"
              >
                {PrimaryCta({})}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
