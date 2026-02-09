import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Grid3X3, X } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'rating';

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sort, setSort] = useState<SortOption>('relevance');

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const handleCategoryChange = (cat: string | null) => {
    setSelectedCategory(cat);
    if (cat) {
      setSearchParams({ category: cat });
    } else {
      setSearchParams({});
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (selectedCategory) {
        const matchingCat = categories.find(c => c.slug === selectedCategory);
        if (matchingCat && p.categoryId !== matchingCat.id) return false;
      }
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });

    switch (sort) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result = [...result].sort((a, b) => (a.badge === 'New' ? -1 : 1));
        break;
    }

    return result;
  }, [products, categories, selectedCategory, priceRange, sort]);

  const categoryLabel = selectedCategory
    ? categories.find(c => c.slug === selectedCategory)?.name || selectedCategory.replace('-', ' & ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'All Products';

  const hasActiveFilters = selectedCategory || priceRange[0] > 0 || priceRange[1] < 50000;

  return (
    <main className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{categoryLabel}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-10">
        <div className="flex gap-8">
          <ProductFilters
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            categories={categories}
          />

          <div className="flex-1">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight mb-0.5">{categoryLabel}</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 appearance-none cursor-pointer pr-8"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2386868B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                }}
              >
                <option value="relevance">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span className="text-xs font-medium text-muted-foreground mr-1">Active filters:</span>
                {selectedCategory && (
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-sm rounded-full hover:bg-muted transition-colors"
                  >
                    {categoryLabel}
                    <X className="h-3 w-3" />
                  </button>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 50000) && (
                  <button
                    onClick={() => setPriceRange([0, 50000])}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-sm rounded-full hover:bg-muted transition-colors"
                  >
                    ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}
                    <X className="h-3 w-3" />
                  </button>
                )}
                <button
                  onClick={() => { handleCategoryChange(null); setPriceRange([0, 50000]); }}
                  className="text-xs text-accent font-medium hover:underline ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Product Grid */}
            {productsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[3/4] rounded-2xl shimmer mb-3" />
                    <div className="h-3 shimmer rounded w-1/3 mb-2" />
                    <div className="h-4 shimmer rounded w-2/3 mb-2" />
                    <div className="h-4 shimmer rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Grid3X3 className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium mb-2">No products found</p>
                <p className="text-sm text-muted-foreground mb-6">Try adjusting your filters</p>
                <button
                  onClick={() => {
                    handleCategoryChange(null);
                    setPriceRange([0, 50000]);
                  }}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductListing;
