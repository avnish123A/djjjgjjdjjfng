import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Package, ShoppingCart, Clock, IndianRupee, ArrowUpRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { InlineError, TableRowsSkeleton } from '@/components/admin/AdminSkeletons';

const statusColors: Record<string, string> = {
  placed: 'bg-muted text-muted-foreground',
  confirmed: 'bg-accent/10 text-accent',
  packed: 'bg-accent/20 text-accent',
  shipped: 'bg-success/10 text-success',
  delivered: 'bg-success/20 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

const paymentColors: Record<string, string> = {
  paid: 'bg-success/10 text-success',
  pending: 'bg-accent/10 text-accent',
  failed: 'bg-destructive/10 text-destructive',
  refunded: 'bg-muted text-muted-foreground',
};

const fmtDate = (d?: string | null) => {
  if (!d) return '—';
  const t = new Date(d);
  return isNaN(t.getTime()) ? '—' : t.toLocaleDateString('en-IN');
};

// Each widget has its own query: one failure never takes down the others.
// Errors are thrown (not swallowed) so react-query exposes them as isError.
const AdminDashboard: React.FC = () => {
  const products = useQuery({
    queryKey: ['admin-product-count'],
    queryFn: async ({ signal }) => {
      const { count, error } = await supabase.from('products').select('id', { count: 'exact', head: true }).abortSignal(signal);
      if (error) throw error;
      return count ?? 0;
    },
  });

  const stats = useQuery({
    queryKey: ['admin-order-stats'],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase.from('orders').select('total, order_status, payment_status').abortSignal(signal);
      if (error) throw error;
      const rows = data ?? [];
      return {
        total: rows.length,
        pending: rows.filter(o => ['placed', 'confirmed', 'packed'].includes(o.order_status)).length,
        // Revenue counts only paid orders
        revenue: rows.filter(o => o.payment_status === 'paid').reduce((s, o) => s + (Number(o.total) || 0), 0),
      };
    },
  });

  const recent = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, order_date, customer_name, total, payment_status, order_status')
        .order('order_date', { ascending: false })
        .limit(5)
        .abortSignal(signal);
      if (error) throw error;
      return data ?? [];
    },
  });

  const cards = [
    { label: 'Total products', icon: Package, q: products, value: (products.data ?? 0).toLocaleString('en-IN') },
    { label: 'Total orders', icon: ShoppingCart, q: stats, value: (stats.data?.total ?? 0).toLocaleString('en-IN') },
    { label: 'Orders to fulfil', icon: Clock, q: stats, value: (stats.data?.pending ?? 0).toLocaleString('en-IN') },
    { label: 'Paid revenue', icon: IndianRupee, q: stats, value: `₹${(stats.data?.revenue ?? 0).toLocaleString('en-IN')}` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your store at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border border-border rounded-xl p-5">
            <div className="p-2.5 rounded-lg bg-secondary text-foreground w-fit"><c.icon className="h-5 w-5" /></div>
            <div className="mt-4 min-h-[52px]">
              {c.q.isLoading ? (
                <><Skeleton className="h-7 w-20" /><Skeleton className="h-4 w-24 mt-2" /></>
              ) : c.q.isError ? (
                <>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <button onClick={() => c.q.refetch()} className="text-xs font-semibold text-destructive hover:underline mt-1">Couldn’t load · Retry</button>
                </>
              ) : (
                <><p className="text-2xl font-bold tabular-nums">{c.value}</p><p className="text-sm text-muted-foreground mt-1">{c.label}</p></>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm text-accent hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        {recent.isLoading ? (
          <TableRowsSkeleton rows={5} />
        ) : recent.isError ? (
          <div className="p-6"><InlineError message="Couldn’t load recent orders." onRetry={() => recent.refetch()} /></div>
        ) : recent.data!.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Order #', 'Date', 'Customer', 'Total', 'Payment', 'Status', ''].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.data!.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{o.order_number}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{fmtDate(o.order_date)}</td>
                    <td className="px-6 py-4 text-sm">{o.customer_name || '—'}</td>
                    <td className="px-6 py-4 text-sm font-medium tabular-nums">₹{(Number(o.total) || 0).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${paymentColors[o.payment_status] || 'bg-muted text-muted-foreground'}`}>{o.payment_status}</span></td>
                    <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${statusColors[o.order_status] || 'bg-muted text-muted-foreground'}`}>{o.order_status?.replace(/_/g, ' ')}</span></td>
                    <td className="px-6 py-4"><Link to={`/admin/orders/${o.id}`} className="text-sm text-accent hover:underline">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
