import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  cta_primary_text: string | null;
  cta_primary_link: string | null;
  cta_secondary_text: string | null;
  cta_secondary_link: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const useHeroSlides = (activeOnly = false) => {
  return useQuery({
    queryKey: ['hero-slides', activeOnly],
    queryFn: async () => {
      let query = supabase
        .from('hero_slides')
        .select('*')
        .order('sort_order', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as HeroSlide[];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpsertHeroSlide = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slide: Partial<HeroSlide> & { id?: string }) => {
      if (slide.id) {
        const { error } = await supabase
          .from('hero_slides')
          .update(slide)
          .eq('id', slide.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('hero_slides').insert(slide);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hero-slides'] }),
  });
};

export const useDeleteHeroSlide = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hero-slides'] }),
  });
};
