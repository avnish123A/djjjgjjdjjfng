import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Package, ShoppingBag, X, Heart, User, MapPin, Cpu } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCategories } from '@/hooks/useCategories';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { MobileMenu } from './MobileMenu';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { data: categories = [] } = useCategories();
  const { data: settings = {} } = useSiteSettings();

  const announcementEnabled = settings['announcement_enabled'] !== 'false';
  const announcementText = settings['announcement_text'] || 'Free shipping on orders above ₹4999 · Use code TECH10 for 10% off';

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      if (currentY > 100) {
        setHeaderVisible(currentY < lastScrollY.current || currentY < 50);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <AnimatePresence>
        {showAnnouncement && announcementEnabled && announcementText && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary text-primary-foreground text-center text-[11px] sm:text-[12px] py-2 px-4 relative"
          >
            <p className="font-medium tracking-wide">
              {announcementText}
            </p>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/50 hover:text-primary-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 bg-background border-b border-border ${
          scrolled ? 'shadow-sm' : ''
        } ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {/* Top row */}
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 h-16 lg:h-[68px]">
            {/* Hamburger mobile */}
            <button
              className="lg:hidden p-2 -ml-2 hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <div className="space-y-1.5">
                <span className="block w-5 h-0.5 bg-foreground rounded-full" />
                <span className="block w-5 h-0.5 bg-foreground rounded-full" />
                <span className="block w-3.5 h-0.5 bg-foreground rounded-full" />
              </div>
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="bg-primary rounded-lg p-1.5">
                <Cpu className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight hidden sm:block">EkamTech</span>
            </Link>

            {/* Search bar — wide, centered */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for phones, laptops, tablets, accessories..."
                  className="w-full pl-5 pr-12 py-3 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
                />
                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors">
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1 shrink-0 ml-auto lg:ml-0">
              <button
                className="lg:hidden p-2.5 hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link
                to="/track-order"
                className="hidden lg:flex flex-col items-center p-2 hover:bg-secondary rounded-lg transition-colors min-w-[56px]"
                aria-label="Track Order"
              >
                <Package className="h-5 w-5" />
                <span className="text-[10px] text-muted-foreground mt-0.5">Track</span>
              </Link>

              <Link
                to="/contact"
                className="hidden lg:flex flex-col items-center p-2 hover:bg-secondary rounded-lg transition-colors min-w-[56px]"
                aria-label="Help"
              >
                <User className="h-5 w-5" />
                <span className="text-[10px] text-muted-foreground mt-0.5">Help</span>
              </Link>

              <Link
                to="/cart"
                className="flex flex-col items-center p-2 hover:bg-secondary rounded-lg transition-colors relative min-w-[44px] lg:min-w-[56px]"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="hidden lg:block text-[10px] text-muted-foreground mt-0.5">Cart</span>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="absolute top-0.5 right-0 bg-destructive text-destructive-foreground text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Category nav bar */}
        <div className="hidden lg:block border-t border-border bg-background">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="text-[13px] font-medium text-foreground/80 hover:text-primary hover:bg-secondary px-4 py-2.5 whitespace-nowrap transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                to="/products"
                className="text-[13px] font-medium text-primary hover:bg-secondary px-4 py-2.5 whitespace-nowrap transition-colors"
              >
                All Products
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden px-4 pb-3 border-t border-border"
            >
              <form onSubmit={handleSearch} className="relative mt-2">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search phones, laptops, tablets..."
                  className="w-full pl-4 pr-12 py-3 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-2 rounded-md">
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
