import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { Smartphone, Laptop, Tablet, Headphones, Mouse, Watch } from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  smartphones: Smartphone,
  laptops: Laptop,
  tablets: Tablet,
  'mobile-accessories': Headphones,
  'laptop-accessories': Mouse,
  'smart-gadgets': Watch,
};

const fallbackCategories = [
  { id: 'f1', name: 'Smartphones', slug: 'smartphones', image: '' },
  { id: 'f2', name: 'Laptops', slug: 'laptops', image: '' },
  { id: 'f3', name: 'Tablets', slug: 'tablets', image: '' },
  { id: 'f4', name: 'Accessories', slug: 'mobile-accessories', image: '' },
  { id: 'f5', name: 'Gadgets', slug: 'smart-gadgets', image: '' },
  { id: 'f6', name: 'Laptop Acc.', slug: 'laptop-accessories', image: '' },
];

export const CategoryGrid = () => {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-6 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide justify-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
                <div className="w-16 h-16 bg-secondary rounded-full" />
                <div className="h-3 w-16 bg-secondary rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <section className="py-6 lg:py-8 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex gap-6 sm:gap-8 lg:gap-12 overflow-x-auto scrollbar-hide justify-start lg:justify-center pb-2">
          {displayCategories.map((cat) => {
            const IconComp = categoryIcons[cat.slug] || Smartphone;
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 min-w-[72px] group"
              >
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-secondary border-2 border-transparent group-hover:border-primary flex items-center justify-center transition-all duration-300 group-hover:shadow-md">
                  {cat.image && cat.image !== '/placeholder.svg' ? (
                    <img src={cat.image} alt={cat.name} className="w-10 h-10 lg:w-12 lg:h-12 object-contain rounded-full" />
                  ) : (
                    <IconComp className="w-7 h-7 lg:w-8 lg:h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                <span className="text-[11px] lg:text-xs font-medium text-foreground/80 group-hover:text-primary text-center transition-colors whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
