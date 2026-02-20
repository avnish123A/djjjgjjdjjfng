import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/format';
import { ArrowLeft, Package, MapPin, CreditCard, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface OrderDetail {
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
  shipping_address: any;
  tracking_number: string | null;
  courier_name: string | null;
}

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string | null;
  color: string | null;
  size: string | null;
}

const AccountOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { customer } = useCustomerAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    if (!id || !customer) return;
    setLoading(true);

    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('customer_id', customer.id)
      .single();

    if (orderData) {
      setOrder(orderData as OrderDetail);

      const { data: itemsData } = await supabase
        .from('order_items')
        .select('id, title, price, quantity, image, color, size')
        .eq('order_id', id);

      setItems(itemsData || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, [id, customer?.id]);

  const canCancel = order && ['placed', 'processing'].includes(order.order_status);

  const handleCancel = async () => {
    if (!order) return;
    setCancelling(true);

    const { error } = await supabase
      .from('orders')
      .update({ order_status: 'cancelled' })
      .eq('id', order.id);

    setCancelling(false);

    if (error) {
      toast({ title: 'Error', description: 'Failed to cancel order. Please try again.', variant: 'destructive' });
    } else {
      toast({ title: 'Order Cancelled', description: `Order ${order.order_number} has been cancelled.` });
      setOrder(prev => prev ? { ...prev, order_status: 'cancelled' } : null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <Package className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
        <h2 className="font-semibold text-lg mb-2">Order not found</h2>
        <Link to="/account/orders" className="text-accent text-sm hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  const addr = order.shipping_address || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link to="/account/orders" className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{order.order_number}</h1>
            <p className="text-xs text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize ${getStatusColor(order.order_status)}`}>
            {order.order_status}
          </span>
          {canCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                  <XCircle className="h-4 w-4 mr-1.5" />
                  Cancel Order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel order <strong>{order.order_number}</strong>? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Order</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {cancelling ? 'Cancelling…' : 'Yes, Cancel Order'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Tracking */}
      {order.tracking_number && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <p className="text-sm font-medium text-blue-700">
            Tracking: {order.tracking_number}
            {order.courier_name && ` · ${order.courier_name}`}
          </p>
        </div>
      )}

      {/* Items */}
      <div className="bg-background border border-border rounded-2xl p-6">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <Package className="h-4 w-4" /> Items ({items.length})
        </h2>
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold line-clamp-1">{item.title}</p>
                <div className="flex gap-2 mt-0.5">
                  {item.color && <span className="text-xs text-muted-foreground">Color: {item.color}</span>}
                  {item.size && <span className="text-xs text-muted-foreground">Size: {item.size}</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold shrink-0">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-background border border-border rounded-2xl p-6">
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Shipping Address
          </h2>
          <div className="text-sm text-muted-foreground space-y-0.5">
            <p>{addr.address}</p>
            {addr.address2 && <p>{addr.address2}</p>}
            <p>{addr.city}, {addr.state} {addr.pincode}</p>
          </div>
        </div>

        {/* Payment & Summary */}
        <div className="bg-background border border-border rounded-2xl p-6">
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Payment Summary
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method</span>
              <span className="font-medium capitalize">{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Status</span>
              <span className="font-medium capitalize">{order.payment_status}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOrderDetail;
