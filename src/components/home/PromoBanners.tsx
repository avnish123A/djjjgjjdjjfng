import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const banners = [
  {
    title: 'The Harvest Collection',
    subtitle: 'Autumn 2025 oils, freshly pressed',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaabdf50494?w=800&q=80',
    link: '/products?category=single-origin-oils',
  },
  {
    title: 'Rare First Flush Teas',
    subtitle: 'Limited quantities from Darjeeling & Fujian',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80',
    link: '/products?category=rare-teas',
  },
];

export const PromoBanners = () => {
  return (
    <section className="py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          {banners.map((banner, i) => (
            <motion.div
              key={banner.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <Link
                to={banner.link}
                className="group relative block overflow-hidden aspect-[16/9]"
              >
                <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover sensory-hover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <h3 className="font-display text-xl sm:text-2xl text-white tracking-tight mb-1">{banner.title}</h3>
                  <p className="font-display-italic text-sm text-white/50 mb-4">{banner.subtitle}</p>
                  <span className="inline-flex items-center gap-2 font-utility text-[9px] tracking-[0.2em] text-white/50 group-hover:text-white transition-colors duration-500">
                    SHOP NOW <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-500" strokeWidth={1.5} />
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
