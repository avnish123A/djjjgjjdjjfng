import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Heart, Minus, Plus, ShoppingBag, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ProductCard } from '@/components/products/ProductCard';
import { formatPrice } from '@/lib/format';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || '');
  const { data: allProducts = [] } = useProducts();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products" className="text-accent hover:underline">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
    });
    toast.success(`${product.name} added to cart`);
  };

  const relatedProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const displayImages = product.images.length > 0 ? product.images : [product.image];

  return (
    <main className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary">
              <img
                src={displayImages[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-3 mt-4">
                {displayImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-accent' : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">{product.brand}</p>
              <h1 className="text-2xl lg:text-3xl font-bold mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-border'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                    <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-sm font-medium rounded">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-success' : 'bg-destructive'}`} />
              <span className={`text-sm font-medium ${product.inStock ? 'text-success' : 'text-destructive'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-3">Size</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-3">Color</p>
                <div className="flex gap-2">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-border hover:border-foreground transition-colors"
                      style={{ backgroundColor: color }}
                      aria-label={`Color ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold mb-3">Quantity</p>
              <div className="inline-flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-secondary transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-5 py-3 text-sm font-medium tabular-nums min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-secondary transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="accent" size="lg" className="flex-1 gap-2" onClick={handleAddToCart} disabled={!product.inStock}>
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="h-4 w-4 shrink-0" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <RotateCcw className="h-4 w-4 shrink-0" />
                <span>7-Day Returns</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Secure Payment</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-8 border-b border-border">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium capitalize transition-colors relative ${
                  activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                  />
                )}
              </button>
            ))}
          </div>
          <div className="py-8">
            {activeTab === 'description' && (
              <div className="max-w-2xl">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="max-w-md space-y-3">
                <div className="flex justify-between py-2 border-b border-border text-sm">
                  <span className="text-muted-foreground">Brand</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium capitalize">{product.categoryName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border text-sm">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium">{product.rating} / 5</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border text-sm">
                  <span className="text-muted-foreground">Availability</span>
                  <span className={`font-medium ${product.inStock ? 'text-success' : 'text-destructive'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="max-w-2xl">
                <p className="text-muted-foreground">
                  {product.reviewCount} reviews · Average rating {product.rating}/5
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
