import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/product';

const mapProduct = (p: any): Product => ({
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
  lowStockThreshold: p.low_stock_threshold ?? 5,
  trackInventory: p.track_inventory ?? true,
});

export const useProducts = () => {
  const queryClient = useQueryClient();

  // Supabase Realtime subscription for instant product updates
  useEffect(() => {
    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          // Invalidate to refetch with fresh data
          queryClient.invalidateQueries({ queryKey: ['storefront-products'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['storefront-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapProduct);
    },
    staleTime: 30_000, // 30s short cache
  });
};

export const useProduct = (id: string) => {
  const queryClient = useQueryClient();

  // Realtime for single product
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`product-${id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products', filter: `id=eq.${id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['storefront-product', id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient]);

  return useQuery({
    queryKey: ['storefront-product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return mapProduct(data);
    },
    enabled: !!id,
    staleTime: 30_000,
  });
};
