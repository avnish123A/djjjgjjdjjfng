import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { ArrowRight } from 'lucide-react';

const fallbackCategories = [
  { id: 'f1', name: 'Smartphones', slug: 'smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80' },
  { id: 'f2', name: 'Laptops', slug: 'laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80' },
  { id: 'f3', name: 'Tablets', slug: 'tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80' },
  { id: 'f4', name: 'Smart Gadgets', slug: 'smart-gadgets', image: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=800&q=80' },
  { id: 'f5', name: 'Mobile Accessories', slug: 'mobile-accessories', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80' },
  { id: 'f6', name: 'Laptop Accessories', slug: 'laptop-accessories', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80' },
];

export const CategoryGrid = () => {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse aspect-square bg-secondary rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-[11px] font-medium uppercase tracking-[5px] text-accent mb-4 block">
            Browse
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Shop by Category
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Find the perfect tech from our curated categories
          </p>
        </div>

        <div className="perspective-container grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((cat, index) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group relative block aspect-square overflow-hidden rounded-2xl animate-fade-in-up category-3d"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent transition-opacity duration-500 group-hover:from-foreground/80" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4" style={{ transform: 'translateZ(30px)' }}>
                <h3 className="text-sm lg:text-base font-display text-white mb-0.5">
                  {cat.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] text-white/60 font-medium uppercase tracking-wider group-hover:text-white/80 transition-colors">
                  Shop <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
