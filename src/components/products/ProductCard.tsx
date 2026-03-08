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
    <div ref={ref} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 product-3d">
      <Link to={`/product/${product.id}`} className="block">
        {/* Image */}
        <div className="relative bg-secondary/30 p-4">
          {/* Badges top-left */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.badge === 'Sale' && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-destructive text-destructive-foreground rounded">
                Sale
              </span>
            )}
            {product.badge === 'New' && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded">
                New
              </span>
            )}
            {product.badge === 'Best Seller' && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-foreground text-background rounded">
                Best Seller
              </span>
            )}
          </div>

          {/* Wishlist top-right */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast('Added to wishlist');
            }}
            className="absolute top-2 right-2 p-2 bg-card/90 rounded-full shadow-sm hover:shadow-md hover:text-destructive transition-all z-10 min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>

          {/* Product image — centered, contained */}
          <div className="aspect-square flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="p-3 lg:p-4 space-y-2">
          {/* Brand */}
          {product.brand && (
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{product.brand}</p>
          )}

          {/* Title */}
          <h3 className="text-sm font-medium leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 bg-success text-success-foreground px-1.5 py-0.5 rounded text-[10px] font-bold">
                {product.rating}
                <Star className="h-2.5 w-2.5 fill-current" />
              </div>
              <span className="text-[11px] text-muted-foreground">({product.reviewCount?.toLocaleString()})</span>
            </div>
          )}

          {/* Price */}
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">{formatPrice(product.price)}</span>
              {discount && (
                <span className="text-xs font-semibold text-success">{discount}% Off</span>
              )}
            </div>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground">
                MRP <span className="line-through">{formatPrice(product.originalPrice)}</span>
              </p>
            )}
          </div>

          {/* Delivery info */}
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Truck className="h-3 w-3 shrink-0" />
            <span>Free Delivery</span>
          </div>
        </div>

        {/* Cart button at bottom */}
        <div className="px-3 lg:px-4 pb-3 lg:pb-4">
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors active:scale-[0.98]"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Cart
          </button>
        </div>

        {/* Out of Stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center backdrop-blur-[2px] rounded-xl">
            <span className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
      </Link>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
