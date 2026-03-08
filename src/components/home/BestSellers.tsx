import { useRef, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { ProductCard } from '@/components/products/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

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
    <section className="py-8 lg:py-10 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header with tabs */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl sm:text-2xl tracking-tight">Bestseller Deals</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => scroll('left')} className="hidden sm:flex p-2 rounded-full border border-border hover:bg-secondary transition-colors" aria-label="Scroll left">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => scroll('right')} className="hidden sm:flex p-2 rounded-full border border-border hover:bg-secondary transition-colors" aria-label="Scroll right">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground/70 hover:bg-secondary'
                }`}
              >
                {String(i).padStart(2, '0')}. {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product carousel */}
        <div
          ref={scrollRef}
          className="flex gap-3 lg:gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        >
          {displayProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[200px] sm:w-[220px] lg:w-[240px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
          >
            View All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
