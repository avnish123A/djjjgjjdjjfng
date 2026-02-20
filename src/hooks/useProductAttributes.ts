import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProductAttribute {
  id: string;
  product_id: string;
  attribute_name: string;
  attribute_label: string;
  attribute_type: string;
  is_required: boolean;
  sort_order: number;
  values: ProductAttributeValue[];
}

export interface ProductAttributeValue {
  id: string;
  attribute_id: string;
  value: string;
  price_modifier: number;
  stock_quantity: number;
  sku: string | null;
  is_active: boolean;
  sort_order: number;
}

export const useProductAttributes = (productId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!productId) return;
    const channel = supabase
      .channel(`product-attrs-${productId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_attributes', filter: `product_id=eq.${productId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['product-attributes', productId] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_attribute_values' }, () => {
        queryClient.invalidateQueries({ queryKey: ['product-attributes', productId] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [productId, queryClient]);

  return useQuery({
    queryKey: ['product-attributes', productId],
    queryFn: async () => {
      const { data: attrs, error } = await supabase
        .from('product_attributes')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order');

      if (error) throw error;
      if (!attrs || attrs.length === 0) return [];

      const attrIds = attrs.map(a => a.id);
      const { data: values, error: valError } = await supabase
        .from('product_attribute_values')
        .select('*')
        .in('attribute_id', attrIds)
        .order('sort_order');

      if (valError) throw valError;

      return attrs.map(attr => ({
        ...attr,
        values: (values || []).filter(v => v.attribute_id === attr.id),
      })) as ProductAttribute[];
    },
    enabled: !!productId,
    staleTime: 30_000,
  });
};
