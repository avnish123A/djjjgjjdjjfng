import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/products/ProductCard';

// Brand showcase section — like "Best of Apple" on Vijay Sales
const BrandSection = ({ brand, description, products, viewAllLink }: {
  brand: string;
  description: string;
  products: any[];
  viewAllLink: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.6;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <div className="bg-secondary/40 rounded-2xl p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Left side text */}
        <div className="lg:w-48 shrink-0 flex flex-col justify-center">
          <h3 className="font-display text-xl lg:text-2xl tracking-tight mb-2">
            Best of<br />{brand}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4 hidden lg:block">
            {description}
          </p>
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Product carousel */}
        <div className="flex-1 relative">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <button onClick={() => scroll('left')} className="p-2 bg-card rounded-full shadow-md border border-border hover:bg-secondary transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <button onClick={() => scroll('right')} className="p-2 bg-card rounded-full shadow-md border border-border hover:bg-secondary transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[200px] sm:w-[220px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FeaturedProducts = () => {
  const { data: products = [], isLoading } = useProducts();

  if (isLoading) {
    return (
      <section className="py-8 lg:py-10">
        <div className="container mx-auto px-4 space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse bg-secondary rounded-2xl h-64" />
          ))}
        </div>
      </section>
    );
  }

  // Group by brand for brand showcase sections
  const appleProducts = products.filter(p => p.brand === 'Apple').slice(0, 10);
  const samsungProducts = products.filter(p => p.brand === 'Samsung').slice(0, 10);
  const otherBrands = products.filter(p => p.brand !== 'Apple' && p.brand !== 'Samsung').slice(0, 10);

  return (
    <section className="py-8 lg:py-10">
      <div className="container mx-auto px-4 space-y-6">
        {appleProducts.length > 0 && (
          <BrandSection
            brand="Apple"
            description="Shop the latest iPhones, MacBooks, iPads and more with exclusive offers."
            products={appleProducts}
            viewAllLink="/products?search=Apple"
          />
        )}

        {samsungProducts.length > 0 && (
          <BrandSection
            brand="Samsung"
            description="Discover Galaxy smartphones, tablets, and accessories at the best prices."
            products={samsungProducts}
            viewAllLink="/products?search=Samsung"
          />
        )}

        {otherBrands.length > 0 && (
          <BrandSection
            brand="More Brands"
            description="OnePlus, Sony, Lenovo, Dell, ASUS and more top tech brands."
            products={otherBrands}
            viewAllLink="/products"
          />
        )}
      </div>
    </section>
  );
};
