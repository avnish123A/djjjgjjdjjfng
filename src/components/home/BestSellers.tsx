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
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[4px] text-primary mb-3 block">Most Loved</span>
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight">Best Sellers</h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary hover:gap-2.5 transition-all uppercase tracking-wider"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="sm:hidden text-center mt-10">
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
