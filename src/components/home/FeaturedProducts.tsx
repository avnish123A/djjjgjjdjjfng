import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/products/ProductCard';

export const FeaturedProducts = () => {
  const { data: products = [], isLoading } = useProducts();
  const featured = products.slice(0, 8);

  if (isLoading) {
    return (
      <section className="py-24 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-secondary rounded w-48 mb-14" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-secondary rounded-2xl mb-3" />
                <div className="h-3 bg-secondary rounded w-1/3 mb-2" />
                <div className="h-4 bg-secondary rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featured.length === 0) return null;

  return (
    <section className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[5px] text-primary mb-3 block">Just Dropped</span>
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight">New Arrivals</h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary hover:gap-2.5 transition-all uppercase tracking-wider"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.map((product) => (
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
