import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const banners = [
  {
    title: 'AMOLED Phones Under ₹25,000',
    subtitle: 'Best display phones at budget prices',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
    link: '/products?category=smartphones',
    gradient: 'from-blue-600/90 to-cyan-600/90',
  },
  {
    title: 'Laptop Deals of the Week',
    subtitle: 'Up to 25% off on select laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    link: '/products?category=laptops',
    gradient: 'from-violet-600/90 to-blue-600/90',
  },
];

export const PromoBanners = () => {
  return (
    <section className="py-8 lg:py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {banners.map((banner, i) => (
            <motion.div
              key={banner.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={banner.link}
                className="group relative rounded-2xl overflow-hidden block min-h-[180px] card-3d"
              >
                <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
                <div className="relative p-6 lg:p-8 flex flex-col justify-center h-full min-h-[180px]">
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-white/70 uppercase tracking-widest mb-2">
                    <Zap className="h-3 w-3 fill-white/70" />
                    Limited Offer
                  </div>
                  <h3 className="font-display text-xl lg:text-2xl text-white mb-1">{banner.title}</h3>
                  <p className="text-sm text-white/60 mb-4">{banner.subtitle}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:gap-2.5 transition-all">
                    Shop Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
