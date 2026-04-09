import { HeroCarousel } from '@/components/home/HeroCarousel';
import { Marquee } from '@/components/home/Marquee';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { PromoBanners } from '@/components/home/PromoBanners';
import { FlashDeals } from '@/components/home/FlashDeals';
import { BestSellers } from '@/components/home/BestSellers';
import { TrustSection } from '@/components/home/TrustSection';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';
import { Testimonials } from '@/components/home/Testimonials';
import { FAQSection } from '@/components/home/FAQSection';

const Index = () => {
  return (
    <main>
      <HeroCarousel />
      <Marquee />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanners />
      <FlashDeals />
      <BestSellers />
      <TrustSection />
      <Testimonials />
      <FAQSection />
      <NewsletterSignup />
    </main>
  );
};

export default Index;
