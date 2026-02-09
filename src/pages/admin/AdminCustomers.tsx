import React, { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { mockCustomers } from '@/data/admin-mock-data';

const AdminCustomers: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-sm text-muted-foreground mt-1">{mockCustomers.length} total customers</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
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
            {filtered.map((customer) => (
              <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{customer.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{customer.email}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{customer.phone}</td>
                <td className="px-6 py-4 text-sm">{customer.totalOrders}</td>
                <td className="px-6 py-4 text-sm font-medium">₹{customer.totalSpent.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
                    <Eye className="h-4 w-4" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No customers found</div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
