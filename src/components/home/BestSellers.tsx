import { useRef } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/products/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const BestSellers = () => {
  const { data: products = [] } = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);

  const bestSellers = products.filter(p => p.badge === 'Best Seller').slice(0, 12);
  const displayProducts = bestSellers.length > 0 ? bestSellers : products.slice(0, 12);

  if (displayProducts.length === 0) return null;

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[5px] text-primary mb-3 block">Most Loved</span>
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight">Best Sellers</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2.5 rounded-xl border border-border hover:border-primary hover:text-primary transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2.5 rounded-xl border border-border hover:border-primary hover:text-primary transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <Link
              to="/products"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary hover:gap-2.5 transition-all uppercase tracking-wider"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
        >
          {displayProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[260px] sm:w-[280px] lg:w-[300px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="sm:hidden text-center mt-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground uppercase tracking-wider"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
