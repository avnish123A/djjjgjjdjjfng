import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/products/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const BestSellers = () => {
  const { data: products = [] } = useProducts();
  const bestSellers = products.filter(p => p.badge === 'Best Seller').slice(0, 8);
  const displayProducts = bestSellers.length > 0 ? bestSellers : products.slice(0, 8);

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">Best Sellers</h2>
            <p className="text-muted-foreground text-sm">Our most loved products across all categories</p>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-accent hover:gap-2.5 transition-all"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="sm:hidden text-center mt-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent"
          >
            View All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
