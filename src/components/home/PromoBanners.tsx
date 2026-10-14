import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const PromoBanners = () => {
  const { data: banners = [] } = useQuery({
    queryKey: ['promo-banners'],
    queryFn: async () => {
      const { data, error } = await supabase.from('promo_banners').select('*').eq('is_active', true).is('archived_at', null).order('sort_order');
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60_000,
  });

  if (banners.length === 0) return null;

  return (
    <section className="py-10 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
          {banners.map((banner, i) => (
            <motion.div
              key={banner.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <Link
                to={banner.link}
                className="group relative block overflow-hidden  rounded-lg bg-secondary"
              >
                <img src={banner.image_url} alt={banner.image_alt || banner.title} className="w-full aspect-[16/9] object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.025]" loading="lazy" width={1536} height={1024} />

                <div className="flex flex-col p-5 sm:p-6 bg-card text-foreground">
                  {banner.eyebrow && <p className="font-utility text-primary mb-3">{banner.eyebrow}</p>}
                  <h3 className="font-display text-2xl sm:text-3xl leading-tight mb-3">{banner.title}</h3>
                  <p className="text-xs sm:text-sm leading-5 text-muted-foreground mb-5">{banner.subtitle}</p>
                  <span className="inline-flex items-center gap-2 font-utility text-primary">
                    Explore <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={1.5} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
