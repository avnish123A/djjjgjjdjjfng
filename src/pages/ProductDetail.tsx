import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Heart, Minus, Plus, ShoppingBag, Truck, RotateCcw, ShieldCheck, Check, MapPin } from 'lucide-react';
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
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-foreground border-t-transparent rounded-full" />
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

  const handleCheckPincode = () => {
    if (pincode.length === 6) {
      setPincodeChecked(true);
      toast.success('Delivery available to this pincode');
    } else {
      toast.error('Please enter a valid 6-digit pincode');
    }
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
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary">
              <img
                src={displayImages[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {displayImages.length > 1 && (
              <div className="flex gap-2.5 mt-4">
                {displayImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      i === selectedImage ? 'border-foreground' : 'border-transparent hover:border-border'
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.15em] font-medium mb-1.5">{product.brand}</p>
              <h1 className="text-xl lg:text-[28px] font-bold mb-3 leading-tight tracking-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? 'fill-warning text-warning' : 'text-border'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl lg:text-3xl font-bold">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-base text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                    <span className="px-2.5 py-0.5 bg-success/10 text-success text-sm font-semibold rounded-full">
                      {discount}% off
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">Inclusive of all taxes</p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-success' : 'bg-destructive'}`} />
              <span className={`text-sm font-medium ${product.inStock ? 'text-success' : 'text-destructive'}`}>
                {product.inStock ? (product.stock <= 5 ? `Only ${product.stock} left!` : 'In Stock') : 'Out of Stock'}
              </span>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-3">Size: {selectedSize || 'Select'}</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] px-4 py-2.5 border rounded-lg text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-foreground bg-foreground text-background'
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
                <div className="flex gap-2.5">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(color)}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        selectedColor === color ? 'border-foreground ring-2 ring-foreground/20' : 'border-border hover:border-foreground'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Color ${i + 1}`}
                    >
                      {selectedColor === color && (
                        <Check className="h-4 w-4 mx-auto text-background drop-shadow" />
                      )}
                    </button>
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
                  className="p-3 hover:bg-secondary transition-colors rounded-l-lg"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-5 py-3 text-sm font-semibold tabular-nums min-w-[3rem] text-center border-x border-border">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="p-3 hover:bg-secondary transition-colors rounded-r-lg"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                size="lg"
                className="flex-1 gap-2 h-13 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="h-13 px-4 rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Pincode Checker */}
            <div className="p-5 bg-secondary rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold">Check Delivery</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value.replace(/\D/g, '').slice(0, 6)); setPincodeChecked(false); }}
                  placeholder="Enter pincode"
                  maxLength={6}
                  className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10"
                />
                <Button variant="outline" size="sm" onClick={handleCheckPincode} className="px-4">
                  Check
                </Button>
              </div>
              {pincodeChecked && (
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5 text-success font-medium">
                    <Check className="h-3.5 w-3.5" /> Delivery available
                  </p>
                  <p>• Standard: 5-7 days (₹99 or Free above ₹999)</p>
                  <p>• Express: 2-3 days (₹199)</p>
                  <p>• Cash on Delivery available</p>
                </div>
              )}
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, label: 'Free Delivery' },
                { icon: RotateCcw, label: '7-Day Returns' },
                { icon: ShieldCheck, label: '100% Genuine' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-secondary rounded-xl">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-20">
          <div className="flex gap-8 border-b border-border">
            {['description', 'specifications', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium capitalize transition-colors relative ${
                  activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'shipping' ? 'Shipping & Returns' : tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="pdpActiveTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground"
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
              <div className="max-w-md">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ['Brand', product.brand],
                      ['Category', product.categoryName],
                      ['Rating', `${product.rating} / 5`],
                      ['Availability', product.inStock ? 'In Stock' : 'Out of Stock'],
                    ].map(([label, value], i) => (
                      <tr key={label} className={i % 2 === 0 ? 'bg-secondary' : ''}>
                        <td className="py-3 px-4 text-muted-foreground font-medium">{label}</td>
                        <td className="py-3 px-4 font-medium">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{product.rating}</div>
                    <div className="flex items-center gap-0.5 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-warning text-warning' : 'text-border'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{product.reviewCount} reviews</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Write a Review</Button>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="max-w-2xl space-y-5 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Shipping</h4>
                  <ul className="space-y-1.5">
                    <li>• Standard Delivery: 5-7 business days (₹99 or Free above ₹999)</li>
                    <li>• Express Delivery: 2-3 business days (₹199)</li>
                    <li>• Cash on Delivery available on select pin codes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Returns & Exchanges</h4>
                  <ul className="space-y-1.5">
                    <li>• 7-day easy return policy</li>
                    <li>• Free pickup from your doorstep</li>
                    <li>• Refund processed within 5-7 business days</li>
                  </ul>
                </div>
                <Link to="/policies/shipping" className="inline-block text-accent text-sm font-medium hover:underline mt-2">
                  View full shipping policy →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-16 border-t border-border">
            <h2 className="text-xl font-bold mb-10 tracking-tight">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-3 z-40">
        <div className="flex gap-3">
          <Button variant="outline" className="h-12 px-4 rounded-full">
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            className="flex-1 h-12 gap-2 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-full"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingBag className="h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
