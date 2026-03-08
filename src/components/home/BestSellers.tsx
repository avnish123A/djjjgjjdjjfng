import { useRef, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { ProductCard } from '@/components/products/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const BestSellers = () => {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredProducts = activeTab === 'all'
    ? products.filter(p => p.badge === 'Best Seller').slice(0, 12)
    : products.filter(p => p.categoryId === activeTab).slice(0, 12);

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products.slice(0, 12);

  if (displayProducts.length === 0) return null;

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const tabs = [
    { id: 'all', name: 'All' },
    ...categories.slice(0, 6).map(c => ({ id: c.id, name: c.name })),
  ];

  return (
    <section className="py-10 lg:py-14 mesh-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-5 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
                <TrendingUp className="h-3.5 w-3.5" />
                Trending Now
              </div>
              <h2 className="font-display text-2xl sm:text-3xl tracking-tight">Bestseller Deals</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => scroll('left')} className="hidden sm:flex p-2.5 rounded-xl border border-border/60 hover:bg-card hover:shadow-sm transition-all" aria-label="Scroll left">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => scroll('right')} className="hidden sm:flex p-2.5 rounded-xl border border-border/60 hover:bg-card hover:shadow-sm transition-all" aria-label="Scroll right">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-glow'
                    : 'bg-card border border-border/60 text-foreground/70 hover:border-primary/30 hover:text-primary'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        >
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex-shrink-0 w-[210px] sm:w-[230px] lg:w-[250px] snap-start"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-6"
        >
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
          >
            View All Products <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
