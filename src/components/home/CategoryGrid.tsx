import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { Smartphone, Laptop, Tablet, Headphones, Mouse, Watch } from 'lucide-react';
import { motion } from 'framer-motion';

const categoryIcons: Record<string, React.ElementType> = {
  smartphones: Smartphone,
  laptops: Laptop,
  tablets: Tablet,
  'mobile-accessories': Headphones,
  'laptop-accessories': Mouse,
  'smart-gadgets': Watch,
};

const categoryGradients: Record<string, string> = {
  smartphones: 'from-blue-500/10 to-cyan-500/10',
  laptops: 'from-violet-500/10 to-blue-500/10',
  tablets: 'from-emerald-500/10 to-teal-500/10',
  'mobile-accessories': 'from-orange-500/10 to-amber-500/10',
  'laptop-accessories': 'from-pink-500/10 to-rose-500/10',
  'smart-gadgets': 'from-cyan-500/10 to-blue-500/10',
};

const fallbackCategories = [
  { id: 'f1', name: 'Smartphones', slug: 'smartphones', image: '' },
  { id: 'f2', name: 'Laptops', slug: 'laptops', image: '' },
  { id: 'f3', name: 'Tablets', slug: 'tablets', image: '' },
  { id: 'f4', name: 'Accessories', slug: 'mobile-accessories', image: '' },
  { id: 'f5', name: 'Gadgets', slug: 'smart-gadgets', image: '' },
  { id: 'f6', name: 'Laptop Acc.', slug: 'laptop-accessories', image: '' },
];

export const CategoryGrid = () => {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                <div className="w-20 h-20 bg-secondary rounded-2xl" />
                <div className="h-3 w-16 bg-secondary rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <section className="py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-2xl sm:text-3xl tracking-tight">Shop by Category</h2>
          <p className="text-sm text-muted-foreground mt-2">Find exactly what you need</p>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 lg:gap-6">
          {displayCategories.map((cat, i) => {
            const IconComp = categoryIcons[cat.slug] || Smartphone;
            const gradient = categoryGradients[cat.slug] || 'from-blue-500/10 to-cyan-500/10';
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br ${gradient} border border-border/50 flex items-center justify-center category-3d group-hover:glow-blue`}>
                    {cat.image && cat.image !== '/placeholder.svg' ? (
                      <img src={cat.image} alt={cat.name} className="w-12 h-12 lg:w-14 lg:h-14 object-contain" />
                    ) : (
                      <IconComp className="w-8 h-8 lg:w-10 lg:h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                    )}
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-foreground/80 group-hover:text-primary text-center transition-colors">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
