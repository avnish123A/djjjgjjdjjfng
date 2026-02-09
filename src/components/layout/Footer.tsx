import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ShieldCheck, Truck, RotateCcw, CreditCard, BadgeCheck, Lock } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact Us', href: '#' },
  ],
  support: [
    { label: 'FAQs', href: '#' },
    { label: 'Track Order', href: '#' },
    { label: 'Shipping Policy', href: '/policies/shipping' },
    { label: 'Return & Refund', href: '/policies/returns' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/policies/privacy' },
    { label: 'Terms & Conditions', href: '/policies/terms' },
    { label: 'Shipping Policy', href: '/policies/shipping' },
    { label: 'Refund Policy', href: '/policies/returns' },
  ],
};

const trustBadges = [
  { icon: ShieldCheck, label: '100% Genuine' },
  { icon: Truck, label: 'Free Delivery' },
  { icon: RotateCcw, label: 'Easy Returns' },
  { icon: CreditCard, label: 'Secure Payment' },
  { icon: Lock, label: 'SSL Encrypted' },
  { icon: BadgeCheck, label: 'Quality Assured' },
];

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Trust Badges Bar */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 text-primary-foreground/80">
                <badge.icon className="h-4 w-4 text-accent" />
                <span className="text-xs font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              LUXE<span className="text-accent">.</span>
            </h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Premium multi-category store with curated products for the modern lifestyle. Shop with confidence.
            </p>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@luxestore.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, Maharashtra, India</span>
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

          {/* Legal / Newsletter */}
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
            <Link to="/policies/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
            <Link to="/policies/terms" className="hover:text-primary-foreground transition-colors">Terms & Conditions</Link>
            <Link to="/policies/shipping" className="hover:text-primary-foreground transition-colors">Shipping</Link>
            <Link to="/policies/returns" className="hover:text-primary-foreground transition-colors">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
