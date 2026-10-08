import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Minus, Plus, ShoppingBag, Truck, RotateCcw, ShieldCheck, Check, MapPin, Zap, ChevronDown } from 'lucide-react';
import { DELIVERY_ESTIMATE_TEXT, DELIVERY_AVAILABILITY_NOTE } from '@/lib/delivery';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useProductAttributes } from '@/hooks/useProductAttributes';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ProductCard } from '@/components/products/ProductCard';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import DynamicProductOptions from '@/components/products/DynamicProductOptions';

/* ── Accordion Item ─────────────────────────────────────── */
const AccordionItem = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-sm font-semibold text-left hover:text-primary transition-colors"
      >
        {title}
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform duration-300', open && 'rotate-180')} />
      </button>
      <div className={cn('overflow-hidden transition-all duration-300', open ? 'max-h-[500px] pb-5' : 'max-h-0')}>
        {children}
      </div>
    </div>
  );
};

/* ── Main Component ─────────────────────────────────────── */
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || '');
  const { data: allProducts = [] } = useProducts();
  const { data: dynamicAttributes = [] } = useProductAttributes(id || '');
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [variantSelections, setVariantSelections] = useState<Record<string, string>>({});
  const [priceModifier, setPriceModifier] = useState(0);
  const hasDynamicAttrs = dynamicAttributes.length > 0;
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    if (!ctaRef.current) return;
    const obs = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting), { threshold: 0 });
    obs.observe(ctaRef.current);
    return () => obs.disconnect();
  }, [product]);

  // Reset state on product change
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setSelectedSize(null);
    setSelectedColor(null);
    setVariantSelections({});
    setPriceModifier(0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products" className="text-primary hover:underline">Browse Products</Link>
        </div>
      </div>
    );
  }

  // Check required attributes are selected
  const requiredMissing = hasDynamicAttrs && dynamicAttributes
    .filter(a => a.is_required && a.attribute_type !== 'text')
    .some(a => !variantSelections[a.attribute_name]);

  const finalPrice = product.price + priceModifier;
  const variantKey = hasDynamicAttrs
    ? `${product.id}-${Object.entries(variantSelections).sort().map(([k,v]) => `${k}:${v}`).join('|')}`
    : product.id;

  const hasReviews = (product.reviewCount || 0) > 0 && (product.rating || 0) > 0;
  const maxQty = product.trackInventory !== false ? Math.max(1, Math.min(10, product.stock || 0)) : 10;

  const validateSelection = () => {
    if (!product.inStock) { toast.error('This product is out of stock'); return false; }
    if (requiredMissing) { toast.error('Please select all required options'); return false; }
    if (hasDynamicAttrs) {
      for (const a of dynamicAttributes) {
        const v = a.values.find(x => x.value === variantSelections[a.attribute_name]);
        if (v && v.stock_quantity < quantity) {
          toast.error(v.stock_quantity > 0 ? `Only ${v.stock_quantity} left for ${a.attribute_label}: ${v.value}` : `${a.attribute_label}: ${v.value} is sold out`);
          return false;
        }
      }
    }
    if (product.trackInventory !== false && quantity > (product.stock || 0)) {
      toast.error(`Only ${product.stock} in stock`); return false;
    }
    return true;
  };

  const cartPayload = () => ({
    id: product.id,
    name: product.name,
    price: finalPrice,
    image: product.image,
    brand: product.brand,
    variantSelections: hasDynamicAttrs ? variantSelections : undefined,
    variantKey,
  });

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    setAddingToCart(true);
    addItem(cartPayload(), quantity);
    toast.success(`${quantity > 1 ? `${quantity} × ` : ''}${product.name} added to cart`);
    setTimeout(() => setAddingToCart(false), 1200);
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;
    addItem(cartPayload(), quantity);
    navigate('/checkout');
  };

  const relatedProducts = allProducts.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;
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

      <div className="container mx-auto px-4 py-8 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* ── IMAGE GALLERY ─────────────────────── */}
          <div className="animate-fade-in-up">
            {/* Main image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary cursor-zoom-in group relative">
              <img
                key={selectedImage}
                src={displayImages[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 animate-fade-in"
              />
              {/* Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground rounded-full">
                  {product.badge === 'Sale' && discount ? `-${discount}%` : product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide pb-1">
                {displayImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 transition-all',
                      i === selectedImage ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border'
                    )}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── PRODUCT INFO ──────────────────────── */}
          <div className="animate-fade-in-up space-y-6" style={{ animationDelay: '0.1s' }}>
            {/* Brand & title */}
            <div>
              {product.brand && (
                <p className="text-xs text-primary uppercase tracking-[4px] font-medium mb-2">{product.brand}</p>
              )}
              <h1 className="font-display text-2xl lg:text-[32px] mb-4 leading-tight tracking-tight">{product.name}</h1>

              {hasReviews && (
              <div className="flex items-center gap-2.5 mb-5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-border'}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span>
              </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl lg:text-3xl font-bold">{formatPrice(finalPrice)}</span>
                {(product.originalPrice || priceModifier !== 0) && (
                  <>
                    {product.originalPrice && <span className="text-base text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>}
                    {!product.originalPrice && priceModifier !== 0 && <span className="text-base text-muted-foreground line-through">{formatPrice(product.price)}</span>}
                    {discount && <span className="px-2.5 py-0.5 bg-success/10 text-success text-sm font-semibold rounded-full">{discount}% off</span>}
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">Inclusive of all taxes</p>
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-success' : 'bg-destructive'}`} />
              <span className={`text-sm font-medium ${product.inStock ? 'text-success' : 'text-destructive'}`}>
                {product.inStock ? (product.stock <= 5 ? `Only ${product.stock} left!` : 'In Stock') : 'Out of Stock'}
              </span>
            </div>

            {/* Dynamic Attributes */}
            {hasDynamicAttrs ? (
              <DynamicProductOptions
                attributes={dynamicAttributes}
                basePrice={product.price}
                onSelectionChange={(sels, mod) => {
                  setVariantSelections(sels);
                  setPriceModifier(mod);
                }}
              />
            ) : (
              <>
                {/* Legacy Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-3">Size: {selectedSize || 'Select'}</p>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={cn(
                            'min-w-[56px] px-4 py-2.5 border rounded-xl text-sm font-medium transition-all',
                            selectedSize === size ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground'
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legacy Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-3">Color</p>
                    <div className="flex gap-2.5">
                      {product.colors.map((color, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            'w-9 h-9 rounded-full border-2 transition-all',
                            selectedColor === color ? 'border-foreground ring-2 ring-foreground/20' : 'border-border hover:border-foreground'
                          )}
                          style={{ backgroundColor: color }}
                          aria-label={`Color ${i + 1}`}
                        >
                          {selectedColor === color && <Check className="h-4 w-4 mx-auto text-background drop-shadow" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold mb-3">Quantity</p>
              <div className="inline-flex items-center border border-border rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} className="p-3 hover:bg-secondary transition-colors rounded-l-xl disabled:opacity-40" aria-label="Decrease quantity">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-5 py-3 text-sm font-semibold tabular-nums min-w-[3rem] text-center border-x border-border">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(maxQty, quantity + 1))} disabled={quantity >= maxQty} className="p-3 hover:bg-secondary transition-colors rounded-r-xl disabled:opacity-40" aria-label="Increase quantity">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ── CTA Buttons (observed for sticky) ── */}
            <div ref={ctaRef} className="space-y-3 pt-1">
              <Button
                size="lg"
                className="w-full gap-2 h-14 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                onClick={handleAddToCart}
                disabled={!product.inStock || addingToCart}
              >
                {addingToCart ? (<><Check className="h-5 w-5" /> Added!</>) : (<><ShoppingBag className="h-5 w-5" /> Add to Cart</>)}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 h-13 text-base font-semibold rounded-xl border-2 border-foreground hover:bg-foreground hover:text-background transition-all"
                disabled={!product.inStock}
                onClick={handleBuyNow}
              >
                <Zap className="h-5 w-5" />
                Buy Now
              </Button>
            </div>

            {/* ── Trust Badges (near CTA) ── */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: 'Free Delivery', sub: 'Above ₹999' },
                { icon: RotateCcw, label: '7-Day Returns', sub: 'See policy' },
                { icon: ShieldCheck, label: 'Secure Checkout', sub: 'UPI, cards & COD' },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 bg-secondary/60 rounded-xl">
                  <item.icon className="h-5 w-5 mx-auto mb-1.5 text-primary" />
                  <p className="text-xs font-semibold">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Delivery info (no fake serviceability check) */}
            <div className="p-5 bg-secondary/40 rounded-2xl text-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p className="font-semibold">{DELIVERY_ESTIMATE_TEXT}</p>
              </div>
              <p className="text-xs text-muted-foreground">{DELIVERY_AVAILABILITY_NOTE}</p>
            </div>
          </div>
        </div>

        {/* ── Accordion Info Sections ─────────────── */}
        <div className="mt-16 lg:mt-24 max-w-3xl">
          <AccordionItem title="Description" defaultOpen>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </AccordionItem>

          <AccordionItem title="Specifications">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['Brand', product.brand],
                  ['Category', product.categoryName],
                  ...(hasReviews ? [['Rating', `${product.rating} / 5`]] : []),
                  ['Availability', product.inStock ? 'In Stock' : 'Out of Stock'],
                ].map(([label, value], i) => (
                  <tr key={label} className={i % 2 === 0 ? 'bg-secondary/50' : ''}>
                    <td className="py-3 px-4 text-muted-foreground font-medium">{label}</td>
                    <td className="py-3 px-4 font-medium">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AccordionItem>

          {hasReviews && (
          <AccordionItem title={`Reviews (${product.reviewCount})`}>
            <div className="flex items-center gap-4 mb-5">
              <div className="text-center">
                <div className="text-3xl font-bold">{product.rating}</div>
                <div className="flex items-center gap-0.5 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-border'}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{product.reviewCount} reviews</p>
              </div>
            </div>
          </AccordionItem>
          )}

          <AccordionItem title="Shipping & Returns">
            <div className="space-y-5 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Shipping</h4>
                <ul className="space-y-1.5">
                  <li>• {DELIVERY_ESTIMATE_TEXT}</li>
                  <li>• Free delivery on orders above ₹999</li>
                  <li>• {DELIVERY_AVAILABILITY_NOTE}</li>
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
              <Link to="/policies/shipping" className="inline-block text-primary text-sm font-medium hover:underline">
                View full shipping policy →
              </Link>
            </div>
          </AccordionItem>
        </div>

        {/* ── Related Products ────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-16 border-t border-border">
            <div className="mb-12">
              <span className="text-[11px] font-medium uppercase tracking-[5px] text-primary mb-3 block">More to Explore</span>
              <h2 className="font-display text-2xl sm:text-3xl tracking-tight">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Desktop Sticky Add to Cart ──────────── */}
      <div className={cn(
        'hidden lg:block fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-40 transition-all duration-300',
        showSticky ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      )}>
        <div className="container mx-auto px-4 py-3 flex items-center gap-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{product.name}</p>
              <div className="flex items-center gap-2">
                <span className="font-bold">{formatPrice(finalPrice)}</span>
                {product.originalPrice && <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              className="h-11 px-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold"
              onClick={handleAddToCart}
              disabled={!product.inStock || addingToCart}
            >
              {addingToCart ? (<><Check className="h-4 w-4" /> Added!</>) : (<><ShoppingBag className="h-4 w-4" /> Add to Cart</>)}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Mobile Sticky Bottom Bar ────────────── */}
      <div className="lg:hidden fixed bottom-[60px] left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-3 z-40" style={{ height: '64px' }}>
        <div className="flex items-center gap-3 h-full">
          <div className="shrink-0">
            <span className="text-lg font-bold">{formatPrice(finalPrice)}</span>
          </div>
          <Button
            className="flex-1 h-10 gap-2 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            onClick={handleAddToCart}
            disabled={!product.inStock || addingToCart}
          >
            {addingToCart ? (<><Check className="h-4 w-4" /> Added!</>) : (<><ShoppingBag className="h-4 w-4" /> Add to Cart</>)}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
