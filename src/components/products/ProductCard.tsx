import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import type { Product } from '@/data/products';

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

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Badge */}
          {product.badge && (
            <span
              className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
                product.badge === 'Sale'
                  ? 'bg-destructive text-destructive-foreground'
                  : product.badge === 'New'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {product.badge}
              {product.badge === 'Sale' && discount ? ` -${discount}%` : ''}
            </span>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast('Added to wishlist');
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-background"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>

          {/* Quick add */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </button>
          </div>

          {/* Mobile add to cart - always visible */}
          <button
            onClick={handleAddToCart}
            className="lg:hidden absolute bottom-3 right-3 p-2.5 rounded-full bg-primary text-primary-foreground shadow-card"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</p>
          <h3 className="text-sm font-medium leading-snug line-clamp-2">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-accent text-accent'
                      : 'text-border'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>

          {/* Color dots */}
          {product.colors && (
            <div className="flex items-center gap-1.5 pt-1">
              {product.colors.map((color, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};