import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

const saleEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

const banners = [
  {
    title: 'AMOLED Phones Under ₹25,000',
    subtitle: 'Best display phones at budget prices',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
    link: '/products?category=smartphones',
    bg: 'from-blue-50 to-cyan-50',
  },
  {
    title: 'Laptop Deals of the Week',
    subtitle: 'Up to 25% off on select laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    link: '/products?category=laptops',
    bg: 'from-violet-50 to-blue-50',
  },
];

export const PromoBanners = () => {
  return (
    <section className="py-6 lg:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <Link
              key={banner.title}
              to={banner.link}
              className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${banner.bg} p-6 lg:p-8 flex items-center gap-4 group hover:shadow-md transition-shadow`}
            >
              <div className="flex-1">
                <h3 className="font-display text-base lg:text-lg mb-1">{banner.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{banner.subtitle}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                  Shop Now <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="w-24 h-24 lg:w-32 lg:h-32 shrink-0">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover rounded-lg" loading="lazy" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
