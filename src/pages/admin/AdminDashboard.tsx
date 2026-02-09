import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Clock,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { mockDashboardStats, mockOrders } from '@/data/admin-mock-data';

const statCards = [
  {
    label: 'Total Products',
    value: mockDashboardStats.totalProducts,
    icon: Package,
    color: 'bg-accent/10 text-accent',
    change: '+12',
  },
  {
    label: 'Total Orders',
    value: mockDashboardStats.totalOrders.toLocaleString(),
    icon: ShoppingCart,
    color: 'bg-success/10 text-success',
    change: '+8%',
  },
  {
    label: 'Pending Orders',
    value: mockDashboardStats.pendingOrders,
    icon: Clock,
    color: 'bg-destructive/10 text-destructive',
    change: '-3',
  },
  {
    label: 'Total Revenue',
    value: `₹${mockDashboardStats.totalRevenue.toLocaleString()}`,
    icon: DollarSign,
    color: 'bg-accent/10 text-accent',
    change: '+15%',
  },
];

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

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-card transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-success">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-sm text-accent hover:underline flex items-center gap-1"
          >
            View All <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
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
              {mockOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">{order.customerName}</td>
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
                      className="text-sm text-accent hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
