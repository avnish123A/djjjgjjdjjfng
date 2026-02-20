import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Loader2, Eye, X, ShoppingCart, Mail, Phone, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AdminCustomers: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch orders for selected customer
  const { data: customerOrders = [] } = useQuery({
    queryKey: ['customer-orders', selectedCustomer?.id],
    queryFn: async () => {
      if (!selectedCustomer) return [];
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', selectedCustomer.id)
        .order('order_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCustomer,
  });

  const filtered = useMemo(() => customers.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  ), [customers, search]);

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
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">{customers.length} total customers</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Name</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Email</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Phone</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Orders</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Total Spent</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Joined</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer: any) => (
              <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{customer.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{customer.email}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{customer.phone || '—'}</td>
                <td className="px-6 py-4 text-sm">{customer.total_orders}</td>
                <td className="px-6 py-4 text-sm font-medium">₹{Number(customer.total_spent).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(customer.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm" className="gap-1 text-accent" onClick={() => setSelectedCustomer(customer)}>
                    <Eye className="h-4 w-4" /> View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {customers.length === 0 ? 'No customers yet' : 'No customers found'}
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold">Customer Details</h2>
              <button onClick={() => setSelectedCustomer(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedCustomer.name}</p>
                    <p className="text-xs text-muted-foreground">Customer</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" /> {selectedCustomer.email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> {selectedCustomer.phone || '—'}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" /> Joined {new Date(selectedCustomer.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">{selectedCustomer.total_orders}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">₹{Number(selectedCustomer.total_spent).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" /> Order History
                </h3>
                {customerOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No orders found</p>
                ) : (
                  <div className="space-y-2">
                    {customerOrders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between bg-secondary/30 rounded-lg px-4 py-3 text-sm">
                        <div>
                          <span className="font-medium">{order.order_number}</span>
                          <span className="text-muted-foreground ml-2">{new Date(order.order_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">₹{Number(order.total).toLocaleString()}</span>
                          <span className="capitalize text-xs px-2 py-0.5 rounded bg-muted">{order.order_status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
