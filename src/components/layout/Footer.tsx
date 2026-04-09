import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter, Youtube, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const footerLinks = {
  collection: [
    { label: 'Single-Origin Oils', href: '/products?category=single-origin-oils' },
    { label: 'Artisan Vinegars', href: '/products?category=artisan-vinegars' },
    { label: 'Heritage Spices', href: '/products?category=heritage-spices' },
    { label: 'Wild Honey', href: '/products?category=wild-honey' },
    { label: 'Rare Teas', href: '/products?category=rare-teas' },
    { label: 'Cured Salts', href: '/products?category=cured-salts' },
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

const socialIcons = [
  { key: 'social_instagram', icon: Instagram, label: 'Instagram' },
  { key: 'social_facebook', icon: Facebook, label: 'Facebook' },
  { key: 'social_twitter', icon: Twitter, label: 'Twitter' },
  { key: 'social_youtube', icon: Youtube, label: 'YouTube' },
];

export const Footer = () => {
  const { data: s = {} } = useSiteSettings();

  const email = s.contact_email || 'hello@terroirandco.com';
  const phone = s.contact_phone || '+91 98765 43210';
  const location = s.contact_location || 'India';

  const activeSocials = socialIcons.filter((si) => s[si.key]?.trim());

  return (
    <footer className="border-t border-foreground/8">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <h2 className="font-display text-2xl tracking-tighter mb-4">
              Terroir <span className="font-display-italic font-normal">&</span> Co.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-xs">
              Curating the world's finest artisan ingredients — single-origin oils, aged vinegars, heritage spices, and rare teas — for discerning palates.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span>{location}</span>
              </div>
            </div>
            {activeSocials.length > 0 && (
              <div className="flex items-center gap-3 mt-8">
                {activeSocials.map((si) => (
                  <a
                    key={si.key}
                    href={s[si.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={si.label}
                  >
                    <si.icon className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {[
            { title: 'COLLECTION', links: footerLinks.collection },
            { title: 'SUPPORT', links: footerLinks.support },
            { title: 'COMPANY', links: footerLinks.company },
          ].map((section) => (
            <div key={section.title} className="lg:col-span-2 lg:first:col-span-3">
              <h4 className="font-utility text-[10px] tracking-[0.25em] text-foreground/40 mb-6">{section.title}</h4>
              <nav className="space-y-3">
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="group flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" strokeWidth={1.5} />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-foreground/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-utility text-[9px] text-foreground/25 tracking-[0.2em]">
              &copy; {new Date().getFullYear()} TERROIR & CO. ALL RIGHTS RESERVED.
            </p>
            <p className="font-utility text-[9px] text-foreground/15 tracking-[0.15em]">
              CURATED WITH OBSESSION
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
