import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

// Extract tasting notes from description if present
const extractNotes = (desc?: string): string | null => {
  if (!desc) return null;
  const match = desc.match(/Notes of:\s*([^.]+)/i);
  return match ? match[1].trim() : null;
};

const extractOrigin = (desc?: string): string | null => {
  if (!desc) return null;
  const match = desc.match(/Origin:\s*([^—–]+)/i);
  return match ? match[1].trim().replace(/,\s*$/, '') : null;
};

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(({ product }, ref) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) {
      toast.error('This product is currently unavailable');
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

  const notes = extractNotes(product.description);
  const origin = extractOrigin(product.description);

  return (
    <div ref={ref} className="group relative card-editorial">
      <Link to={`/product/${product.id}`} className="block">
        {/* Image — sensory hover */}
        <div className="relative overflow-hidden aspect-[3/4] bg-secondary/30 mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover sensory-hover"
            loading="lazy"
          />
          
          {/* Badge — minimal */}
          {product.badge && (
            <div className="absolute top-4 left-4">
              <span className="font-utility text-[8px] tracking-[0.2em] text-white bg-foreground/80 px-2.5 py-1">
                {product.badge.toUpperCase()}
              </span>
            </div>
          )}

          {/* Add to cart — appears on hover */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 p-3 bg-background/90 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-foreground hover:text-background"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Info — editorial typography */}
        <div className="space-y-2">
          {origin && (
            <p className="font-utility text-[9px] tracking-[0.2em] text-foreground/35">
              {origin.toUpperCase()}
            </p>
          )}

          <h3 className="font-display text-base tracking-tight leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-500">
            {product.name}
          </h3>

          {notes && (
            <p className="font-display-italic text-xs text-muted-foreground leading-relaxed line-clamp-1">
              Notes of: {notes}
            </p>
          )}

          <div className="flex items-baseline gap-3 pt-1">
            <span className="font-utility text-[11px] tracking-[0.1em]">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-utility text-[10px] tracking-[0.1em] text-foreground/30 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Out of Stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="font-utility text-[10px] tracking-[0.2em] text-foreground/60">
              SOLD OUT
            </span>
          </div>
        )}
      </Link>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
