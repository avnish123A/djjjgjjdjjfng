import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  return (
    <div ref={ref} className="group relative card-editorial">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-[4/5] bg-secondary mb-3 rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.025]"
            loading="lazy"
            width={1024}
            height={1280}
          />
          {product.images[1] && <img src={product.images[1]} alt="" className="absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-opacity duration-300 md:block md:group-hover:opacity-100" loading="lazy" width={1024} height={1280} />}
          
          {/* Badge — minimal */}
          {product.badge && (
            <div className="absolute top-4 left-4">
              <span className="font-utility bg-primary/90 px-2.5 py-1 text-primary-foreground">
                {product.badge}
              </span>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            size="icon"
            variant="secondary"
            className="absolute bottom-3 right-3 h-10 w-10 bg-background/95 text-foreground shadow-sm backdrop-blur md:opacity-0 md:translate-y-1 md:group-hover:translate-y-0 md:group-hover:opacity-100"
            aria-label="Add to cart"
            disabled={!product.inStock}
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>

        <div className="space-y-1.5">
          {product.brand && <p className="text-[11px] font-medium text-muted-foreground">{product.brand}</p>}
          <h3 className="text-sm sm:text-base font-semibold leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-200">
            {product.name}
          </h3>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-0.5">
            <span className="text-sm font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <p className={`text-[11px] font-medium ${product.inStock ? 'text-success' : 'text-destructive'}`}>{product.inStock ? (product.stock <= (product.lowStockThreshold || 5) ? `Only ${product.stock} left` : 'In stock') : 'Out of stock'}</p>
        </div>

        {/* Out of Stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="font-utility text-foreground/60">Out of stock</span>
          </div>
        )}
      </Link>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
