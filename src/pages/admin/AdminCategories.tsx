import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockCategories, type AdminCategory } from '@/data/admin-mock-data';
import { toast } from 'sonner';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<AdminCategory[]>(mockCategories);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');

  const handleToggle = (id: string) => {
    setCategories(prev =>
      prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c)
    );
    toast.success('Category status updated');
  };

  const handleDelete = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    toast.success('Category deleted');
  };

  const handleEdit = (cat: AdminCategory) => {
    setEditingId(cat.id);
    setFormName(cat.name);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (editingId) {
      setCategories(prev =>
        prev.map(c => c.id === editingId ? { ...c, name: formName } : c)
      );
      toast.success('Category updated');
    } else {
      const newCat: AdminCategory = {
        id: Date.now().toString(),
        name: formName,
        image: '/placeholder.svg',
        productsCount: 0,
        isActive: true,
      };
      setCategories(prev => [...prev, newCat]);
      toast.success('Category added');
    }

    setShowForm(false);
    setEditingId(null);
    setFormName('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">{categories.length} categories</p>
        </div>
        <Button
          variant="accent"
          className="gap-2"
          onClick={() => { setShowForm(true); setEditingId(null); setFormName(''); }}
        >
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{editingId ? 'Edit Category' : 'Add Category'}</h2>
            <button onClick={handleCancel} className="p-1 hover:bg-secondary rounded-lg">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="catName">Category Name</Label>
              <Input
                id="catName"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Electronics"
              />
            </div>
            <Button variant="accent" onClick={handleSave}>
              {editingId ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Name</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Products</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{cat.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{cat.productsCount}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleToggle(cat.id)} className="flex items-center gap-1.5">
                    {cat.isActive ? (
                      <ToggleRight className="h-6 w-6 text-success" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                    )}
                    <span className={`text-xs font-medium ${cat.isActive ? 'text-success' : 'text-muted-foreground'}`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
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

export default AdminCategories;
