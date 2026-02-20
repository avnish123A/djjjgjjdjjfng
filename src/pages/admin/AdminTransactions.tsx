import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Loader2, Eye, X, CreditCard, Calendar, Hash, ArrowRightLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const statusColors: Record<string, string> = {
  created: 'bg-muted text-muted-foreground',
  pending: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  paid: 'bg-success/10 text-success',
  failed: 'bg-destructive/10 text-destructive',
  refunded: 'bg-muted text-muted-foreground',
};

const AdminTransactions: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*, orders(order_number, customer_name, customer_email)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(() => transactions.filter((t: any) => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      (t.gateway_payment_id || '').toLowerCase().includes(q) ||
      (t.gateway_order_id || '').toLowerCase().includes(q) ||
      t.gateway.toLowerCase().includes(q) ||
      (t.orders?.order_number || '').toLowerCase().includes(q) ||
      (t.orders?.customer_name || '').toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  }), [transactions, statusFilter, search]);

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
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">{transactions.length} total transactions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by payment ID, order #, customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 px-3 border border-input rounded-md bg-background text-sm capitalize">
          <option value="all">All Status</option>
          <option value="created">Created</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Order</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Customer</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Gateway</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Amount</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Verified</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx: any) => (
              <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-4 py-4 text-sm text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-4 text-sm font-medium">{tx.orders?.order_number || '—'}</td>
                <td className="px-4 py-4 text-sm">{tx.orders?.customer_name || '—'}</td>
                <td className="px-4 py-4 text-sm capitalize">{tx.gateway}</td>
                <td className="px-4 py-4 text-sm font-medium">₹{Number(tx.amount).toLocaleString()}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${statusColors[tx.status] || ''}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm">{tx.verified ? '✅' : '❌'}</td>
                <td className="px-4 py-4">
                  <Button variant="ghost" size="sm" className="gap-1 text-accent" onClick={() => setSelectedTx(tx)}>
                    <Eye className="h-4 w-4" /> Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No transactions found
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTx(null)}>
          <div className="bg-card border border-border rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold flex items-center gap-2"><CreditCard className="h-5 w-5" /> Transaction Details</h2>
              <button onClick={() => setSelectedTx(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${statusColors[selectedTx.status] || ''}`}>
                    {selectedTx.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Verified</p>
                  <p className="font-medium">{selectedTx.verified ? 'Yes ✅' : 'No ❌'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Amount</p>
                  <p className="text-xl font-bold">₹{Number(selectedTx.amount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Currency</p>
                  <p className="font-medium">{selectedTx.currency}</p>
                </div>
              </div>

              <div className="space-y-3 bg-secondary/50 rounded-lg p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment Reference</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
                    <span className="text-muted-foreground">Gateway:</span>
                    <span className="font-medium capitalize">{selectedTx.gateway}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-3.5 w-3.5 text-primary" />
                    <span className="text-muted-foreground">Payment ID:</span>
                    <span className="font-mono text-xs">{selectedTx.gateway_payment_id || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-3.5 w-3.5 text-primary" />
                    <span className="text-muted-foreground">Gateway Order ID:</span>
                    <span className="font-mono text-xs">{selectedTx.gateway_order_id || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-secondary/50 rounded-lg p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Order #:</span>
                    <span className="font-medium">{selectedTx.orders?.order_number || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Customer:</span>
                    <span>{selectedTx.orders?.customer_name || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{selectedTx.orders?.customer_email || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(selectedTx.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(selectedTx.updated_at).toLocaleString()}</span>
                </div>
              </div>

              {selectedTx.raw_response && Object.keys(selectedTx.raw_response).length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Raw Response</h4>
                  <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto max-h-48">
                    {JSON.stringify(selectedTx.raw_response, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
