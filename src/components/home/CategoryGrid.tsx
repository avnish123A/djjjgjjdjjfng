import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { ArrowRight } from 'lucide-react';
import catWomen from '@/assets/cat-women-ethnic.jpg';
import catMen from '@/assets/cat-men-ethnic.jpg';
import catAccessories from '@/assets/cat-accessories.jpg';

const fallbackCategories = [
  { id: 'f1', name: 'Women Ethnic Wear', slug: 'women-ethnic-wear', image: catWomen },
  { id: 'f2', name: 'Men Ethnic Wear', slug: 'men-ethnic-wear', image: catMen },
  { id: 'f3', name: 'Accessories', slug: 'accessories', image: catAccessories },
];

export const CategoryGrid = () => {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse aspect-[4/3] bg-secondary rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[11px] font-medium uppercase tracking-[5px] text-primary mb-4 block">
            Our Collections
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Shop by Category
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Explore our curated range of premium Indian ethnic fashion
          </p>
        </div>

        <div className="perspective-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayCategories.map((cat, index) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-2xl animate-fade-in-up category-3d"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent transition-opacity duration-500 group-hover:from-foreground/80" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8" style={{ transform: 'translateZ(30px)' }}>
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
