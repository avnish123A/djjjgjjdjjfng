import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ShieldCheck, Truck, RotateCcw, CreditCard, BadgeCheck, Lock, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'New Arrivals', href: '/products' },
    { label: 'Best Sellers', href: '/products' },
    { label: 'Sale', href: '/products' },
    { label: 'All Products', href: '/products' },
  ],
  support: [
    { label: 'Track Order', href: '#' },
    { label: 'Shipping Policy', href: '/policies/shipping' },
    { label: 'Return & Refund', href: '/policies/returns' },
    { label: 'FAQs', href: '#' },
    { label: 'Contact Us', href: '#' },
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Privacy Policy', href: '/policies/privacy' },
    { label: 'Terms & Conditions', href: '/policies/terms' },
    { label: 'Careers', href: '#' },
  ],
};

const trustBadges = [
  { icon: ShieldCheck, label: '100% Genuine Products' },
  { icon: Truck, label: 'Free Delivery ₹999+' },
  { icon: RotateCcw, label: '7-Day Easy Returns' },
  { icon: CreditCard, label: 'Secure Payments' },
  { icon: Lock, label: 'SSL Encrypted' },
  { icon: BadgeCheck, label: 'Quality Assured' },
];

const paymentMethods = ['Visa', 'Mastercard', 'UPI', 'RuPay', 'Paytm', 'PhonePe', 'GPay'];

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Trust Badges Strip */}
      <div className="border-b border-background/8">
        <div className="container mx-auto px-4 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2.5 text-background/70">
                <badge.icon className="h-4 w-4 text-accent shrink-0" />
                <span className="text-xs font-medium leading-tight">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-extrabold mb-4 tracking-tight">
              LUXE<span className="text-accent">.</span>
            </h3>
            <p className="text-background/50 text-sm leading-relaxed mb-6 max-w-xs">
              India's premier multi-category store. Curated products for the modern lifestyle. Shop with confidence — 100% genuine, always.
            </p>
            <div className="space-y-2.5 text-sm text-background/50">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0" />
                <span>support@luxestore.in</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
            {/* Social Icons */}
            <div className="flex items-center gap-2 mt-6">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Youtube, label: 'YouTube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="p-2 rounded-full bg-background/8 hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-5 text-xs uppercase tracking-[0.15em] text-background/60">Shop</h4>
            <nav className="space-y-3">
              {footerLinks.shop.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block text-sm text-background/40 hover:text-background transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-5 text-xs uppercase tracking-[0.15em] text-background/60">Customer Service</h4>
            <nav className="space-y-3">
              {footerLinks.support.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block text-sm text-background/40 hover:text-background transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-5 text-xs uppercase tracking-[0.15em] text-background/60">Company</h4>
            <nav className="space-y-3">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block text-sm text-background/40 hover:text-background transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/8">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-background/30">
              © 2026 LUXE. All rights reserved.
            </p>
            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-background/25 uppercase tracking-wider mr-1">We Accept</span>
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="text-[10px] font-medium text-background/35 px-2 py-0.5 rounded bg-background/5"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
