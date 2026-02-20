import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
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

  const hasSecondaryImage = product.images && product.images.length > 1;

  return (
    <div ref={ref} className="group transition-all duration-300 ease-out hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary rounded-2xl mb-4 shadow-soft hover:shadow-card-hover transition-shadow duration-500">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ${
              hasSecondaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
            }`}
            loading="lazy"
          />

          {hasSecondaryImage && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              loading="lazy"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge === 'Sale' && discount && (
              <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-accent text-accent-foreground rounded-full">
                -{discount}%
              </span>
            )}
            {product.badge === 'New' && (
              <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground rounded-full">
                New
              </span>
            )}
            {(product.badge === 'Best Seller' || product.badge === 'Featured') && (
              <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-foreground text-background rounded-full">
                {product.badge}
              </span>
            )}
            {product.inStock && product.stock <= (product.lowStockThreshold || 5) && (
              <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-amber-500 text-white rounded-full">
                Only {product.stock} left
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
            className="absolute top-3 right-3 p-2.5 bg-card/90 backdrop-blur-sm rounded-xl shadow-soft hover:scale-110 transition-transform min-w-[44px] min-h-[44px] flex items-center justify-center opacity-0 group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
            style={{ opacity: undefined }}
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>

          {/* Mobile wishlist always visible */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast('Added to wishlist');
            }}
            className="lg:hidden absolute top-3 right-3 p-2.5 bg-card/90 backdrop-blur-sm rounded-xl shadow-soft min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>

          {/* Add to Cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hidden lg:block">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors active:scale-[0.98]"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </button>
          </div>

          {/* Mobile Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="lg:hidden absolute bottom-3 right-3 p-2.5 bg-primary text-primary-foreground rounded-xl shadow-card-hover min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>

          {/* Out of Stock */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center backdrop-blur-[2px] rounded-2xl">
              <span className="px-4 py-2 bg-foreground text-background text-sm font-medium uppercase tracking-wider rounded-xl">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1.5 px-1">
          {product.brand && (
            <p className="text-[10px] text-primary uppercase tracking-[3px] font-medium">{product.brand}</p>
          )}
          <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {product.rating > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-border'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground">({product.reviewCount})</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <span className="font-semibold text-base">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
            {discount && (
              <span className="text-xs font-medium text-success">
                {discount}% off
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
