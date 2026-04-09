import { Link } from 'react-router-dom';
import { X, ChevronRight, Package } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useCategories } from '@/hooks/useCategories';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ open, onClose }: MobileMenuProps) => {
  const { data: categories = [] } = useCategories();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[340px] p-0 border-r-0 rounded-none bg-background">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-foreground/8">
            <h2 className="font-display text-lg tracking-tighter">
              Terroir <span className="font-display-italic font-normal">&</span> Co.
            </h2>
            <button onClick={onClose} className="p-1 text-foreground/40 hover:text-foreground transition-colors">
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-6 pt-6 pb-3">
              <p className="font-utility text-[9px] tracking-[0.25em] text-foreground/30 mb-4">COLLECTION</p>
              <nav className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between py-3 text-sm text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {cat.name}
                    <ChevronRight className="h-3.5 w-3.5 text-foreground/20" strokeWidth={1.5} />
                  </Link>
                ))}
                <Link
                  to="/products"
                  onClick={onClose}
                  className="flex items-center justify-between py-3 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  View All
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Link>
              </nav>
            </div>

            <div className="h-[1px] bg-foreground/5 mx-6" />

            <div className="px-6 py-4">
              <p className="font-utility text-[9px] tracking-[0.25em] text-foreground/30 mb-4">QUICK LINKS</p>
              <nav className="space-y-1">
                <Link to="/track-order" onClick={onClose} className="flex items-center gap-3 py-3 text-sm text-foreground/70 hover:text-foreground transition-colors">
                  <Package className="h-4 w-4" strokeWidth={1.5} />
                  Track Order
                </Link>
              </nav>
            </div>

            <div className="h-[1px] bg-foreground/5 mx-6" />

            <div className="px-6 py-4">
              <p className="font-utility text-[9px] tracking-[0.25em] text-foreground/30 mb-4">HELP</p>
              <nav className="space-y-2">
                <Link to="/policies/shipping" onClick={onClose} className="block py-2 text-sm text-foreground/50 hover:text-foreground transition-colors">Shipping</Link>
                <Link to="/policies/returns" onClick={onClose} className="block py-2 text-sm text-foreground/50 hover:text-foreground transition-colors">Returns</Link>
                <Link to="/policies/privacy" onClick={onClose} className="block py-2 text-sm text-foreground/50 hover:text-foreground transition-colors">Privacy</Link>
              </nav>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
