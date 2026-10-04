import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/products/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const FlashDeals = () => {
  const { data: products = [] } = useProducts();

  const dealProducts = products
    .filter(p => p.originalPrice && p.originalPrice > p.price)
    .sort((a, b) => {
      const originalA = a.originalPrice ?? a.price;
      const originalB = b.originalPrice ?? b.price;
      const discA = ((originalA - a.price) / originalA) * 100;
      const discB = ((originalB - b.price) / originalB) * 100;
      return discB - discA;
    })
    .slice(0, 8);

  if (dealProducts.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 border-t border-foreground/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="font-utility text-foreground/40 mb-3">Current offers</p>
          <h2 className="font-display text-3xl sm:text-4xl">Worth a closer look</h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">
            Products with a genuine current compare price, gathered in one place.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
          {dealProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 font-utility text-[10px] tracking-[0.2em] text-foreground border-b border-foreground/20 pb-1 hover:border-foreground transition-colors duration-500"
          >
            VIEW ALL OFFERS
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-500" strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
