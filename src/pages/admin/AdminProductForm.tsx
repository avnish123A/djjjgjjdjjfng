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
import ProductAttributeEditor, { type AttributeFormData } from '@/components/admin/ProductAttributeEditor';
import { PRODUCT_TYPES, getProductType } from '@/data/productTypes';

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

  // Load existing attributes
  const { data: existingAttrs = [] } = useQuery({
    queryKey: ['admin-product-attrs', id],
    queryFn: async () => {
      if (!id) return [];
      const { data: attrs } = await supabase
        .from('product_attributes')
        .select('*')
        .eq('product_id', id)
        .order('sort_order');
      if (!attrs || attrs.length === 0) return [];
      const attrIds = attrs.map(a => a.id);
      const { data: values } = await supabase
        .from('product_attribute_values')
        .select('*')
        .in('attribute_id', attrIds)
        .order('sort_order');
      return attrs.map(a => ({
        ...a,
        values: (values || []).filter(v => v.attribute_id === a.id),
      }));
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
    low_stock_threshold: '5',
    track_inventory: true,
    is_active: true,
    badge: '',
    product_type: 'standard',
    images: [] as File[],
    existingImages: [] as string[],
  });

  const [attributes, setAttributes] = useState<AttributeFormData[]>([]);

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
        low_stock_threshold: (existing as any).low_stock_threshold?.toString() || '5',
        track_inventory: (existing as any).track_inventory ?? true,
        is_active: existing.is_active ?? true,
        badge: existing.badge || '',
        product_type: (existing as any).product_type || 'standard',
        images: [],
        existingImages: existing.images || [],
      });
    }
  }, [existing]);

  // Load existing attributes into form
  useEffect(() => {
    if (existingAttrs.length > 0) {
      setAttributes(existingAttrs.map((a: any) => ({
        id: a.id,
        attribute_name: a.attribute_name,
        attribute_label: a.attribute_label,
        attribute_type: a.attribute_type,
        is_required: a.is_required,
        sort_order: a.sort_order,
        values: (a.values || []).map((v: any) => ({
          id: v.id,
          value: v.value,
          price_modifier: Number(v.price_modifier) || 0,
          stock_quantity: v.stock_quantity || 0,
          sku: v.sku || '',
          is_active: v.is_active,
          sort_order: v.sort_order,
        })),
      })));
    }
  }, [existingAttrs]);

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleProductTypeChange = (typeId: string) => {
    updateField('product_type', typeId);
    const pType = getProductType(typeId);
    if (pType && pType.suggestedAttributes.length > 0 && attributes.length === 0) {
      setAttributes(pType.suggestedAttributes.map((sa, i) => ({
        attribute_name: sa.name,
        attribute_label: sa.label,
        attribute_type: sa.type,
        is_required: true,
        sort_order: i,
        values: (sa.values || []).map((v, vi) => ({
          value: v,
          price_modifier: 0,
          stock_quantity: 0,
          sku: '',
          is_active: true,
          sort_order: vi,
        })),
      })));
    }
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
      let imageUrls = [...form.existingImages];
      if (form.images.length > 0) {
        const newUrls = await uploadImages(form.images);
        imageUrls = [...imageUrls, ...newUrls];
      }

      const priceVal = parseFloat(form.price);
      const stockVal = parseInt(form.stock) || 0;
      const thresholdVal = parseInt(form.low_stock_threshold) || 5;

      if (priceVal < 0) { toast.error('Price cannot be negative'); setSaving(false); return; }
      if (stockVal < 0) { toast.error('Stock cannot be negative'); setSaving(false); return; }

      const productData = {
        title: form.title.trim(),
        description: form.description,
        category_id: form.category_id || null,
        brand: form.brand,
        price: priceVal,
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        stock: stockVal,
        low_stock_threshold: thresholdVal,
        track_inventory: form.track_inventory,
        is_active: form.is_active,
        badge: form.badge || null,
        images: imageUrls,
        product_type: form.product_type,
        sizes: [] as string[],
        colors: [] as string[],
      };

      let productId = id;

      if (isEdit && id) {
        const { error } = await supabase.from('products').update(productData as any).eq('id', id);
        if (error) throw error;
      } else {
        const { data: newProduct, error } = await supabase.from('products').insert(productData as any).select('id').single();
        if (error) throw error;
        productId = newProduct.id;
      }

      // Save attributes
      if (productId) {
        // Delete old attributes (cascade deletes values)
        if (isEdit) {
          await supabase.from('product_attributes').delete().eq('product_id', productId);
        }

        for (let ai = 0; ai < attributes.length; ai++) {
          const attr = attributes[ai];
          const { data: savedAttr, error: attrErr } = await supabase
            .from('product_attributes')
            .insert({
              product_id: productId,
              attribute_name: attr.attribute_name,
              attribute_label: attr.attribute_label,
              attribute_type: attr.attribute_type,
              is_required: attr.is_required,
              sort_order: ai,
            })
            .select('id')
            .single();

          if (attrErr) throw attrErr;

          if (savedAttr && attr.values.length > 0) {
            const valInserts = attr.values.map((v, vi) => ({
              attribute_id: savedAttr.id,
              value: v.value,
              price_modifier: v.price_modifier,
              stock_quantity: v.stock_quantity,
              sku: v.sku || null,
              is_active: v.is_active,
              sort_order: vi,
            }));
            const { error: valErr } = await supabase.from('product_attribute_values').insert(valInserts);
            if (valErr) throw valErr;
          }
        }
      }

      toast.success(isEdit ? 'Product updated successfully' : 'Product added successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['storefront-products'] });
      queryClient.invalidateQueries({ queryKey: ['storefront-product'] });
      queryClient.invalidateQueries({ queryKey: ['product-attributes'] });
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
        {/* Product Type */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Product Type</h2>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_TYPES.map(pt => (
              <button
                key={pt.id}
                type="button"
                onClick={() => handleProductTypeChange(pt.id)}
                className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  form.product_type === pt.id
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>

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
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
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

        {/* Pricing & Inventory */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Base Price (₹) *</Label>
              <Input id="price" type="number" value={form.price} onChange={(e) => updateField('price', e.target.value)} placeholder="0" min="0" step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Compare Price (₹)</Label>
              <Input id="originalPrice" type="number" value={form.original_price} onChange={(e) => updateField('original_price', e.target.value)} placeholder="0" min="0" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Base Stock</Label>
              <Input id="stock" type="number" value={form.stock} onChange={(e) => updateField('stock', e.target.value)} placeholder="0" min="0" />
              {attributes.length > 0 && (
                <p className="text-[10px] text-muted-foreground">Variant stock is managed per attribute value below</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lowStock">Low Stock Threshold</Label>
              <Input id="lowStock" type="number" value={form.low_stock_threshold} onChange={(e) => updateField('low_stock_threshold', e.target.value)} placeholder="5" min="0" />
            </div>
            <div className="space-y-2 flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.track_inventory} onChange={(e) => updateField('track_inventory', e.target.checked)} className="accent-accent w-4 h-4" />
                <span className="text-sm font-medium">Track Inventory</span>
              </label>
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

          {parseInt(form.stock) > 0 && parseInt(form.stock) <= parseInt(form.low_stock_threshold) && (
            <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 text-sm">
              <span className="font-medium">⚠ Low stock warning:</span> Current stock ({form.stock}) is at or below threshold ({form.low_stock_threshold})
            </div>
          )}
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

        {/* Dynamic Attributes */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div>
            <h2 className="font-semibold">Product Attributes & Variants</h2>
            <p className="text-xs text-muted-foreground mt-1">Add size, weight, color, or any custom attribute. Each value can have its own price modifier and stock.</p>
          </div>
          <ProductAttributeEditor attributes={attributes} onChange={setAttributes} />
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
