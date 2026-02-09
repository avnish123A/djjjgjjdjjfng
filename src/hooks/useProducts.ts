import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/product';

export const useProducts = () => {
  return useQuery({
    queryKey: ['storefront-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((p): Product => ({
        id: p.id,
        name: p.title,
        brand: p.brand || '',
        price: p.price,
        originalPrice: p.original_price || undefined,
        image: p.images?.[0] || '/placeholder.svg',
        images: p.images || [],
        rating: p.rating || 0,
        reviewCount: p.review_count || 0,
        categoryId: p.category_id || undefined,
        categoryName: (p.categories as any)?.name || 'Uncategorized',
        badge: p.badge || undefined,
        colors: p.colors || undefined,
        sizes: p.sizes || undefined,
        inStock: p.stock > 0,
        stock: p.stock,
        description: p.description || '',
      }));
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['storefront-product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single();

      if (error) throw error;

      const p = data;
      return {
        id: p.id,
        name: p.title,
        brand: p.brand || '',
        price: p.price,
        originalPrice: p.original_price || undefined,
        image: p.images?.[0] || '/placeholder.svg',
        images: p.images || [],
        rating: p.rating || 0,
        reviewCount: p.review_count || 0,
        categoryId: p.category_id || undefined,
        categoryName: (p.categories as any)?.name || 'Uncategorized',
        badge: p.badge || undefined,
        colors: p.colors || undefined,
        sizes: p.sizes || undefined,
        inStock: p.stock > 0,
        stock: p.stock,
        description: p.description || '',
      } as Product;
    },
    enabled: !!id,
  });
};
