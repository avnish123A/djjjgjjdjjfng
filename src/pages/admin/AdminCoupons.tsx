import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockCoupons, type AdminCoupon } from '@/data/admin-mock-data';
import { toast } from 'sonner';

const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<AdminCoupon[]>(mockCoupons);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ code: '', discount: '', minOrder: '', expiryDate: '' });

  const resetForm = () => {
    setForm({ code: '', discount: '', minOrder: '', expiryDate: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleToggle = (id: string) => {
    setCoupons(prev =>
      prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c)
    );
    toast.success('Coupon status updated');
  };

  const handleDelete = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    toast.success('Coupon deleted');
  };

  const handleEdit = (coupon: AdminCoupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      discount: coupon.discount.toString(),
      minOrder: coupon.minOrder.toString(),
      expiryDate: coupon.expiryDate,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.code || !form.discount) {
      toast.error('Code and Discount are required');
      return;
    }

    if (editingId) {
      setCoupons(prev =>
        prev.map(c => c.id === editingId ? {
          ...c,
          code: form.code.toUpperCase(),
          discount: Number(form.discount),
          minOrder: Number(form.minOrder),
          expiryDate: form.expiryDate,
        } : c)
      );
      toast.success('Coupon updated');
    } else {
      const newCoupon: AdminCoupon = {
        id: Date.now().toString(),
        code: form.code.toUpperCase(),
        discount: Number(form.discount),
        minOrder: Number(form.minOrder) || 0,
        expiryDate: form.expiryDate || '2025-12-31',
        usedCount: 0,
        isActive: true,
      };
      setCoupons(prev => [...prev, newCoupon]);
      toast.success('Coupon added');
    }

    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coupons</h1>
          <p className="text-sm text-muted-foreground mt-1">{coupons.length} coupons</p>
        </div>
        <Button
          variant="accent"
          className="gap-2"
          onClick={() => { resetForm(); setShowForm(true); }}
        >
          <Plus className="h-4 w-4" /> Add Coupon
        </Button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{editingId ? 'Edit Coupon' : 'Add Coupon'}</h2>
            <button onClick={resetForm} className="p-1 hover:bg-secondary rounded-lg">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value }))}
                placeholder="e.g. SAVE20"
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                value={form.discount}
                onChange={(e) => setForm(prev => ({ ...prev, discount: e.target.value }))}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minOrder">Min Order (₹)</Label>
              <Input
                id="minOrder"
                type="number"
                value={form.minOrder}
                onChange={(e) => setForm(prev => ({ ...prev, minOrder: e.target.value }))}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm(prev => ({ ...prev, expiryDate: e.target.value }))}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="accent" onClick={handleSave}>
              {editingId ? 'Update' : 'Save'}
            </Button>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Table */}
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
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 text-sm font-mono font-medium">{coupon.code}</td>
                <td className="px-6 py-4 text-sm">{coupon.discount}%</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">₹{coupon.minOrder}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">{coupon.usedCount}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleToggle(coupon.id)} className="flex items-center gap-1.5">
                    {coupon.isActive ? (
                      <ToggleRight className="h-6 w-6 text-success" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                    )}
                    <span className={`text-xs font-medium ${coupon.isActive ? 'text-success' : 'text-muted-foreground'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoupons;
