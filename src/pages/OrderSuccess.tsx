import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order') || '';

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          {orderNumber && (
            <p className="text-sm font-medium mb-8">
              Order Number: <span className="text-accent">{orderNumber}</span>
            </p>
          )}

          <div className="border border-border rounded-xl p-6 mb-8 text-left">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">What's Next?</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• You'll receive an order confirmation email</li>
              <li>• We'll notify you when your order is shipped</li>
              <li>• Track your order from your email</li>
              <li>• Expected delivery in 3-7 business days</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="accent" asChild>
              <Link to="/products" className="gap-2">
                Continue Shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccess;
