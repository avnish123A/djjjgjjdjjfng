import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Package, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCategories } from '@/hooks/useCategories';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { MobileMenu } from './MobileMenu';
import { Logo } from '@/components/brand/Logo';
import { AnimatePresence, motion } from 'framer-motion';

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
  const announcementText = settings['announcement_text'] || 'Smart shopping starts here — discover exclusive deals, trending products & more.';

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
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
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
      {/* Announcement — Kinetic Marquee */}
      <AnimatePresence>
        {showAnnouncement && announcementEnabled && announcementText && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-foreground text-background overflow-hidden relative"
          >
            <div className="flex items-center h-9">
              <div className="animate-marquee flex whitespace-nowrap">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-xs font-medium mx-12 opacity-80">
                    {announcementText}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-background/20 hover:text-background/60 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 bg-background/95 backdrop-blur-sm ${
          scrolled ? 'border-b border-border/60' : ''
        } ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left — Hamburger + Logo */}
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 -ml-2" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
                <div className="space-y-1.5">
                  <span className="block w-5 h-0.5 bg-foreground rounded" />
                  <span className="block w-3.5 h-0.5 bg-foreground rounded" />
                </div>
              </button>
              <Link to="/" aria-label="CartZebra home"><Logo /></Link>
            </div>

            {/* Center — Nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {[
                { label: 'Shop', to: '/products' },
                { label: 'Deals', to: '/products?sort=discount' },
                { label: 'New Arrivals', to: '/products?sort=newest' },
                ...categories.slice(0, 3).map((c) => ({ label: c.name, to: `/products?category=${c.slug}` })),
              ].map((l) => (
                <Link key={l.label} to={l.to} className="text-sm font-semibold text-foreground/70 hover:text-foreground btn-editorial transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Right — Icons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>

              <Link
                to="/track-order"
                className="hidden lg:block p-2 text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Track Order"
              >
                <Package className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </Link>

              <Link
                to="/cart"
                className="p-2 text-foreground/60 hover:text-foreground transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Thin separator */}
        <div className="h-[1px] bg-foreground/8" />

        {/* Search overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-border/60"
            >
              <div className="container mx-auto px-4 py-6">
                <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands and categories..."
                    className="w-full bg-transparent border-b border-foreground/20 pb-3 text-lg text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/50 transition-colors"
                  />
                  <button type="submit" className="absolute right-0 bottom-3">
                    <Search className="h-5 w-5 text-foreground/40" strokeWidth={1.5} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
