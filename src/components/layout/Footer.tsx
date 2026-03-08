import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const footerLinks = {
  shop: [
    { label: 'New Arrivals', href: '/products' },
    { label: 'Best Sellers', href: '/products' },
    { label: 'Kurta Sets', href: '/products' },
    { label: 'All Products', href: '/products' },
  ],
  support: [
    { label: 'Track Order', href: '/track-order' },
    { label: 'Shipping Policy', href: '/policies/shipping' },
    { label: 'Return & Refund', href: '/policies/returns' },
    { label: 'FAQs', href: '/faq' },
  ],
  company: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/policies/privacy' },
    { label: 'Terms & Conditions', href: '/policies/terms' },
  ],
};

const paymentLogos = [
  { name: 'Visa', src: '/logos/visa.svg' },
  { name: 'Mastercard', src: '/logos/mastercard.svg' },
  { name: 'UPI', src: '/logos/upi.svg' },
  { name: 'RuPay', src: '/logos/rupay.png' },
  { name: 'Google Pay', src: '/logos/gpay.svg' },
  { name: 'PhonePe', src: '/logos/phonepe.svg' },
  { name: 'Paytm', src: '/logos/paytm.svg' },
];

const socialIcons = [
  { key: 'social_instagram', icon: Instagram, label: 'Instagram' },
  { key: 'social_facebook', icon: Facebook, label: 'Facebook' },
  { key: 'social_twitter', icon: Twitter, label: 'Twitter' },
  { key: 'social_youtube', icon: Youtube, label: 'YouTube' },
];

export const Footer = () => {
  const { data: s = {} } = useSiteSettings();

  const email = s.contact_email || 'hello@ekamwear.com';
  const phone = s.contact_phone || '+91 98765 43210';
  const location = s.contact_location || 'India';

  const activeSocials = socialIcons.filter((si) => s[si.key]?.trim());

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <img src="/logo-ekamwear.png" alt="EkamWear" className="h-12 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-background/40 text-sm leading-relaxed mb-6 max-w-xs">
              Premium Indian ethnic fashion for every occasion. Handcrafted with love, delivered with care across India.
            </p>
            <div className="space-y-2.5 text-sm text-background/40">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{location}</span>
              </div>
            </div>
            {activeSocials.length > 0 && (
              <div className="flex items-center gap-2 mt-6">
                {activeSocials.map((si) => (
                  <a
                    key={si.key}
                    href={s[si.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-background/10 rounded-lg hover:border-primary hover:text-primary transition-all duration-200"
                    aria-label={si.label}
                  >
                    <si.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-medium mb-5 text-[11px] uppercase tracking-[3px] text-background/50">Shop</h4>
            <nav className="space-y-3">
              {footerLinks.shop.map((link) => (
                <Link key={link.label} to={link.href} className="block text-sm text-background/35 hover:text-primary transition-colors">
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
                <Link key={link.label} to={link.href} className="block text-sm text-background/35 hover:text-primary transition-colors">
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
                <Link key={link.label} to={link.href} className="block text-sm text-background/35 hover:text-primary transition-colors">
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
              &copy; {new Date().getFullYear()} EkamWear. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-background/20 uppercase tracking-wider mr-1">We Accept</span>
              {paymentLogos.map((logo) => (
                <div key={logo.name} className="h-6 w-auto px-1.5 py-0.5 bg-background/10 border border-background/5 rounded flex items-center justify-center">
                  <img src={logo.src} alt={logo.name} className="h-4 w-auto object-contain brightness-0 invert opacity-60" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
