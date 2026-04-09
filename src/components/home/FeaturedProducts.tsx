import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/products/ProductCard';
import { motion } from 'framer-motion';

export const FeaturedProducts = () => {
  const { data: products = [], isLoading } = useProducts();

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] shimmer" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Curated selection — best sellers and new arrivals
  const featured = products.filter(p => p.badge === 'Best Seller' || p.badge === 'New').slice(0, 8);
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 8);

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Asymmetric editorial layout: sticky text left, products right */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Sticky narrative column */}
          <div className="lg:col-span-3 mb-10 lg:mb-0">
            <div className="lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <p className="font-utility text-[10px] tracking-[0.3em] text-foreground/40 mb-4">CURATED</p>
                <h2 className="font-display text-3xl sm:text-4xl tracking-tighter mb-5 leading-[1.05]">
                  Editor's<br />Selection
                </h2>
                <p className="font-display-italic text-sm text-muted-foreground leading-relaxed mb-8">
                  Hand-selected for provenance, complexity, and craft. Each product represents the pinnacle of its category.
                </p>
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-3 font-utility text-[10px] tracking-[0.2em] text-foreground border-b border-foreground/20 pb-1 hover:border-foreground transition-colors duration-500"
                >
                  VIEW ALL
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-500" strokeWidth={1.5} />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Product grid */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {displayProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
