import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Search, ShieldCheck, Headphones, Package, Truck, CheckCircle, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/format';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import giftImage from '@/assets/3d-gift-tracking.png';

interface TrackedOrder {
  id: string;
  order_number: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  created_at: string;
  tracking_number: string | null;
  courier_name: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: {
    title: string;
    price: number;
    quantity: number;
    image: string;
    color: string | null;
    size: string | null;
  }[];
}

const statusSteps = [
  { key: 'placed', label: 'Order Placed', icon: Package },
  { key: 'processing', label: 'Processing', icon: Clock },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
] as const;

const getStepIndex = (status: string): number => {
  const map: Record<string, number> = { placed: 0, processing: 1, shipped: 2, out_for_delivery: 3, delivered: 4, cancelled: -1 };
  return map[status] ?? 0;
};

/* ─── Sub-components ─── */

const OrderItem = memo(({ item }: { item: TrackedOrder['items'][0] }) => (
  <div className="flex gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/40">
    {item.image && (
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary shrink-0">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold line-clamp-1">{item.title}</p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
        <span>Qty: {item.quantity}</span>
        {item.color && <span>· {item.color}</span>}
        {item.size && <span>· {item.size}</span>}
      </div>
    </div>
    <span className="text-sm font-bold shrink-0 self-center">{formatPrice(item.price * item.quantity)}</span>
  </div>
));
OrderItem.displayName = 'OrderItem';

const DesktopStepper = memo(({ currentStep }: { currentStep: number }) => (
  <div className="hidden sm:flex items-center justify-between relative py-2">
    {/* Track line */}
    <div className="absolute top-[26px] left-[20px] right-[20px] h-[3px] bg-border/60 rounded-full" />
    <div
      className="absolute top-[26px] left-[20px] h-[3px] bg-primary rounded-full transition-all duration-1000 ease-out"
      style={{ width: `calc(${Math.max(0, (currentStep / (statusSteps.length - 1)) * 100)}% - 40px)` }}
    />
    {statusSteps.map((step, i) => {
      const isComplete = i <= currentStep;
      const isCurrent = i === currentStep;
      const Icon = step.icon;
      return (
        <div key={step.key} className="relative z-10 flex flex-col items-center gap-3">
          <div
            className={cn(
              'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-700',
              isComplete
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'bg-card border-2 border-border text-muted-foreground',
              isCurrent && 'scale-115 ring-4 ring-primary/15 animate-stepper-pulse'
            )}
          >
            <Icon className="h-4.5 w-4.5" />
          </div>
          <span className={cn(
            'text-[11px] font-semibold transition-colors duration-500 text-center',
            isComplete ? 'text-primary' : 'text-muted-foreground'
          )}>
            {step.label}
          </span>
        </div>
      );
    })}
  </div>
));
DesktopStepper.displayName = 'DesktopStepper';

const MobileStepper = memo(({ currentStep }: { currentStep: number }) => (
  <div className="sm:hidden space-y-0">
    {statusSteps.map((step, i) => {
      const isComplete = i <= currentStep;
      const isCurrent = i === currentStep;
      const isLast = i === statusSteps.length - 1;
      const Icon = step.icon;
      return (
        <div key={step.key} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-700',
                isComplete ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-card border-2 border-border text-muted-foreground',
                isCurrent && 'scale-110 ring-4 ring-primary/15 animate-stepper-pulse'
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            {!isLast && <div className={cn('w-0.5 h-8 transition-colors duration-700', isComplete ? 'bg-primary' : 'bg-border')} />}
          </div>
          <div className="pb-8 pt-1.5">
            <p className={cn('text-sm font-semibold transition-colors duration-500', isComplete ? 'text-foreground' : 'text-muted-foreground')}>
              {step.label}
            </p>
          </div>
        </div>
      );
    })}
  </div>
));
MobileStepper.displayName = 'MobileStepper';

/* ─── Result Skeleton ─── */
const ResultSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
      <div className="h-6 w-48 bg-secondary rounded-lg" />
      <div className="h-4 w-32 bg-secondary rounded-lg" />
      <div className="flex gap-4 mt-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-full bg-secondary" />
            <div className="h-3 w-16 bg-secondary rounded" />
          </div>
        ))}
      </div>
    </div>
    <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-secondary/30">
          <div className="w-16 h-16 rounded-xl bg-secondary" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 bg-secondary rounded" />
            <div className="h-3 w-24 bg-secondary rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Main Page ─── */

