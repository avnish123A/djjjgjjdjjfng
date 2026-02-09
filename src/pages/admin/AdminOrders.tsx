import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { mockOrders } from '@/data/admin-mock-data';

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

  const filtered = mockOrders.filter(o => {
    const matchesFilter = filter === 'all' || o.orderStatus === filter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">{mockOrders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 px-3 border border-input rounded-md bg-background text-sm capitalize"
        >
          {statusOptions.map(s => (
            <option key={s} value={s} className="capitalize">
              {s === 'all' ? 'All Orders' : s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Order #</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Date</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Customer</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Items</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Total</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Payment</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{order.orderNumber}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">{order.customerName}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{order.items.length}</td>
                <td className="px-6 py-4 text-sm font-medium">₹{order.total}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${paymentColors[order.paymentStatus]}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${statusColors[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                  >
                    <Eye className="h-4 w-4" /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
