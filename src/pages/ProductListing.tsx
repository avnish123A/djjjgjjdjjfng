import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'rating';

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sort, setSort] = useState<SortOption>('relevance');

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
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (a.badge === 'New' ? -1 : 1));
        break;
    }

    return result;
  }, [selectedCategory, priceRange, sort]);

  const categoryLabel = selectedCategory
    ? selectedCategory.replace('-', ' & ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'All Products';

  return (
    <main className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{categoryLabel}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="flex gap-8">
          <ProductFilters
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
          />

          <div className="flex-1">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold mb-1">{categoryLabel}</h1>
                <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} products
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  <option value="relevance">Sort by: Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Product grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">No products found</p>
                <button
                  onClick={() => {
                    handleCategoryChange(null);
                    setPriceRange([0, 500]);
                  }}
                  className="text-accent font-medium hover:underline"
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