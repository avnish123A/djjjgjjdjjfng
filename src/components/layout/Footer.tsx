import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useCategories } from '@/hooks/useCategories';
import { Logo } from '@/components/brand/Logo';

const support = [
  { label: 'Track Order', href: '/track-order' },
  { label: 'Shipping Policy', href: '/policies/shipping' },
  { label: 'Return & Refund', href: '/policies/returns' },
  { label: 'FAQs', href: '/faq' },
];
const company = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'Privacy Policy', href: '/policies/privacy' },
  { label: 'Terms & Conditions', href: '/policies/terms' },
];
const payLogos = ['upi.svg', 'gpay.svg', 'phonepe.svg', 'paytm.svg', 'visa.svg', 'mastercard.svg', 'rupay.png'];

const socialIcons = [
  { key: 'social_instagram', icon: Instagram, label: 'Instagram' },
  { key: 'social_facebook', icon: Facebook, label: 'Facebook' },
  { key: 'social_twitter', icon: Twitter, label: 'Twitter' },
  { key: 'social_youtube', icon: Youtube, label: 'YouTube' },
];

export const Footer = () => {
  const { data: s = {} } = useSiteSettings();
  const { data: categories = [] } = useCategories();
  const email = (s.contact_email || '').trim();
  const phone = (s.contact_phone || '').trim();
  const location = (s.contact_location || '').trim();
  const activeSocials = socialIcons.filter((si) => s[si.key]?.trim());

  const sections = [
    { title: 'Shop', links: [{ label: 'All Products', href: '/products' }, ...categories.slice(0, 5).map((c) => ({ label: c.name, href: `/products?category=${c.slug}` }))] },
    { title: 'Support', links: support },
    { title: 'Company', links: company },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-5 text-sm text-primary-foreground/60 leading-relaxed max-w-xs">
              Shop smart. Discover more. Trending products, exclusive deals and giftable finds — all in one place.
            </p>
            <div className="mt-8 space-y-3 text-sm text-primary-foreground/60">
              {email && <a href={`mailto:${email}`} className="flex items-center gap-3 break-all hover:text-accent"><Mail className="h-4 w-4 text-accent shrink-0" strokeWidth={1.5} />{email}</a>}
              {phone && <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-3 hover:text-accent"><Phone className="h-4 w-4 text-accent shrink-0" strokeWidth={1.5} />{phone}</a>}
              {location && <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-accent shrink-0" strokeWidth={1.5} />{location}</div>}
            </div>
            {activeSocials.length > 0 && (
              <div className="flex gap-3 mt-8">
                {activeSocials.map((si) => (
                  <a key={si.key} href={s[si.key]} target="_blank" rel="noopener noreferrer" aria-label={si.label}
                    className="h-9 w-9 rounded-full border border-primary-foreground/15 flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors">
                    <si.icon className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            )}
          </div>
          {sections.map((section) => (
            <div key={section.title} className="lg:col-span-2 lg:first-of-type:col-span-3">
              <h4 className="font-bold text-sm mb-5">{section.title}</h4>
              <nav className="space-y-3">
                {section.links.map((link) => (
                  <Link key={link.label} to={link.href} className="block text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/50">© {new Date().getFullYear()} CartZebra. All rights reserved.</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {payLogos.map((l) => (
              <span key={l} className="h-7 px-2 rounded bg-primary-foreground flex items-center">
                <img src={`/logos/${l}`} alt={l.split('.')[0]} className="h-4 w-auto" loading="lazy" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
