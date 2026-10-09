import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Truck, Clock, Search, BadgeCheck, MapPin, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useReducedMotion } from 'framer-motion';
import { PurchaseParcel } from '@/components/brand/PurchaseParcel';
import { DELIVERY_ESTIMATE_TEXT } from '@/lib/delivery';

// Same stages as the Track Order page. Only "Order Placed" is known to be complete here.
const timelineSteps = [
  { label: 'Order Placed', icon: CheckCircle },
  { label: 'Confirmed', icon: BadgeCheck },
  { label: 'Packed', icon: Package },
  { label: 'Shipped', icon: Truck },
  { label: 'Out for Delivery', icon: MapPin },
  { label: 'Delivered', icon: Home },
];

const ORDER_RE = /^[A-Za-z0-9-]{1,40}$/;

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const raw = searchParams.get('order') || '';
  const orderNumber = ORDER_RE.test(raw) ? raw : '';
  const reduced = useReducedMotion();

  return (
    <main className="purchase-theme pb-[calc(84px+env(safe-area-inset-bottom))] lg:pb-16">
      <div className="container mx-auto px-4 pt-8 lg:pt-12 max-w-3xl">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
          className="mx-auto"
        >
          <div className="text-center mb-7">
            <p className="text-sm font-semibold">CartZebra <span className="text-muted-foreground font-normal">/ Your order</span></p>
            <PurchaseParcel />
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">Thank you for your order.</h1>
            <p className="text-muted-foreground text-sm">A little something to look forward to.</p>
            {orderNumber && (
              <p className="text-sm font-semibold mt-3 break-all">
                Order reference: <span className="text-foreground">{orderNumber}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Button asChild className="gap-2 rounded-xl h-12 px-7">
              <Link to={orderNumber ? `/track-order?order=${encodeURIComponent(orderNumber)}` : '/track-order'}>Track My Order <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" asChild className="rounded-xl h-12 px-6 gap-2">
              <Link to="/products">Continue shopping</Link>
            </Button>
          </div>

          <div className="border-y border-border py-6 mb-6">
            <h2 className="font-semibold mb-2 text-sm">Your order's journey</h2>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">Verify your email and phone on Track Order for confirmed payment and live progress.</p>
            <ol className="grid grid-cols-3 sm:grid-cols-6 gap-y-5 gap-x-2">
              {timelineSteps.map((step, i) => {
                return (
                  <li key={step.label} className="flex flex-col items-center text-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${i === 0 ? 'bg-foreground text-background' : 'bg-card border border-border text-muted-foreground'}`}>
                      <step.icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] mt-2 leading-snug text-muted-foreground">{step.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="py-3 mb-3">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-5 w-5" />
              <h3 className="font-semibold">What's next?</h3>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-3"><Search className="h-4 w-4 mt-0.5 shrink-0" />
                Check your order status anytime on the Track Order page using the email and phone number from checkout.</p>
              <p className="flex items-start gap-3"><Truck className="h-4 w-4 mt-0.5 shrink-0" />
                Your expected delivery date appears on Track Order when it is available.</p>
              <p className="flex items-start gap-3"><Clock className="h-4 w-4 mt-0.5 shrink-0" /><span>{DELIVERY_ESTIMATE_TEXT}. This is our usual delivery window, not a confirmed date for your order.</span></p>
            </div>
          </div>

        </motion.div>
      </div>
    </main>
  );
};

export default OrderSuccess;
