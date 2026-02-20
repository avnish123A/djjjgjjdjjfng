import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/format';
import { Package, Clock, CheckCircle, ShoppingBag, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface OrderSummary {
  id: string;
  order_number: string;
  order_status: string;
  total: number;
  created_at: string;
}

const AccountDashboard = () => {
  const { customer, refreshCustomer } = useCustomerAuth();
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!customer) return;
      setLoading(true);
      await refreshCustomer();

      const { data: orders } = await supabase
        .from('orders')
        .select('id, order_number, order_status, total, created_at')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (orders) {
        setRecentOrders(orders);
        const allOrders = await supabase
          .from('orders')
          .select('order_status')
          .eq('customer_id', customer.id);
        
        if (allOrders.data) {
          setStats({
            total: allOrders.data.length,
            pending: allOrders.data.filter(o => ['placed', 'processing'].includes(o.order_status)).length,
            delivered: allOrders.data.filter(o => o.order_status === 'delivered').length,
          });
        }
      }
      setLoading(false);
    };
    fetchData();
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
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {customer?.name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Here's a quick overview of your account</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-background border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <ShoppingBag className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </div>
        </div>
        <div className="bg-background border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>
        <div className="bg-background border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.delivered}</p>
            <p className="text-xs text-muted-foreground">Delivered</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-background border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">Recent Orders</h2>
          <Link to="/account/orders" className="text-sm text-accent hover:underline flex items-center gap-1">
            View All <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No orders yet</p>
            <Link to="/products" className="text-accent text-sm hover:underline mt-2 inline-block">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/account/orders/${order.id}`}
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full capitalize ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                  <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDashboard;
