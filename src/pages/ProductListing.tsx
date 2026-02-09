import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Grid3X3 } from 'lucide-react';
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
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight mb-0.5">{categoryLabel}</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10"
              >
                <option value="relevance">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Product Grid */}
            {productsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] rounded-xl bg-secondary mb-3" />
                    <div className="h-3 bg-secondary rounded w-1/3 mb-2" />
                    <div className="h-4 bg-secondary rounded w-2/3 mb-2" />
                    <div className="h-4 bg-secondary rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
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
