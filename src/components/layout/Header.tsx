import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCategories } from '@/hooks/useCategories';
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
        {showAnnouncement && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-foreground text-background text-center text-[12px] py-2.5 px-4 relative"
          >
            <p className="font-medium tracking-[2px] uppercase">
              Complimentary shipping on orders above ₹999 · Code{' '}
              <span className="text-accent font-semibold">WELCOME10</span> for 10% off
            </p>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-background/40 hover:text-background transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 bg-background/98 backdrop-blur-md ${
          scrolled ? 'shadow-nav' : 'border-b border-border'
        } ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Left: Hamburger (mobile) */}
            <button
              className="lg:hidden p-2 -ml-2 hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <div className="space-y-1.5">
                <span className="block w-5 h-0.5 bg-foreground" />
                <span className="block w-5 h-0.5 bg-foreground" />
                <span className="block w-3.5 h-0.5 bg-foreground" />
              </div>
            </button>

            {/* Logo */}
            <Link to="/" className="font-display text-xl lg:text-2xl font-bold tracking-wide">
              AUREA
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 ml-10">
              {categories.slice(0, 5).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors relative group py-5 uppercase tracking-wider"
                >
                  {cat.name}
                  <span className="absolute bottom-4 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
              <Link
                to="/products"
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
              >
                All
              </Link>
            </nav>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-sm mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-secondary border-0 text-sm focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-muted-foreground"
                />
              </form>
            </div>

            {/* Icon Toolbar */}
            <div className="flex items-center gap-0.5">
              <button
                className="lg:hidden p-2.5 hover:bg-secondary transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>
              <Link
                to="#"
                className="hidden lg:flex p-2.5 hover:bg-secondary transition-colors"
                aria-label="Account"
              >
                <User className="h-[18px] w-[18px]" />
              </Link>
              <Link
                to="#"
                className="hidden lg:flex p-2.5 hover:bg-secondary transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-[18px] w-[18px]" />
              </Link>
              <Link
                to="/cart"
                className="p-2.5 hover:bg-secondary transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="h-[18px] w-[18px]" />
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="absolute top-0.5 right-0.5 bg-accent text-accent-foreground text-[9px] font-bold h-4 w-4 flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden px-4 pb-3"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary text-sm focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
