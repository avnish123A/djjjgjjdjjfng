import { Link } from 'react-router-dom';
import { X, ChevronRight, Package, Search, Cpu } from 'lucide-react';
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
      <SheetContent side="left" className="w-[300px] sm:w-[340px] p-0 border-r-0 rounded-none">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-1.5">
                <Cpu className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight">EkamTech</span>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-4 pt-4 pb-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[2px] mb-2">Categories</p>
              <nav className="space-y-0.5">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between py-2.5 px-3 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
                  >
                    {cat.name}
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                ))}
                <Link
                  to="/products"
                  onClick={onClose}
                  className="flex items-center justify-between py-2.5 px-3 text-sm font-semibold text-primary hover:bg-secondary rounded-lg transition-colors"
                >
                  View All
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </nav>
            </div>

            <div className="border-t border-border mx-4" />

            <div className="px-4 py-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[2px] mb-2">Quick Links</p>
              <nav className="space-y-0.5">
                <Link to="/track-order" onClick={onClose} className="flex items-center gap-3 py-2.5 px-3 text-sm font-medium hover:bg-secondary rounded-lg transition-colors">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Track Order
                </Link>
              </nav>
            </div>

            <div className="border-t border-border mx-4" />

            <div className="px-4 py-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[2px] mb-2">Help</p>
              <nav className="space-y-1">
                <Link to="/policies/shipping" onClick={onClose} className="block py-2 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors">Shipping</Link>
                <Link to="/policies/returns" onClick={onClose} className="block py-2 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors">Returns</Link>
                <Link to="/policies/privacy" onClick={onClose} className="block py-2 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              </nav>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
