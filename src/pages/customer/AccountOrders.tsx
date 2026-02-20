import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/format';
import { Package, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Order {
  id: string;
  order_number: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  total: number;
  created_at: string;
}

const AccountOrders = () => {
  const { customer } = useCustomerAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customer) return;
      setLoading(true);
      const { data } = await supabase
        .from('orders')
        .select('id, order_number, order_status, payment_status, payment_method, total, created_at')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();
  }, [customer?.id]);

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
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-background border border-border rounded-2xl p-12 text-center">
          <Package className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <h2 className="font-semibold text-lg mb-2">No orders yet</h2>
          <p className="text-muted-foreground text-sm mb-4">Start shopping to see your orders here</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/account/orders/${order.id}`}
              className="block bg-background border border-border rounded-2xl p-5 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                      {' · '}
                      <span className="capitalize">{order.payment_method === 'cod' ? 'COD' : order.payment_method}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(order.total)}</p>
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize inline-block mt-1 ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountOrders;
