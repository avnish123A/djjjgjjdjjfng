import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const AdminProducts: React.FC = () => {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase.from('products').update({ is_active: !isActive }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product status updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const filtered = products.filter((p: any) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    (p.categories?.name || '').toLowerCase().includes(search.toLowerCase())
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} total products</p>
        </div>
        <Button variant="accent" asChild>
          <Link to="/admin/products/add" className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Image</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Title</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Category</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Price</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Stock</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product: any) => (
              <tr key={product.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-3">
                  <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                  {product.badge && <span className="text-xs text-accent">{product.badge}</span>}
                </td>
                <td className="px-6 py-3 text-sm text-muted-foreground capitalize">{product.categories?.name || '—'}</td>
                <td className="px-6 py-3">
                  <span className="text-sm font-medium">₹{Number(product.price).toLocaleString()}</span>
                  {product.original_price && (
                    <span className="text-xs text-muted-foreground line-through ml-2">₹{Number(product.original_price).toLocaleString()}</span>
                  )}
                </td>
                <td className="px-6 py-3 text-sm">{product.stock}</td>
                <td className="px-6 py-3">
                  <button onClick={() => toggleMutation.mutate({ id: product.id, isActive: product.is_active })} className="flex items-center gap-1.5">
                    {product.is_active ? <ToggleRight className="h-6 w-6 text-success" /> : <ToggleLeft className="h-6 w-6 text-muted-foreground" />}
                    <span className={`text-xs font-medium ${product.is_active ? 'text-success' : 'text-muted-foreground'}`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </button>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Link to={`/admin/products/edit/${product.id}`} className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button onClick={() => deleteMutation.mutate(product.id)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {search ? `No products found matching "${search}"` : 'No products yet. Add your first product!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
