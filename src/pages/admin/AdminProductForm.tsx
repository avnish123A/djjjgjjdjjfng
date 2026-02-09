import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colorOptions = [
  { name: 'Black', value: '#1A1A1A' },
  { name: 'White', value: '#F5F5F5' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Brown', value: '#8B4513' },
  { name: 'Gold', value: '#D4874D' },
  { name: 'Silver', value: '#C0C0C0' },
];

const AdminProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [saving, setSaving] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await supabase.from('categories').select('*').order('name');
      return data || [];
    },
  });

  const { data: existing, isLoading: loadingProduct } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
      return data;
    },
    enabled: isEdit,
  });

  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    brand: '',
    price: '',
    original_price: '',
    stock: '0',
    is_active: true,
    selectedSizes: [] as string[],
    selectedColors: [] as string[],
    badge: '',
    images: [] as File[],
    existingImages: [] as string[],
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title || '',
        description: existing.description || '',
        category_id: existing.category_id || '',
        brand: existing.brand || '',
        price: existing.price?.toString() || '',
        original_price: existing.original_price?.toString() || '',
        stock: existing.stock?.toString() || '0',
        is_active: existing.is_active ?? true,
        selectedSizes: existing.sizes || [],
        selectedColors: existing.colors || [],
        badge: existing.badge || '',
        images: [],
        existingImages: existing.images || [],
      });
    }
  }, [existing]);

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleSize = (size: string) => {
    setForm(prev => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size) ? prev.selectedSizes.filter(s => s !== size) : [...prev.selectedSizes, size],
    }));
  };

  const toggleColor = (color: string) => {
    setForm(prev => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(color) ? prev.selectedColors.filter(c => c !== color) : [...prev.selectedColors, color],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeNewImage = (index: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const removeExistingImage = (index: number) => {
    setForm(prev => ({ ...prev, existingImages: prev.existingImages.filter((_, i) => i !== index) }));
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price) {
      toast.error('Title and Price are required');
      return;
    }

    setSaving(true);
    try {
      // Upload new images
      let imageUrls = [...form.existingImages];
      if (form.images.length > 0) {
        const newUrls = await uploadImages(form.images);
        imageUrls = [...imageUrls, ...newUrls];
      }

      const productData = {
        title: form.title,
        description: form.description,
        category_id: form.category_id || null,
        brand: form.brand,
        price: parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        stock: parseInt(form.stock) || 0,
        is_active: form.is_active,
        sizes: form.selectedSizes,
        colors: form.selectedColors,
        badge: form.badge || null,
        images: imageUrls,
      };

      if (isEdit && id) {
        const { error } = await supabase.from('products').update(productData).eq('id', id);
        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
        toast.success('Product added successfully');
      }

      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      navigate('/admin/products');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && loadingProduct) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-secondary rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-sm text-muted-foreground mt-1">{isEdit ? 'Update product details' : 'Fill in the product information'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input id="title" value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="e.g. Classic Leather Watch" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Product description..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select id="category" value={form.category_id} onChange={(e) => updateField('category_id', e.target.value)} className="w-full h-10 px-3 border border-input rounded-md bg-background text-sm">
                <option value="">No category</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" value={form.brand} onChange={(e) => updateField('brand', e.target.value)} placeholder="Brand name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <select id="badge" value={form.badge} onChange={(e) => updateField('badge', e.target.value)} className="w-full h-10 px-3 border border-input rounded-md bg-background text-sm">
                <option value="">None</option>
                <option value="Sale">Sale</option>
                <option value="New">New</option>
                <option value="Best Seller">Best Seller</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Pricing & Stock</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input id="price" type="number" value={form.price} onChange={(e) => updateField('price', e.target.value)} placeholder="0" min="0" step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (₹)</Label>
              <Input id="originalPrice" type="number" value={form.original_price} onChange={(e) => updateField('original_price', e.target.value)} placeholder="0" min="0" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input id="stock" type="number" value={form.stock} onChange={(e) => updateField('stock', e.target.value)} placeholder="0" min="0" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Label>Status:</Label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="status" checked={form.is_active} onChange={() => updateField('is_active', true)} className="accent-accent" />
              <span className="text-sm">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="status" checked={!form.is_active} onChange={() => updateField('is_active', false)} className="accent-accent" />
              <span className="text-sm">Inactive</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Images</h2>
          <div className="flex flex-wrap gap-3">
            {form.existingImages.map((url, i) => (
              <div key={`existing-${i}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border bg-secondary">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 p-0.5 bg-foreground/60 rounded-full text-background">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {form.images.map((file, i) => (
              <div key={`new-${i}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border bg-secondary">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 p-0.5 bg-foreground/60 rounded-full text-background">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">Upload</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Variants */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Variants</h2>
          <div className="space-y-3">
            <Label>Sizes</Label>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button key={size} type="button" onClick={() => toggleSize(size)} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${form.selectedSizes.includes(size) ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:border-accent/50'}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Label>Colors</Label>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map(color => (
                <button key={color.value} type="button" onClick={() => toggleColor(color.value)} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${form.selectedColors.includes(color.value) ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}>
                  <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: color.value }} />
                  {color.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" variant="accent" className="px-8" disabled={saving}>
            {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : (isEdit ? 'Update Product' : 'Save Product')}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
