import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Search, ShieldCheck, Headphones, Package, Truck, CheckCircle, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/format';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
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
];

const getStepIndex = (status: string): number => {
  const map: Record<string, number> = {
    placed: 0,
    processing: 1,
    shipped: 2,
    out_for_delivery: 3,
    delivered: 4,
    cancelled: -1,
  };
  return map[status] ?? 0;
};

const TrackOrder = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<TrackedOrder[] | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrders(null);
    setSelectedOrder(null);

    if (!email.trim() || !phone.trim()) {
      setError('Please enter both email and phone number.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('track-order', {
        body: { email: email.trim(), phone: phone.trim() },
      });

      if (fnError) throw fnError;
      if (data?.error) {
        setError(data.error);
      } else if (data?.orders?.length > 0) {
        setOrders(data.orders);
        setSelectedOrder(data.orders[0]);
      } else {
        setError('No orders found. Please check your details.');
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = selectedOrder ? getStepIndex(selectedOrder.order_status) : -1;
  const isCancelled = selectedOrder?.order_status === 'cancelled';

  return (
    <main className="min-h-screen bg-secondary/30">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left: 3D Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center order-1 lg:order-1"
          >
            <motion.img
              src={giftImage}
              alt="Track your gift"
              className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-contain drop-shadow-2xl"
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ willChange: 'transform' }}
              loading="lazy"
            />
          </motion.div>

          {/* Right: Tracking Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-2 lg:order-2"
          >
            <div className="bg-background border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Track Your Order</h1>
                <p className="text-sm text-muted-foreground">
                  Enter the email and phone number you used while placing your order.
                </p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-5 text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleTrack} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="pl-10"
                      required
                      minLength={10}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
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
                    </span>
                  )}
                </Button>
              </form>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-5 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span>Secure Lookup</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Headphones className="h-3.5 w-3.5 text-primary" />
                  <Link to="#" className="hover:underline">Need Help?</Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Order Results */}
      <AnimatePresence>
        {orders && orders.length > 0 && selectedOrder && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 pb-16"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Order selector (if multiple) */}
              {orders.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {orders.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setSelectedOrder(o)}
                      className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        selectedOrder.id === o.id
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      {o.order_number}
                    </button>
                  ))}
                </div>
              )}

              {/* Order Header */}
              <div className="bg-background border border-border rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold">{selectedOrder.order_number}</h2>
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
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${
                      isCancelled ? 'bg-destructive/10 text-destructive' :
                      selectedOrder.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
                      'bg-primary/10 text-primary'
                    }`}>
                      {selectedOrder.order_status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Status Stepper */}
                {!isCancelled && (
                  <>
                    {/* Desktop Horizontal Stepper */}
                    <div className="hidden sm:flex items-center justify-between relative">
                      {/* Progress line */}
                      <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
                      <motion.div
                        className="absolute top-5 left-0 h-0.5 bg-primary"
                        initial={{ width: '0%' }}
                        animate={{ width: `${Math.max(0, (currentStep / (statusSteps.length - 1)) * 100)}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />

                      {statusSteps.map((step, i) => {
                        const isComplete = i <= currentStep;
                        const isCurrent = i === currentStep;
                        return (
                          <div key={step.key} className="relative z-10 flex flex-col items-center">
                            <motion.div
                              initial={{ scale: 0.8 }}
                              animate={{ scale: isCurrent ? 1.1 : 1 }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                isComplete
                                  ? 'bg-primary text-primary-foreground shadow-md'
                                  : 'bg-background border-2 border-border text-muted-foreground'
                              }`}
                            >
                              <step.icon className="h-4 w-4" />
                            </motion.div>
                            <span className={`text-[11px] font-medium mt-2 ${
                              isComplete ? 'text-primary' : 'text-muted-foreground'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mobile Vertical Stepper */}
                    <div className="sm:hidden space-y-0">
                      {statusSteps.map((step, i) => {
                        const isComplete = i <= currentStep;
                        const isCurrent = i === currentStep;
                        const isLast = i === statusSteps.length - 1;
                        return (
                          <div key={step.key} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: isCurrent ? 1.1 : 1 }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                  isComplete
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-background border-2 border-border text-muted-foreground'
                                }`}
                              >
                                <step.icon className="h-3.5 w-3.5" />
                              </motion.div>
                              {!isLast && (
                                <div className={`w-0.5 h-6 ${isComplete ? 'bg-primary' : 'bg-border'}`} />
                              )}
                            </div>
                            <div className="pb-6">
                              <p className={`text-sm font-medium ${isComplete ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {step.label}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {isCancelled && (
                  <div className="text-center py-4 text-sm text-destructive bg-destructive/5 rounded-xl">
                    This order has been cancelled.
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="bg-background border border-border rounded-2xl p-6">
                <h3 className="font-bold text-base mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-secondary/50">
                      {item.image && (
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>Qty: {item.quantity}</span>
                          {item.color && <span>· {item.color}</span>}
                          {item.size && <span>· {item.size}</span>}
                        </div>
                      </div>
                      <span className="text-sm font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{selectedOrder.shipping === 0 ? 'FREE' : formatPrice(selectedOrder.shipping)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Discount</span>
                      <span>-{formatPrice(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                    <span>Total</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-background border border-border rounded-2xl p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Payment Method</p>
                  <p className="font-semibold text-sm capitalize">{selectedOrder.payment_method === 'cod' ? 'Cash on Delivery' : selectedOrder.payment_method}</p>
                </div>
                <div className="bg-background border border-border rounded-2xl p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Payment Status</p>
                  <p className={`font-semibold text-sm capitalize ${
                    selectedOrder.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>{selectedOrder.payment_status}</p>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
};

export default TrackOrder;
