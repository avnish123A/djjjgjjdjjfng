import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Eye, Loader2, Download, CheckSquare, Square, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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

function exportCSV(data: any[], filename: string) {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const csv = [
    keys.join(','),
    ...data.map(row => keys.map(k => {
      const val = row[k];
      const str = val === null || val === undefined ? '' : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    }).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const AdminOrders: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState('');
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const queryClient = useQueryClient();

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

  const filtered = useMemo(() => orders.filter((o: any) => {
    const matchesFilter = filter === 'all' || o.order_status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_email.toLowerCase().includes(q) ||
      (o.customer_phone || '').includes(search);
    return matchesFilter && matchesSearch;
  }), [orders, filter, search]);

  const toggleSelect = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((o: any) => o.id)));
    }
  }, [filtered, selected.size]);

  const bulkUpdateMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const ids = Array.from(selected);
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .in('id', ids);
      if (error) throw error;

      // Fire n8n webhooks for each order (async, best-effort)
      const eventMap: Record<string, string> = {
        shipped: 'order_shipped',
        delivered: 'order_delivered',
        cancelled: 'order_cancelled',
      };
      const event = eventMap[newStatus];
      if (event) {
        ids.forEach(id => {
          supabase.functions.invoke('n8n-webhook', {
            body: { event, order_id: id },
          }).catch(() => {});
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setSelected(new Set());
      setShowBulkMenu(false);
      toast.success(`${selected.size} orders updated`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleExport = () => {
    const exportData = filtered.map((o: any) => ({
      order_number: o.order_number,
      date: new Date(o.order_date).toLocaleDateString(),
      customer: o.customer_name,
      email: o.customer_email,
      phone: o.customer_phone || '',
      total: o.total,
      payment_status: o.payment_status,
      order_status: o.order_status,
      tracking_number: o.tracking_number || '',
      courier: o.courier_name || '',
    }));
    exportCSV(exportData, `orders-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Orders exported');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">{orders.length} total orders</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by order #, name, email, phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10 px-3 border border-input rounded-md bg-background text-sm capitalize">
          {statusOptions.map(s => (
            <option key={s} value={s} className="capitalize">{s === 'all' ? 'All Orders' : s}</option>
          ))}
        </select>
      </div>

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-accent/10 border border-accent/20 rounded-lg px-4 py-3">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <div className="relative">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowBulkMenu(!showBulkMenu)}>
              Update Status <ChevronDown className="h-3 w-3" />
            </Button>
            {showBulkMenu && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[160px]">
                {statusOptions.filter(s => s !== 'all').map(s => (
                  <button
                    key={s}
                    onClick={() => bulkUpdateMutation.mutate(s)}
                    disabled={bulkUpdateMutation.isPending}
                    className="w-full text-left px-4 py-2 text-sm capitalize hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setSelected(new Set()); setShowBulkMenu(false); }}>
            Clear
          </Button>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 w-10">
                <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground">
                  {selected.size === filtered.length && filtered.length > 0 ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                </button>
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Order #</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Customer</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Total</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Payment</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order: any) => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-4 py-4">
                  <button onClick={() => toggleSelect(order.id)} className="text-muted-foreground hover:text-foreground">
                    {selected.has(order.id) ? <CheckSquare className="h-4 w-4 text-accent" /> : <Square className="h-4 w-4" />}
                  </button>
                </td>
                <td className="px-4 py-4 text-sm font-medium">{order.order_number}</td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{new Date(order.order_date).toLocaleDateString()}</td>
                <td className="px-4 py-4 text-sm">{order.customer_name}</td>
                <td className="px-4 py-4 text-sm font-medium">₹{Number(order.total).toLocaleString()}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${paymentColors[order.payment_status] || ''}`}>
                    {order.payment_status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${statusColors[order.order_status] || ''}`}>
                    {order.order_status}
                  </span>
                </td>
                <td className="px-4 py-4">
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
