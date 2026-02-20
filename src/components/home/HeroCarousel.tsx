import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import heroFallback from '@/assets/hero-premium-gift.jpg';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, count]);

  // Fallback if no slides exist
  if (count === 0) {
    return (
      <section className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden">
        <img src={heroFallback} alt="Premium gifts" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl text-white mb-6 leading-[1.05]">
                Gifts That Speak <span className="text-primary">Louder</span>
              </h1>
              <Link to="/products" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-xl text-sm font-semibold uppercase tracking-[2px] hover:bg-primary/90 transition-all">
                Explore Collection <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>
    );
  }

  const slide = slides[current];
  const titleWords = (slide.title || '').split(' ');
  const lastWord = titleWords.pop();
  const titleStart = titleWords.join(' ');

  return (
    <section className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={slide.id}
          src={slide.image_url || heroFallback}
          alt={slide.title || 'Hero banner'}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          loading="eager"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />

      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + '-content'}
              className="max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {slide.subtitle && (
                <span className="inline-block text-[11px] sm:text-xs font-medium uppercase tracking-[6px] text-white/50 mb-6">
                  {slide.subtitle}
                </span>
              )}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl text-white mb-6 leading-[1.05] tracking-tight">
                {titleStart}{' '}
                <span className="text-primary">{lastWord}</span>
              </h1>
              {slide.description && (
                <p className="text-base sm:text-lg text-white/60 mb-12 max-w-lg leading-relaxed">
                  {slide.description}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                {slide.cta_primary_text && (
                  <Link
                    to={slide.cta_primary_link || '/products'}
                    className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-xl text-sm font-semibold uppercase tracking-[2px] hover:bg-primary/90 transition-all active:scale-[0.98]"
                  >
                    {slide.cta_primary_text}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                {slide.cta_secondary_text && (
                  <Link
                    to={slide.cta_secondary_link || '/products'}
                    className="inline-flex items-center justify-center gap-3 bg-white/10 text-white backdrop-blur-sm px-10 py-4 rounded-xl text-sm font-semibold uppercase tracking-[2px] hover:bg-white/20 transition-all border border-white/10"
                  >
                    {slide.cta_secondary_text}
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows */}
      {count > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-2.5 rounded-full hover:bg-white/20 transition-colors" aria-label="Previous slide">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-2.5 rounded-full hover:bg-white/20 transition-colors" aria-label="Next slide">
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {count > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-primary' : 'w-2 bg-white/40 hover:bg-white/60'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
