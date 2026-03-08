import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { motion, AnimatePresence } from 'framer-motion';

const heroFallbackUrl = 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1920&q=80';

export const HeroCarousel = () => {
  const { data: slides = [] } = useHeroSlides(true);
  const [current, setCurrent] = useState(0);

  const count = slides.length;

  const next = useCallback(() => {
    if (count > 1) setCurrent(i => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (count > 1) setCurrent(i => (i - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, count]);

  if (count === 0) {
    return (
      <section className="relative w-full overflow-hidden">
        <div className="aspect-[16/6] sm:aspect-[16/5] lg:aspect-[16/5] relative">
          <img src={heroFallbackUrl} alt="Premium tech gadgets" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-lg">
                <span className="inline-block text-[10px] sm:text-xs font-medium uppercase tracking-[4px] text-white/50 mb-3">
                  New Arrivals 2026
                </span>
                <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl text-white mb-3 leading-tight">
                  Next-Gen Tech <span className="text-primary">Awaits</span>
                </h1>
                <p className="text-sm text-white/60 mb-6 max-w-md">
                  Discover the latest smartphones, laptops, and tablets at unbeatable prices.
                </p>
                <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden">
      <div className="aspect-[16/6] sm:aspect-[16/5] lg:aspect-[16/5] relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={slide.id}
            src={slide.image_url || heroFallbackUrl}
            alt={slide.title || 'Hero banner'}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            loading="eager"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />

        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + '-content'}
                className="max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {slide.subtitle && (
                  <span className="inline-block text-[10px] sm:text-xs font-medium uppercase tracking-[4px] text-white/50 mb-3">
                    {slide.subtitle}
                  </span>
                )}
                <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl text-white mb-3 leading-tight">
                  {slide.title}
                </h1>
                {slide.description && (
                  <p className="text-sm text-white/60 mb-6 max-w-md">
                    {slide.description}
                  </p>
                )}
                <div className="flex gap-3">
                  {slide.cta_primary_text && (
                    <Link
                      to={slide.cta_primary_link || '/products'}
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all"
                    >
                      {slide.cta_primary_text} <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  {slide.cta_secondary_text && (
                    <Link
                      to={slide.cta_secondary_link || '/products'}
                      className="inline-flex items-center gap-2 bg-white/15 text-white backdrop-blur-sm px-6 py-3 rounded-lg text-sm font-semibold hover:bg-white/25 transition-all border border-white/20"
                    >
                      {slide.cta_secondary_text}
                    </Link>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {count > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-card transition-colors" aria-label="Previous">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-card transition-colors" aria-label="Next">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {count > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-primary' : 'w-2 bg-white/50 hover:bg-white/70'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
