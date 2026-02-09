import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCategories } from '@/hooks/useCategories';
import { MobileMenu } from './MobileMenu';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showAnnouncement && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary text-primary-foreground text-center text-xs sm:text-sm py-2 px-4 relative"
          >
            <p>
              Free delivery on orders above ₹999 · Use code{' '}
              <span className="font-semibold">WELCOME10</span> for 10% off
            </p>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-background'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 -ml-2 hover:bg-secondary rounded-lg transition-colors"
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
            <Link to="/" className="text-xl lg:text-2xl font-bold tracking-tight">
              LUXE<span className="text-accent">.</span>
            </Link>

            {/* Desktop search */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1 lg:gap-2">
              <button
                className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                to="#"
                className="hidden lg:flex p-2 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>
              <Link
                to="#"
                className="hidden lg:flex p-2 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Link>
              <Link
                to="/cart"
                className="p-2 hover:bg-secondary rounded-lg transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>

          {/* Desktop nav - from real categories */}
          <nav className="hidden lg:flex items-center gap-8 pb-3">
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {cat.name}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link
              to="/products"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              All Products
            </Link>
          </nav>
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
