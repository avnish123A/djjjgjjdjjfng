import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { motion } from 'framer-motion';

const fallbackCategories = [
  { id: 'f1', name: 'Single-Origin Oils', slug: 'single-origin-oils', image: 'https://images.unsplash.com/photo-1474979266404-7eaabdf50494?w=800&q=80' },
  { id: 'f2', name: 'Artisan Vinegars', slug: 'artisan-vinegars', image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&q=80' },
  { id: 'f3', name: 'Heritage Spices', slug: 'heritage-spices', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80' },
  { id: 'f4', name: 'Wild Honey', slug: 'wild-honey', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80' },
  { id: 'f5', name: 'Rare Teas', slug: 'rare-teas', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80' },
  { id: 'f6', name: 'Cured Salts', slug: 'cured-salts', image: 'https://images.unsplash.com/photo-1518110925495-5fe2c8dcf2f5?w=800&q=80' },
];

export const CategoryGrid = () => {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] shimmer rounded-sm" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="font-utility text-[10px] tracking-[0.3em] text-foreground/40 mb-3">THE COLLECTION</p>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tighter">Shop by Origin</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {displayCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="group relative block overflow-hidden aspect-[4/5]"
              >
                <img
                  src={cat.image || '/placeholder.svg'}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover sensory-hover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/60 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  <h3 className="font-display text-lg sm:text-xl text-white tracking-tight mb-1">{cat.name}</h3>
                  <span className="font-utility text-[9px] tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors duration-500">
                    EXPLORE →
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
