import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  support: [
    { label: 'Contact Us', href: '#' },
    { label: 'FAQs', href: '#' },
    { label: 'Track Order', href: '#' },
    { label: 'Shipping Info', href: '#' },
  ],
  shop: [
    { label: 'Fashion', href: '/products?category=fashion' },
    { label: 'Electronics', href: '/products?category=electronics' },
    { label: 'Beauty', href: '/products?category=beauty' },
    { label: 'Home & Living', href: '/products?category=home-living' },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              LUXE<span className="text-accent">.</span>
            </h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Premium multi-category store with curated products for the modern lifestyle.
            </p>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@luxestore.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>New York, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <nav className="space-y-3">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Customer Service</h4>
            <nav className="space-y-3">
              {footerLinks.support.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Stay Updated</h4>
            <p className="text-sm text-primary-foreground/70 mb-4">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg text-sm placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <button className="px-4 py-2.5 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/50">
            © 2026 LUXE. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-primary-foreground/50">
            <Link to="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary-foreground transition-colors">Terms & Conditions</Link>
            <Link to="#" className="hover:text-primary-foreground transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};