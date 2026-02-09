import { X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { formatPrice } from '@/lib/format';
import type { Category } from '@/types/product';

interface ProductFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  categories: Category[];
}

const FilterContent = ({ selectedCategory, onCategoryChange, priceRange, onPriceChange, categories }: ProductFiltersProps) => (
  <div className="space-y-6">
    {/* Categories */}
    <div>
      <h3 className="font-semibold text-sm mb-3 uppercase tracking-wider">Category</h3>
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="category"
            checked={!selectedCategory}
            onChange={() => onCategoryChange(null)}
            className="accent-accent"
          />
          <span className="text-sm">All Categories</span>
        </label>
        {categories.map((cat) => (
          <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === cat.slug}
              onChange={() => onCategoryChange(cat.slug)}
              className="accent-accent"
            />
            <span className="text-sm">{cat.name}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Price Range */}
    <div>
      <h3 className="font-semibold text-sm mb-3 uppercase tracking-wider">Price Range</h3>
      <div className="space-y-3">
        <input
          type="range"
          min={0}
          max={50000}
          step={500}
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
          className="w-full accent-accent"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>
    </div>

    {/* Clear */}
    <Button
      variant="outline"
      size="sm"
      className="w-full"
      onClick={() => {
        onCategoryChange(null);
        onPriceChange([0, 50000]);
      }}
    >
      <X className="h-3 w-3 mr-1" /> Clear All
    </Button>
  </div>
);

export const ProductFilters = (props: ProductFiltersProps) => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 shrink-0">
        <div className="sticky top-28">
          <FilterContent {...props} />
        </div>
      </aside>

      {/* Mobile filter sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 pt-12">
            <FilterContent {...props} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
