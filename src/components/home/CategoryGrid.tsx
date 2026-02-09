import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCategories } from '@/hooks/useCategories';

export const CategoryGrid = () => {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse aspect-[4/5] rounded-xl bg-secondary" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Shop by Category</h2>
          <p className="text-muted-foreground">Find exactly what you're looking for</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="group relative block aspect-[4/5] rounded-xl overflow-hidden"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent transition-colors duration-300 group-hover:from-foreground/80" />
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                  <h3 className="text-lg lg:text-xl font-bold text-background mb-1">{cat.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