const TrackOrder = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<TrackedOrder[] | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const refreshInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoRefresh = useCallback((emailVal: string, phoneVal: string) => {
    if (refreshInterval.current) clearInterval(refreshInterval.current);
    refreshInterval.current = setInterval(() => {
      fetchOrders(emailVal, phoneVal, true);
    }, 30_000);
  }, []);

  useEffect(() => {
    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const fetchOrders = useCallback(async (emailVal: string, phoneVal: string, silent = false) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    if (!silent) setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('track-order', {
        body: { email: emailVal, phone: phoneVal },
      });
      if (controller.signal.aborted) return;
      clearTimeout(timeoutId);
      if (fnError) throw fnError;
      if (data?.error) { if (!silent) setError(data.error); return; }

      if (data?.orders?.length > 0) {
        setOrders(data.orders);
        setSelectedOrder(prev => {
          if (prev) {
            const updated = data.orders.find((o: TrackedOrder) => o.id === prev.id);
            return updated || data.orders[0];
          }
          return data.orders[0];
        });
        if (!silent) {
          setShowResults(true);
          setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
      } else if (!silent) {
        setError('No orders found. Please check your details.');
      }
    } catch (err: any) {
      if (controller.signal.aborted && !silent) {
        setError('Request timed out. Please try again.');
      } else if (!silent) {
        setError(err?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      clearTimeout(timeoutId);
      if (!silent) setLoading(false);
    }
  }, []);

  const handleTrack = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowResults(false);
    setOrders(null);
    setSelectedOrder(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    if (!trimmedEmail || !trimmedPhone) { setError('Please enter both email and phone number.'); return; }

    await fetchOrders(trimmedEmail, trimmedPhone);
    startAutoRefresh(trimmedEmail, trimmedPhone);
  }, [email, phone, fetchOrders, startAutoRefresh]);

  const currentStep = selectedOrder ? getStepIndex(selectedOrder.order_status) : -1;
  const isCancelled = selectedOrder?.order_status === 'cancelled';

  return (
    <main className="min-h-screen">
      {/* ─── Premium Split Hero ─── */}
      <section className="relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />

        <div className="container mx-auto px-4 py-16 lg:py-28 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">

            {/* Left — Illustration + Copy */}
            <div className="text-center lg:text-left animate-fade-in-up">
              <div className="flex justify-center lg:justify-start mb-10">
                <img
                  src={giftImage}
                  alt="Track your gift"
                  className="w-40 h-40 sm:w-56 sm:h-56 lg:w-72 lg:h-72 object-contain drop-shadow-2xl animate-float-gentle"
                  loading="eager"
                />
              </div>
              <span className="text-[11px] font-medium uppercase tracking-[5px] text-primary mb-4 block">
                Order Tracking
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
                Where's My <span className="text-primary">Gift</span>?
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
                Track your order in real-time. Enter the details you used while placing your order to get instant updates.
              </p>

              {/* Trust badges inline */}
              <div className="flex items-center justify-center lg:justify-start gap-6 mt-8">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-primary/8 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">Secure Lookup</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-primary/8 flex items-center justify-center">
                    <Headphones className="h-4 w-4 text-primary" />
                  </div>
                  <Link to="/contact" className="font-medium hover:text-primary transition-colors">Need Help?</Link>
                </div>
              </div>
            </div>

            {/* Right — Form Card */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <div className="bg-card border border-border/60 rounded-2xl p-7 sm:p-9 shadow-card">
                <div className="mb-7">
                  <h2 className="text-xl font-display tracking-tight mb-1.5">Track Your Order</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your email and phone number below.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 text-sm text-destructive bg-destructive/8 border border-destructive/15 px-4 py-3 rounded-xl animate-fade-in">
                    {error}
                  </div>
                )}

                <form onSubmit={handleTrack} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="pl-11 h-12 rounded-xl border-border bg-secondary/30 focus:bg-background transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="pl-11 h-12 rounded-xl border-border bg-secondary/30 focus:bg-background transition-colors"
                        required
                        minLength={10}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-13 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all duration-200 mt-2"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Searching…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Track My Order
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Loading Skeleton ─── */}
      {loading && (
        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <ResultSkeleton />
          </div>
        </section>
      )}

      {/* ─── Order Results ─── */}
      {showResults && orders && orders.length > 0 && selectedOrder && (
        <section ref={resultsRef} className="container mx-auto px-4 pb-20 pt-4">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Order selector (multiple orders) */}
            {orders.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide animate-fade-in-up">
                {orders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className={cn(
                      'shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300',
                      selectedOrder.id === o.id
                        ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                        : 'bg-card border-border text-muted-foreground hover:border-primary/40'
                    )}
                  >
                    {o.order_number}
                  </button>
                ))}
              </div>
            )}

            {/* Order Header + Stepper */}
            <div className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 shadow-card animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-wider">
                      {selectedOrder.order_number}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {selectedOrder.tracking_number && (
                    <span className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                      {selectedOrder.courier_name}: {selectedOrder.tracking_number}
                    </span>
                  )}
                  <span className={cn(
                    'text-xs font-bold px-3 py-1.5 rounded-full capitalize',
                    isCancelled ? 'bg-destructive/10 text-destructive' :
                    selectedOrder.order_status === 'delivered' ? 'bg-success/10 text-success' :
                    'bg-primary/10 text-primary'
                  )}>
                    {selectedOrder.order_status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Status Stepper */}
              {!isCancelled ? (
                <>
                  <DesktopStepper currentStep={currentStep} />
                  <MobileStepper currentStep={currentStep} />
                </>
              ) : (
                <div className="text-center py-5 text-sm text-destructive bg-destructive/5 rounded-xl font-medium">
                  This order has been cancelled.
                </div>
              )}
            </div>

            {/* Items */}
            <div className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 shadow-card animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
              <h3 className="font-display text-base mb-5">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, i) => (
                  <OrderItem key={i} item={item} />
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-border/50 mt-6 pt-5 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{selectedOrder.shipping === 0 ? 'FREE' : formatPrice(selectedOrder.shipping)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-3 border-t border-border/50">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.12s' }}>
              <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-card">
                <p className="text-[11px] text-muted-foreground uppercase tracking-[3px] font-medium mb-2">Payment Method</p>
                <p className="font-semibold text-sm capitalize">{selectedOrder.payment_method === 'cod' ? 'Cash on Delivery' : selectedOrder.payment_method}</p>
              </div>
              <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-card">
                <p className="text-[11px] text-muted-foreground uppercase tracking-[3px] font-medium mb-2">Payment Status</p>
                <p className={cn(
                  'font-semibold text-sm capitalize',
                  selectedOrder.payment_status === 'paid' ? 'text-success' : 'text-warning'
                )}>{selectedOrder.payment_status}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default TrackOrder;
