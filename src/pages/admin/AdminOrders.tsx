import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Eye, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const statusOptions = ['all', 'placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

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

const AdminOrders: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('order_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = orders.filter((o: any) => {
    const matchesFilter = filter === 'all' || o.order_status === filter;
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">{orders.length} total orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10 px-3 border border-input rounded-md bg-background text-sm capitalize">
          {statusOptions.map(s => (
            <option key={s} value={s} className="capitalize">{s === 'all' ? 'All Orders' : s}</option>
          ))}
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Order #</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Date</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Customer</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Total</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Payment</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order: any) => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{order.order_number}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(order.order_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">{order.customer_name}</td>
                <td className="px-6 py-4 text-sm font-medium">₹{Number(order.total).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${paymentColors[order.payment_status] || ''}`}>
                    {order.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${statusColors[order.order_status] || ''}`}>
                    {order.order_status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link to={`/admin/orders/${order.id}`} className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
                    <Eye className="h-4 w-4" /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
