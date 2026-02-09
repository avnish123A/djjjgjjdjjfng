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
    headline: 'New Season Arrivals',
    subtitle: 'Discover the latest in contemporary fashion',
    cta: 'Shop Fashion',
    link: '/products?category=fashion',
  },
  {
    image: heroElectronics,
    headline: 'Tech That Inspires',
    subtitle: 'Premium electronics for the modern lifestyle',
    cta: 'Shop Electronics',
    link: '/products?category=electronics',
  },
  {
    image: heroLifestyle,
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
              <div className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.headline}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
                <div className="relative h-full flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-lg">
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-background mb-4 leading-tight">
                        {slide.headline}
                      </h1>
                      <p className="text-lg sm:text-xl text-background/80 mb-8">
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
        <CarouselPrevious className="left-4 lg:left-8 h-10 w-10 bg-background/20 border-0 text-background backdrop-blur-sm hover:bg-background/40" />
        <CarouselNext className="right-4 lg:right-8 h-10 w-10 bg-background/20 border-0 text-background backdrop-blur-sm hover:bg-background/40" />
      </Carousel>
    </section>
  );
};