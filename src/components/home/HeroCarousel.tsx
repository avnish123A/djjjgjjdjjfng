import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import heroGifting from '@/assets/hero-gifting.jpg';
import heroCurated from '@/assets/hero-curated.jpg';
import heroOccasion from '@/assets/hero-occasion.jpg';

const slides = [
  {
    image: heroGifting,
    label: 'THE ART OF GIFTING',
    headline: 'Give Something\nUnforgettable',
    subtitle: 'Thoughtfully curated gifts for every moment that matters.',
    cta: 'Explore Gifts',
    link: '/products',
  },
  {
    image: heroCurated,
    label: 'CURATED COLLECTION',
    headline: 'Luxury,\nRedefined',
    subtitle: 'Handpicked lifestyle pieces crafted for the discerning.',
    cta: 'Shop Collection',
    link: '/products',
  },
  {
    image: heroOccasion,
    label: 'CELEBRATE',
    headline: 'For Every\nOccasion',
    subtitle: 'From intimate moments to grand celebrations.',
    cta: 'Shop Occasions',
    link: '/products',
  },
];

export const HeroCarousel = () => {
  return (
    <section className="relative">
      <Carousel
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 6000, stopOnInteraction: false })]}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.headline}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/50 via-foreground/20 to-transparent" />
                <div className="relative h-full flex items-center">
                  <div className="container mx-auto px-4">
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="max-w-xl"
                    >
                      <span className="inline-block text-[11px] sm:text-xs font-medium uppercase tracking-[5px] text-white/60 mb-5">
                        {slide.label}
                      </span>
                      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-[1.1] whitespace-pre-line">
                        {slide.headline}
                      </h1>
                      <p className="text-base sm:text-lg text-white/70 mb-10 max-w-md leading-relaxed">
                        {slide.subtitle}
                      </p>
                      <Link
                        to={slide.link}
                        className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-10 py-4 rounded-none text-sm font-semibold uppercase tracking-[2px] hover:bg-accent/90 transition-all"
                      >
                        {slide.cta}
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 lg:left-8 h-10 w-10 bg-white/10 border-0 text-white backdrop-blur-sm hover:bg-white/20 rounded-none" />
        <CarouselNext className="right-4 lg:right-8 h-10 w-10 bg-white/10 border-0 text-white backdrop-blur-sm hover:bg-white/20 rounded-none" />
      </Carousel>
    </section>
  );
};
