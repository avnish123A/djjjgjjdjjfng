import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const AdminCoupons: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ code: '', discount: '', minOrder: '', expiryDate: '' });

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setForm({ code: '', discount: '', minOrder: '', expiryDate: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase.from('coupons').update({ is_active: !isActive }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success('Coupon status updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success('Coupon deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form.code || !form.discount) throw new Error('Code and Discount are required');
      const couponData = {
        code: form.code.toUpperCase(),
        discount: parseFloat(form.discount),
        min_order: parseFloat(form.minOrder) || 0,
        expiry_date: form.expiryDate || null,
      };

      if (editingId) {
        const { error } = await supabase.from('coupons').update(couponData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('coupons').insert(couponData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success(editingId ? 'Coupon updated' : 'Coupon added');
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleEdit = (coupon: any) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      discount: coupon.discount.toString(),
      minOrder: coupon.min_order.toString(),
      expiryDate: coupon.expiry_date || '',
    });
    setShowForm(true);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coupons</h1>
          <p className="text-sm text-muted-foreground mt-1">{coupons.length} coupons</p>
        </div>
        <Button variant="accent" className="gap-2" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add Coupon
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{editingId ? 'Edit Coupon' : 'Add Coupon'}</h2>
            <button onClick={resetForm} className="p-1 hover:bg-secondary rounded-lg"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input id="code" value={form.code} onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value }))} placeholder="e.g. SAVE20" className="uppercase" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input id="discount" type="number" value={form.discount} onChange={(e) => setForm(prev => ({ ...prev, discount: e.target.value }))} placeholder="0" min="0" max="100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minOrder">Min Order (₹)</Label>
              <Input id="minOrder" type="number" value={form.minOrder} onChange={(e) => setForm(prev => ({ ...prev, minOrder: e.target.value }))} placeholder="0" min="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" type="date" value={form.expiryDate} onChange={(e) => setForm(prev => ({ ...prev, expiryDate: e.target.value }))} />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="accent" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : editingId ? 'Update' : 'Save'}
            </Button>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Code</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Discount</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Min Order</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Expiry</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Used</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon: any) => (
              <tr key={coupon.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 text-sm font-mono font-medium">{coupon.code}</td>
                <td className="px-6 py-4 text-sm">{Number(coupon.discount)}%</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">₹{Number(coupon.min_order).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {coupon.expiry_date ? new Date(coupon.expiry_date).toLocaleDateString() : '—'}
                </td>
                <td className="px-6 py-4 text-sm">{coupon.used_count}</td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleMutation.mutate({ id: coupon.id, isActive: coupon.is_active })} className="flex items-center gap-1.5">
                    {coupon.is_active ? <ToggleRight className="h-6 w-6 text-success" /> : <ToggleLeft className="h-6 w-6 text-muted-foreground" />}
                    <span className={`text-xs font-medium ${coupon.is_active ? 'text-success' : 'text-muted-foreground'}`}>
                      {coupon.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(coupon)} className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteMutation.mutate(coupon.id)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No coupons yet. Add your first coupon!</div>
        )}
      </div>
    </div>
  );
};

export default AdminCoupons;
