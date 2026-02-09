import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { PromoBanners } from '@/components/home/PromoBanners';
import { BestSellers } from '@/components/home/BestSellers';
import { TrustSection } from '@/components/home/TrustSection';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';

const Index = () => {
  return (
    <main>
      <HeroCarousel />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanners />
      <BestSellers />
      <TrustSection />
      <NewsletterSignup />
    </main>
  );
};

export default Index;