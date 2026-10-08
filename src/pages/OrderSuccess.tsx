import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Truck, Clock, Search, BadgeCheck, MapPin, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
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

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="max-w-lg mx-auto"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-2xl font-bold mb-2 tracking-tight">Order placed</h1>
            <p className="text-muted-foreground text-sm">Thank you for shopping with CartZebra.</p>
            {orderNumber && (
              <p className="text-sm font-semibold mt-3 break-all">
                Order number: <span className="text-accent">{orderNumber}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mb-8 text-sm text-center">
            <Clock className="h-4 w-4 text-accent shrink-0" />
            <span className="font-medium">{DELIVERY_ESTIMATE_TEXT}</span>
          </div>

          <div className="bg-secondary rounded-2xl p-5 sm:p-6 mb-8">
            <h3 className="font-semibold mb-5 text-sm">Order progress</h3>
            <ol className="grid grid-cols-3 sm:grid-cols-6 gap-y-5 gap-x-2">
              {timelineSteps.map((step, i) => {
                const done = i === 0;
                return (
                  <li key={step.label} className="flex flex-col items-center text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-foreground text-background' : 'bg-border text-muted-foreground'}`}>
                      <step.icon className="h-4 w-4" />
                    </div>
                    <span className={`text-[10px] mt-2 leading-tight ${done ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{step.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="bg-secondary rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-5 w-5" />
              <h3 className="font-semibold">What's next?</h3>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-3"><Search className="h-4 w-4 mt-0.5 shrink-0" />
                Check your order status anytime on the Track Order page using the email and phone number from checkout.</p>
              <p className="flex items-start gap-3"><Truck className="h-4 w-4 mt-0.5 shrink-0" />
                The expected delivery date appears on Track Order once your order is shipped.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="gap-2 rounded-full bg-foreground text-background hover:bg-foreground/90 px-6">
              <Link to={orderNumber ? `/track-order?order=${encodeURIComponent(orderNumber)}` : '/track-order'}>Track order</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full px-6 gap-2">
              <Link to="/products">Continue shopping <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default OrderSuccess;
