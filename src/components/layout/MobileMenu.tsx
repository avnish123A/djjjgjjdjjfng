import { Link } from 'react-router-dom';
import { X, ChevronRight, User, Heart, Package, Search } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useCategories } from '@/hooks/useCategories';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const accountLinks = [
  { label: 'My Account', href: '#', icon: User },
  { label: 'Wishlist', href: '#', icon: Heart },
  { label: 'My Orders', href: '#', icon: Package },
];

export const MobileMenu = ({ open, onClose }: MobileMenuProps) => {
  const { data: categories = [] } = useCategories();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[340px] p-0 border-r-0 rounded-none">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border">
            <img src="/logo-ekamgift.jpeg" alt="EkamGift" className="h-7 w-auto object-contain" />
            <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search */}
          <div className="px-5 pt-5 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 pt-4 pb-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[3px] mb-3">
                Categories
              </p>
              <nav className="space-y-0.5">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between py-3 px-3 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
                  >
                    {cat.name}
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                ))}
                <Link
                  to="/products"
                  onClick={onClose}
                  className="flex items-center justify-between py-3 px-3 text-sm font-semibold text-primary hover:bg-secondary rounded-lg transition-colors"
                >
                  View All
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </nav>
            </div>

            <div className="border-t border-border mx-5" />

            <div className="px-5 py-4">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[3px] mb-3">
                Account
              </p>
              <nav className="space-y-0.5">
                {accountLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 py-3 px-3 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="border-t border-border mx-5" />

            <div className="px-5 py-4">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[3px] mb-3">
                Help
              </p>
              <nav className="space-y-1">
                <Link to="/policies/shipping" onClick={onClose} className="block py-2 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Shipping Policy
                </Link>
                <Link to="/policies/returns" onClick={onClose} className="block py-2 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Return & Refund
                </Link>
                <Link to="/policies/privacy" onClick={onClose} className="block py-2 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
