import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
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

  const renderFallback = () => (
    <section className="relative w-full overflow-hidden">
      <div className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-[540px]">
        <img src={heroFallbackUrl} alt="Premium tech gadgets" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-foreground/20" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] animate-float-gentle" />
        <div className="absolute bottom-10 right-40 w-48 h-48 bg-accent/15 rounded-full blur-[60px] animate-float-slow" />
        
        <div className="relative h-full flex items-center min-h-[420px] sm:min-h-[480px] lg:min-h-[540px]">
          <div className="container mx-auto px-4">
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[4px] text-primary mb-4">
                  <Zap className="h-3.5 w-3.5 fill-primary" />
                  New Arrivals 2026
                </span>
                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-white mb-4 leading-[1.05] tracking-tight">
                  Next-Gen Tech
                  <br />
                  <span className="gradient-text">Awaits You</span>
                </h1>
                <p className="text-sm sm:text-base text-white/50 mb-8 max-w-md leading-relaxed">
                  Discover the latest smartphones, laptops, and tablets at unbeatable prices with warranty included.
                </p>
                <div className="flex gap-3">
                  <Link to="/products" className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl text-sm font-semibold hover:shadow-glow transition-all duration-300">
                    Shop Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/products?category=smartphones" className="inline-flex items-center gap-2 glass text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all duration-300">
                    Explore Phones
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (count === 0) return renderFallback();

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-[540px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={slide.id}
            src={slide.image_url || heroFallbackUrl}
            alt={slide.title || 'Hero banner'}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6 }}
            loading="eager"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-transparent" />

        {/* Animated glow orbs */}
        <div className="absolute top-16 right-16 w-72 h-72 bg-primary/15 rounded-full blur-[100px] animate-float-gentle pointer-events-none" />
        <div className="absolute bottom-8 left-1/2 w-56 h-56 bg-accent/10 rounded-full blur-[80px] animate-float-slow pointer-events-none" />

        <div className="relative h-full flex items-center min-h-[420px] sm:min-h-[480px] lg:min-h-[540px]">
          <div className="container mx-auto px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + '-content'}
                className="max-w-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {slide.subtitle && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[4px] text-primary mb-4">
                    <Zap className="h-3.5 w-3.5 fill-primary" />
                    {slide.subtitle}
                  </span>
                )}
                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-white mb-4 leading-[1.05] tracking-tight">
                  {slide.title}
                </h1>
                {slide.description && (
                  <p className="text-sm sm:text-base text-white/50 mb-8 max-w-md leading-relaxed">
                    {slide.description}
                  </p>
                )}
                <div className="flex gap-3">
                  {slide.cta_primary_text && (
                    <Link
                      to={slide.cta_primary_link || '/products'}
                      className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl text-sm font-semibold hover:shadow-glow transition-all duration-300"
                    >
                      {slide.cta_primary_text} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                  {slide.cta_secondary_text && (
                    <Link
                      to={slide.cta_secondary_link || '/products'}
                      className="inline-flex items-center gap-2 glass text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all duration-300"
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
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 glass p-3 rounded-full hover:bg-white/20 transition-all" aria-label="Previous">
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 glass p-3 rounded-full hover:bg-white/20 transition-all" aria-label="Next">
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </>
        )}

        {count > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-400 ${i === current ? 'w-8 bg-primary glow-blue' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
