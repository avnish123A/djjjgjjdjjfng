import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { ArrowRight } from 'lucide-react';

export const CategoryGrid = () => {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse aspect-[4/3] bg-secondary rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[11px] font-medium uppercase tracking-[5px] text-primary mb-4 block">
            Curated Collections
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Shop by Category
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Find the perfect gift across our carefully curated categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-2xl animate-fade-in-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent transition-opacity duration-500 group-hover:from-foreground/80" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <h3 className="text-lg lg:text-xl font-display text-white mb-1">
                  {cat.name}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/60 font-medium uppercase tracking-wider group-hover:text-white/80 transition-colors">
                  Explore <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
