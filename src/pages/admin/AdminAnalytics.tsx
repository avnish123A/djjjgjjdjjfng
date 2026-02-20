import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, TrendingUp, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { toast } from 'sonner';

const COLORS = ['hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--destructive))', 'hsl(var(--muted-foreground))', '#8884d8', '#ffc658'];

function exportCSV(data: any[], filename: string) {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const csv = [
    keys.join(','),
    ...data.map(row => keys.map(k => `"${String(row[k] ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const AdminAnalytics: React.FC = () => {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-analytics-orders', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_date, total, order_status, payment_status, order_items(title, price, quantity)')
        .gte('order_date', `${startDate}T00:00:00`)
        .lte('order_date', `${endDate}T23:59:59`)
        .order('order_date', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // Sales over time (daily)
  const dailySales = useMemo(() => {
    const map = new Map<string, { date: string; revenue: number; orders: number }>();
    orders.forEach((o: any) => {
      const day = new Date(o.order_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      const existing = map.get(day) || { date: day, revenue: 0, orders: 0 };
      existing.revenue += Number(o.total);
      existing.orders += 1;
      map.set(day, existing);
    });
    return Array.from(map.values());
  }, [orders]);

  // Order status distribution
  const statusDist = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o: any) => {
      map.set(o.order_status, (map.get(o.order_status) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // Top products
  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; revenue: number; quantity: number }>();
    orders.forEach((o: any) => {
      (o.order_items || []).forEach((item: any) => {
        const existing = map.get(item.title) || { name: item.title, revenue: 0, quantity: 0 };
        existing.revenue += Number(item.price) * item.quantity;
        existing.quantity += item.quantity;
        map.set(item.title, existing);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [orders]);

  // Summary stats
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((s: number, o: any) => s + Number(o.total), 0);
    const totalOrders = orders.length;
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return { totalRevenue, totalOrders, avgOrder };
  }, [orders]);

  const handleExport = () => {
    exportCSV(dailySales, `sales-report-${startDate}-to-${endDate}.csv`);
    toast.success('Sales report exported');
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
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Sales performance & insights</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Date filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <Label className="text-xs">From</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-40" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">To</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-40" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold mt-1">{stats.totalOrders}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Avg. Order Value</p>
          <p className="text-2xl font-bold mt-1">₹{Math.round(stats.avgOrder).toLocaleString()}</p>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Revenue Over Time</h2>
        {dailySales.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center py-12 text-muted-foreground">No data for selected period</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status distribution */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Calendar className="h-4 w-4" /> Order Status Distribution</h2>
          {statusDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusDist} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center py-12 text-muted-foreground">No data</p>
          )}
        </div>

        {/* Top products */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Top Products by Revenue</h2>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={75} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center py-12 text-muted-foreground">No data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
