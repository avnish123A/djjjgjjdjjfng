import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import heroFallback from '@/assets/hero-premium-gift.jpg';

export const HeroCarousel = () => {
  const { data: s = {} } = useSiteSettings();

  const subtitle = s.hero_subtitle || 'The Art of Gifting';
  const title = s.hero_title || 'Gifts That Speak Louder';
  const description = s.hero_description || 'Thoughtfully curated, beautifully wrapped. Discover premium gifts for every moment that matters.';
  const ctaPrimaryText = s.hero_cta_primary_text || 'Explore Collection';
  const ctaPrimaryLink = s.hero_cta_primary_link || '/products';
  const ctaSecondaryText = s.hero_cta_secondary_text || 'Personalize a Gift';
  const ctaSecondaryLink = s.hero_cta_secondary_link || '/products?category=personalized-gifts';
  const heroImage = s.hero_image_url || heroFallback;

  // Split title to highlight last word in primary color
  const titleWords = title.split(' ');
  const lastWord = titleWords.pop();
  const titleStart = titleWords.join(' ');

  return (
    <section className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden">
      <img
        src={heroImage}
        alt="Premium curated gift boxes with teal ribbons"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />

      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="inline-block text-[11px] sm:text-xs font-medium uppercase tracking-[6px] text-white/50 mb-6">
              {subtitle}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl text-white mb-6 leading-[1.05] tracking-tight">
              {titleStart}{' '}
              <span className="text-primary">{lastWord}</span>
            </h1>
            <p className="text-base sm:text-lg text-white/60 mb-12 max-w-lg leading-relaxed">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={ctaPrimaryLink}
                className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-xl text-sm font-semibold uppercase tracking-[2px] hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                {ctaPrimaryText}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {ctaSecondaryText && (
                <Link
                  to={ctaSecondaryLink}
                  className="inline-flex items-center justify-center gap-3 bg-white/10 text-white backdrop-blur-sm px-10 py-4 rounded-xl text-sm font-semibold uppercase tracking-[2px] hover:bg-white/20 transition-all border border-white/10"
                >
                  {ctaSecondaryText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
