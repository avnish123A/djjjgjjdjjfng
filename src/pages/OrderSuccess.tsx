import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Mail, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order') || '';

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-lg mx-auto"
        >
          {/* Success Icon */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-10 w-10 text-success" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2 tracking-tight">Order Confirmed!</h1>
            <p className="text-muted-foreground text-sm">
              Thank you for your purchase.
            </p>
            {orderNumber && (
              <p className="text-sm font-semibold mt-3">
                Order Number: <span className="text-accent">{orderNumber}</span>
              </p>
            )}
          </div>

          {/* What's Next Card */}
          <div className="bg-secondary rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-5 w-5" />
              <h3 className="font-semibold">What's Next?</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-muted-foreground">You'll receive a confirmation email with your order details</p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Truck className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-muted-foreground">We'll notify you when your order is shipped (3-7 business days)</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Button asChild className="gap-2 rounded-full bg-foreground text-background hover:bg-foreground/90 px-6">
              <Link to="/products">
                Continue Shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full px-6">
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default OrderSuccess;
