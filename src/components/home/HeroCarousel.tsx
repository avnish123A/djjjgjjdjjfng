import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import heroFashion from '@/assets/hero-fashion.jpg';
import heroElectronics from '@/assets/hero-electronics.jpg';
import heroLifestyle from '@/assets/hero-lifestyle.jpg';

const slides = [
  {
    image: heroFashion,
    label: 'NEW COLLECTION',
    headline: 'New Season Arrivals',
    subtitle: 'Discover the latest in contemporary fashion',
    cta: 'Shop Fashion',
    link: '/products?category=fashion',
  },
  {
    image: heroElectronics,
    label: 'TRENDING',
    headline: 'Tech That Inspires',
    subtitle: 'Premium electronics for the modern lifestyle',
    cta: 'Shop Electronics',
    link: '/products?category=electronics',
  },
  {
    image: heroLifestyle,
    label: 'CURATED',
    headline: 'Elevate Your Space',
    subtitle: 'Curated home essentials for mindful living',
    cta: 'Shop Home',
    link: '/products?category=home-living',
  },
];

export const HeroCarousel = () => {
  return (
    <section className="relative">
      <Carousel
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.headline}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/65 via-foreground/35 to-transparent" />
                <div className="relative h-full flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-lg">
                      <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[3px] text-card/80 mb-3">
                        {slide.label}
                      </span>
                      <h1 className="text-display-sm sm:text-display text-card mb-4 leading-tight">
                        {slide.headline}
                      </h1>
                      <p className="text-base sm:text-lg text-card/80 mb-8 max-w-md">
                        {slide.subtitle}
                      </p>
                      <Button variant="hero" asChild>
                        <Link to={slide.link}>{slide.cta}</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 lg:left-8 h-10 w-10 bg-card/20 border-0 text-card backdrop-blur-sm hover:bg-card/40" />
        <CarouselNext className="right-4 lg:right-8 h-10 w-10 bg-card/20 border-0 text-card backdrop-blur-sm hover:bg-card/40" />
      </Carousel>
    </section>
  );
};
