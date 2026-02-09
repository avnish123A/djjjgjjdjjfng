import { Link } from 'react-router-dom';
import { X, ChevronRight, User, Heart, Package } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: 'Fashion', href: '/products?category=fashion' },
  { label: 'Electronics', href: '/products?category=electronics' },
  { label: 'Beauty & Health', href: '/products?category=beauty' },
  { label: 'Home & Living', href: '/products?category=home-living' },
  { label: 'Sports & Fitness', href: '/products?category=sports' },
  { label: 'FMCG & Grocery', href: '/products?category=fmcg' },
];

const accountLinks = [
  { label: 'My Account', href: '#', icon: User },
  { label: 'Wishlist', href: '#', icon: Heart },
  { label: 'Orders', href: '#', icon: Package },
];

export const MobileMenu = ({ open, onClose }: MobileMenuProps) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-lg font-bold tracking-tight">
              LUXE<span className="text-accent">.</span>
            </span>
            <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Categories */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Shop by Category
              </p>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between py-3 px-3 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="border-t border-border mx-4" />

            <div className="p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Account
              </p>
              <nav className="space-y-1">
                {accountLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 py-3 px-3 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="border-t border-border mx-4" />

            <div className="p-4">
              <Link
                to="/products"
                onClick={onClose}
                className="block w-full text-center py-3 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};