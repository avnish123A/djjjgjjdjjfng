import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/products/ProductCard';
import { motion } from 'framer-motion';

const BrandSection = ({ brand, description, products, viewAllLink, gradient }: {
  brand: string;
  description: string;
  products: any[];
  viewAllLink: string;
  gradient: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.6;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 lg:p-8 border border-border/40`}
    >
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
        {/* Left side */}
        <div className="lg:w-52 shrink-0 flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Featured
          </div>
          <h3 className="font-display text-2xl lg:text-3xl tracking-tight mb-2">
            Best of<br /><span className="gradient-text">{brand}</span>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 hidden lg:block">
            {description}
          </p>
          <Link
            to={viewAllLink}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
          >
            View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product carousel */}
        <div className="flex-1 relative">
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <button onClick={() => scroll('left')} className="p-2.5 bg-card/90 backdrop-blur-sm rounded-xl shadow-md border border-border/50 hover:bg-card transition-all hover:shadow-lg">
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <button onClick={() => scroll('right')} className="p-2.5 bg-card/90 backdrop-blur-sm rounded-xl shadow-md border border-border/50 hover:bg-card transition-all hover:shadow-lg">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[210px] sm:w-[230px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const FeaturedProducts = () => {
  const { data: products = [], isLoading } = useProducts();

  if (isLoading) {
    return (
      <section className="py-10 lg:py-14">
        <div className="container mx-auto px-4 space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse bg-secondary rounded-2xl h-72" />
          ))}
        </div>
      </section>
    );
  }

  const appleProducts = products.filter(p => p.brand === 'Apple').slice(0, 10);
  const samsungProducts = products.filter(p => p.brand === 'Samsung').slice(0, 10);
  const otherBrands = products.filter(p => p.brand !== 'Apple' && p.brand !== 'Samsung').slice(0, 10);

  return (
    <section className="py-10 lg:py-14">
      <div className="container mx-auto px-4 space-y-8">
        {appleProducts.length > 0 && (
          <BrandSection
            brand="Apple"
            description="Shop the latest iPhones, MacBooks, iPads and more with exclusive offers."
            products={appleProducts}
            viewAllLink="/products?search=Apple"
            gradient="from-secondary/60 via-blue-50/30 to-secondary/40"
          />
        )}

        {samsungProducts.length > 0 && (
          <BrandSection
            brand="Samsung"
            description="Discover Galaxy smartphones, tablets, and accessories at the best prices."
            products={samsungProducts}
            viewAllLink="/products?search=Samsung"
            gradient="from-secondary/60 via-violet-50/30 to-secondary/40"
          />
        )}

        {otherBrands.length > 0 && (
          <BrandSection
            brand="More Brands"
            description="OnePlus, Sony, Lenovo, Dell, ASUS and more top tech brands."
            products={otherBrands}
            viewAllLink="/products"
            gradient="from-secondary/60 via-cyan-50/30 to-secondary/40"
          />
        )}
      </div>
    </section>
  );
};
