import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const AdminProducts: React.FC = () => {
  const [search, setSearch] = useState('');
  const [productList, setProductList] = useState(products);

  const filtered = productList.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setProductList(prev => prev.filter(p => p.id !== id));
    toast.success('Product deleted');
  };

  const handleToggle = (id: string) => {
    setProductList(prev =>
      prev.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p)
    );
    toast.success('Product status updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{productList.length} total products</p>
        </div>
        <Button variant="accent" asChild>
          <Link to="/admin/products/add" className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Image</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Title</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Category</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Price</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Brand</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-3">
                  <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                  {product.badge && (
                    <span className="text-xs text-accent">{product.badge}</span>
                  )}
                </td>
                <td className="px-6 py-3 text-sm text-muted-foreground capitalize">{product.category}</td>
                <td className="px-6 py-3">
                  <span className="text-sm font-medium">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through ml-2">₹{product.originalPrice}</span>
                  )}
                </td>
                <td className="px-6 py-3 text-sm text-muted-foreground">{product.brand}</td>
                <td className="px-6 py-3">
                  <button onClick={() => handleToggle(product.id)} className="flex items-center gap-1.5">
                    {product.inStock ? (
                      <ToggleRight className="h-6 w-6 text-success" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                    )}
                    <span className={`text-xs font-medium ${product.inStock ? 'text-success' : 'text-muted-foreground'}`}>
                      {product.inStock ? 'Active' : 'Inactive'}
                    </span>
                  </button>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
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
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No products found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
