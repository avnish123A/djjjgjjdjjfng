import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

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

  if (categories.length === 0) return null;

  return (
    <section className="py-14 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 lg:mb-14"
        >
          <div>
            <p className="font-utility text-foreground/45 mb-3">Explore the edit</p>
            <h2 className="font-display text-3xl sm:text-4xl">Shop by category</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">Six considered worlds, photographed as one CartZebra collection.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="group relative block overflow-hidden aspect-[4/5] rounded-lg bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <img
                  src={cat.image || '/placeholder.svg'}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.035]"
                  loading="lazy"
                  width={1024}
                  height={1280}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-primary-foreground">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg sm:text-xl mb-1">{cat.name}</h3>
                      <span className="font-utility text-primary-foreground/70">Explore</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
