import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AdminCustomers: React.FC = () => {
  const [search, setSearch] = useState('');

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

  const filtered = customers.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  );

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
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-sm text-muted-foreground mt-1">{customers.length} total customers</p>
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
    </div>
  );
};

export default AdminCustomers;
