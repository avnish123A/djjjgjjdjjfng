import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter, Youtube, Cpu, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const footerLinks = {
  shop: [
    { label: 'Smartphones', href: '/products?category=smartphones' },
    { label: 'Laptops', href: '/products?category=laptops' },
    { label: 'Tablets', href: '/products?category=tablets' },
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

  const email = s.contact_email || 'hello@ekamtech.com';
  const phone = s.contact_phone || '+91 98765 43210';
  const location = s.contact_location || 'India';

  const activeSocials = socialIcons.filter((si) => s[si.key]?.trim());

  return (
    <footer className="relative overflow-hidden">
      {/* Gradient top border */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      
      <div className="bg-foreground text-white">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 py-12 lg:py-16 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-2">
                  <Cpu className="h-5 w-5 text-white" />
                </div>
                <span className="font-display text-xl font-bold tracking-tight">
                  Ekam<span className="text-primary">Tech</span>
                </span>
              </div>
              <p className="text-white/35 text-sm leading-relaxed mb-5 max-w-xs">
                Your destination for genuine electronics. Smartphones, laptops, and tablets from top brands at best prices.
              </p>
              <div className="space-y-2.5 text-sm text-white/35">
                <div className="flex items-center gap-2.5 hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>{email}</span>
                </div>
                <div className="flex items-center gap-2.5 hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center gap-2.5 hover:text-primary transition-colors">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{location}</span>
                </div>
              </div>
              {activeSocials.length > 0 && (
                <div className="flex items-center gap-2.5 mt-5">
                  {activeSocials.map((si) => (
                    <a
                      key={si.key}
                      href={s[si.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 border border-white/10 rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                      aria-label={si.label}
                    >
                      <si.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {[
              { title: 'Shop', links: footerLinks.shop },
              { title: 'Support', links: footerLinks.support },
              { title: 'Company', links: footerLinks.company },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-5 text-[11px] uppercase tracking-[3px] text-white/40">{section.title}</h4>
                <nav className="space-y-3">
                  {section.links.map((link) => (
                    <Link key={link.label} to={link.href} className="group flex items-center gap-1.5 text-sm text-white/30 hover:text-primary transition-colors">
                      <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/5">
          <div className="container mx-auto px-4 py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-white/20">
                &copy; {new Date().getFullYear()} EkamTech. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/15 uppercase tracking-wider mr-2">We Accept</span>
                {paymentLogos.map((logo) => (
                  <div key={logo.name} className="h-6 px-2 py-1 bg-white/5 border border-white/5 rounded-md flex items-center justify-center">
                    <img src={logo.src} alt={logo.name} className="h-3.5 w-auto object-contain brightness-0 invert opacity-50" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
