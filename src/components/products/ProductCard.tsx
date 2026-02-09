import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary mb-3">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              hasSecondaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
            }`}
            loading="lazy"
          />

          {/* Secondary image on hover */}
          {hasSecondaryImage && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge === 'Sale' && discount && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-destructive text-destructive-foreground">
                -{discount}%
              </span>
            )}
            {product.badge === 'New' && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-accent text-accent-foreground">
                New
              </span>
            )}
            {product.badge === 'Best Seller' && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-foreground text-background">
                Best Seller
              </span>
            )}
            {product.badge === 'Featured' && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-foreground text-background">
                Featured
              </span>
            )}
          </div>

          {/* Quick Actions (desktop hover) */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast('Added to wishlist');
              }}
              className="hidden lg:flex p-2 rounded-full bg-background shadow-soft hover:scale-110 transition-transform"
              aria-label="Add to wishlist"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              className="hidden lg:flex p-2 rounded-full bg-background shadow-soft hover:scale-110 transition-transform"
              aria-label="Quick view"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Wishlist — always visible, larger touch target */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast('Added to wishlist');
            }}
            className="lg:hidden absolute top-3 right-3 p-2.5 rounded-full bg-background/90 backdrop-blur-sm shadow-soft min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>

          {/* Add to Cart (desktop hover) */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0 hidden lg:block">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-foreground text-background rounded-full text-sm font-semibold hover:bg-foreground/90 transition-colors shadow-card-hover active:scale-[0.98]"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </button>
          </div>

          {/* Mobile Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="lg:hidden absolute bottom-3 right-3 p-2.5 rounded-full bg-foreground text-background shadow-card-hover min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center backdrop-blur-[2px]">
              <span className="px-4 py-2 bg-foreground text-background text-sm font-semibold rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1.5 px-0.5">
          {product.brand && (
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.1em] font-medium">{product.brand}</p>
          )}
          <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'fill-warning text-warning'
                        : 'text-border'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground">({product.reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="font-bold text-base">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
            {discount && (
              <span className="text-xs font-semibold text-success">
                {discount}% off
              </span>
            )}
          </div>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              {product.colors.slice(0, 4).map((color, i) => (
                <span
                  key={i}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-muted-foreground">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};
