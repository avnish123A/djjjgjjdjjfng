import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { PromoBanners } from '@/components/home/PromoBanners';
import { FlashDeals } from '@/components/home/FlashDeals';
import { BestSellers } from '@/components/home/BestSellers';
import { TrustSection } from '@/components/home/TrustSection';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';
import { Testimonials } from '@/components/home/Testimonials';
import { FAQSection } from '@/components/home/FAQSection';
import { BankOffersStrip } from '@/components/home/BankOffersStrip';

const Index = () => {
  return (
    <main>
      <HeroCarousel />
      <BankOffersStrip />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanners />
      <FlashDeals />
      <BestSellers />
      <TrustSection />
      <FAQSection />
      <Testimonials />
      <NewsletterSignup />
    </main>
  );
};

export default Index;
