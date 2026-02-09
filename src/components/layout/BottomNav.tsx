import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, Search, Heart, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/products', icon: Grid3X3, label: 'Shop' },
  { to: '/products?search=', icon: Search, label: 'Search' },
  { to: '#', icon: Heart, label: 'Wishlist' },
  { to: '#', icon: User, label: 'Account' },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-bottom-nav" style={{ height: '60px' }}>
      <div className="grid grid-cols-5 h-full">
        {navItems.map((item) => {
          const isActive = item.to === '/'
            ? location.pathname === '/'
            : item.to !== '#' && location.pathname.startsWith(item.to.split('?')[0]);

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? 'text-accent' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
