import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { ProductCard } from '@/components/products/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const BestSellers = () => {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredProducts = activeTab === 'all'
    ? products.filter(p => p.badge === 'Best Seller').slice(0, 12)
    : products.filter(p => p.categoryId === activeTab).slice(0, 12);

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products.slice(0, 12);

  if (displayProducts.length === 0) return null;

  const tabs = [
    { id: 'all', name: 'All' },
    ...categories.slice(0, 6).map(c => ({ id: c.id, name: c.name })),
  ];

  return (
    <section className="py-16 lg:py-24 border-t border-foreground/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <p className="font-utility text-[10px] tracking-[0.3em] text-foreground/40 mb-3">MOST LOVED</p>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tighter">Bestsellers</h2>
        </motion.div>

        {/* Category tabs — editorial style */}
        <div className="flex justify-center gap-6 mb-12 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-utility text-[10px] tracking-[0.15em] whitespace-nowrap pb-2 border-b transition-all duration-500 ${
                activeTab === tab.id
                  ? 'text-foreground border-foreground'
                  : 'text-foreground/30 border-transparent hover:text-foreground/60'
              }`}
            >
              {tab.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
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
            VIEW ALL PRODUCTS
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-500" strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
