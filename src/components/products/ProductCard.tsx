import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Truck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(({ product }, ref) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) {
      toast.error('This product is out of stock');
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
    });
    toast.success(`${product.name} added to cart`);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div ref={ref} className="group relative bg-card border border-border/60 rounded-2xl overflow-hidden product-3d">
      <Link to={`/product/${product.id}`} className="block">
        {/* Image */}
        <div className="relative bg-gradient-to-b from-secondary/50 to-secondary/20 p-5">
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.badge === 'Sale' && (
              <span className="px-2.5 py-1 text-[10px] font-bold bg-destructive text-destructive-foreground rounded-lg shadow-sm">
                Sale
              </span>
            )}
            {product.badge === 'New' && (
              <span className="px-2.5 py-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-lg shadow-sm">
                New
              </span>
            )}
            {product.badge === 'Best Seller' && (
              <span className="px-2.5 py-1 text-[10px] font-bold bg-foreground text-background rounded-lg shadow-sm">
                Best Seller
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast('Added to wishlist');
            }}
            className="absolute top-3 right-3 p-2.5 bg-card/90 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md hover:text-destructive transition-all z-10 min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>

          {/* Product image */}
          <div className="aspect-square flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2.5">
          {product.brand && (
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{product.brand}</p>
          )}

          <h3 className="text-sm font-medium leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {product.rating > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 bg-success text-success-foreground px-2 py-0.5 rounded-md text-[10px] font-bold">
                {product.rating}
                <Star className="h-2.5 w-2.5 fill-current" />
              </div>
              <span className="text-[11px] text-muted-foreground">({product.reviewCount?.toLocaleString()})</span>
            </div>
          )}

          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">{formatPrice(product.price)}</span>
              {discount && (
                <span className="text-xs font-bold text-success">{discount}% off</span>
              )}
            </div>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground">
                MRP <span className="line-through">{formatPrice(product.originalPrice)}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-accent font-medium">
            <Truck className="h-3 w-3 shrink-0" />
            <span>Free Delivery</span>
          </div>
        </div>

        {/* Cart button */}
        <div className="px-4 pb-4">
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-semibold uppercase tracking-wide hover:shadow-glow transition-all duration-300 active:scale-[0.98]"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Cart
          </button>
        </div>

        {/* Out of Stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <span className="px-5 py-2.5 bg-foreground text-background text-sm font-semibold rounded-xl">
              Out of Stock
            </span>
          </div>
        )}
      </Link>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
