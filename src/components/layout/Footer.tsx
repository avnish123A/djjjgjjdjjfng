import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ShieldCheck, Truck, RotateCcw, CreditCard, BadgeCheck, Lock, Instagram } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'New Arrivals', href: '/products' },
    { label: 'Best Sellers', href: '/products' },
    { label: 'Gift Sets', href: '/products' },
    { label: 'All Products', href: '/products' },
  ],
  support: [
    { label: 'Track Order', href: '/track-order' },
    { label: 'Shipping Policy', href: '/policies/shipping' },
    { label: 'Return & Refund', href: '/policies/returns' },
    { label: 'FAQs', href: '#' },
    { label: 'Contact Us', href: '#' },
  ],
  company: [
    { label: 'Our Story', href: '#' },
    { label: 'Privacy Policy', href: '/policies/privacy' },
    { label: 'Terms & Conditions', href: '/policies/terms' },
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

const paymentLogos = [
  { name: 'Visa', src: '/logos/visa.svg' },
  { name: 'Mastercard', src: '/logos/mastercard.svg' },
  { name: 'UPI', src: '/logos/upi.svg' },
  { name: 'RuPay', src: '/logos/rupay.png' },
  { name: 'Google Pay', src: '/logos/gpay.svg' },
  { name: 'PhonePe', src: '/logos/phonepe.svg' },
  { name: 'Paytm', src: '/logos/paytm.svg' },
];

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Trust Badges Strip */}
      <div className="border-b border-background/8">
        <div className="container mx-auto px-4 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2.5 text-background/60">
                <badge.icon className="h-4 w-4 text-primary shrink-0" />
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
            <div className="mb-4">
              <img src="/logo-ekamgift.png" alt="EkamGift" className="h-14 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-background/40 text-sm leading-relaxed mb-6 max-w-xs">
              Curated gifts and premium lifestyle products for every occasion. Thoughtfully selected, beautifully delivered.
            </p>
            <div className="space-y-2.5 text-sm text-background/40">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0" />
                <span>hello@ekamgift.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>India</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <a
                href="#"
                className="p-2 border border-background/10 rounded-lg hover:border-primary hover:text-primary transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-medium mb-5 text-[11px] uppercase tracking-[3px] text-background/50">Shop</h4>
            <nav className="space-y-3">
              {footerLinks.shop.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block text-sm text-background/35 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium mb-5 text-[11px] uppercase tracking-[3px] text-background/50">Support</h4>
            <nav className="space-y-3">
              {footerLinks.support.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block text-sm text-background/35 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium mb-5 text-[11px] uppercase tracking-[3px] text-background/50">Company</h4>
            <nav className="space-y-3">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block text-sm text-background/35 hover:text-primary transition-colors"
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
            <p className="text-xs text-background/25">
              © 2026 EkamGift. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-background/20 uppercase tracking-wider mr-1">We Accept</span>
              {paymentLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="h-6 w-auto px-1.5 py-0.5 bg-background/10 border border-background/5 rounded flex items-center justify-center"
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="h-4 w-auto object-contain brightness-0 invert opacity-60"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
