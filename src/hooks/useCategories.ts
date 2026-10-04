import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Category } from '@/types/product';

export const useCategories = () => {
  return useQuery({
    queryKey: ['storefront-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .is('archived_at', null)
        .order('sort_order', { ascending: true })
        .order('name');

      if (error) throw error;

      return (data || []).map((c): Category => ({
        id: c.id,
        name: c.name,
        slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
        image: c.image || '/placeholder.svg',
        description: c.description || undefined,
        sortOrder: c.sort_order,
      }));
    },
  });
};
