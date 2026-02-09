import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Mail, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order') || '';

  return (
    <main className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-lg mx-auto"
        >
          {/* Success Icon */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-5"
            >
              <CheckCircle className="h-10 w-10 text-success" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground text-sm">
              Thank you for your purchase.
            </p>
            {orderNumber && (
              <p className="text-sm font-semibold mt-2">
                Order Number: <span className="text-accent">{orderNumber}</span>
              </p>
            )}
          </div>

          {/* What's Next Card */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-5 w-5 text-accent" />
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
            <Button asChild className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/products">
                Continue Shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default OrderSuccess;
