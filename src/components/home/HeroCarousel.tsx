import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { motion, AnimatePresence } from 'framer-motion';

const heroFallbackUrl = 'https://images.unsplash.com/photo-1474979266404-7eaabdf50494?w=1920&q=80';

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
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, count]);

  const renderSlide = (slide: { id?: string; title: string; subtitle?: string | null; description?: string | null; image_url?: string | null; cta_primary_text?: string | null; cta_primary_link?: string | null; cta_secondary_text?: string | null; cta_secondary_link?: string | null }) => (
    <div className="relative min-h-[85vh] sm:min-h-[90vh] flex items-end">
      <AnimatePresence mode="wait">
        <motion.img
          key={slide.id || 'fallback'}
          src={slide.image_url || heroFallbackUrl}
          alt={slide.title || 'Hero'}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          loading="eager"
        />
      </AnimatePresence>

      {/* Dark overlay — bottom heavy for text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content — bottom aligned, editorial */}
      <div className="relative w-full pb-16 sm:pb-20 lg:pb-28">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={(slide.id || 'fallback') + '-content'}
              className="max-w-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {slide.subtitle && (
                <p className="font-utility text-[10px] tracking-[0.3em] text-white/50 mb-4">
                  {slide.subtitle.toUpperCase()}
                </p>
              )}
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-white leading-[1.02] tracking-tighter mb-5">
                {slide.title}
              </h2>
              {slide.description && (
                <p className="font-display-italic text-base sm:text-lg text-white/50 mb-8 max-w-lg leading-relaxed">
                  {slide.description}
                </p>
              )}
              <div className="flex gap-4">
                {slide.cta_primary_text && (
                  <Link
                    to={slide.cta_primary_link || '/products'}
                    className="group inline-flex items-center gap-3 font-utility text-[11px] tracking-[0.2em] text-white border-b border-white/30 pb-1 hover:border-white transition-colors duration-500"
                  >
                    {slide.cta_primary_text.toUpperCase()}
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-500" strokeWidth={1.5} />
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Minimal nav arrows */}
      {count > 1 && (
        <>
          <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/30 hover:text-white transition-colors" aria-label="Previous">
            <ChevronLeft className="h-6 w-6" strokeWidth={1} />
          </button>
          <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/30 hover:text-white transition-colors" aria-label="Next">
            <ChevronRight className="h-6 w-6" strokeWidth={1} />
          </button>
        </>
      )}

      {/* Slide indicators */}
      {count > 1 && (
        <div className="absolute bottom-8 right-8 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className={`h-[2px] transition-all duration-700 ${i === current ? 'w-10 bg-white' : 'w-4 bg-white/25'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (count === 0) {
    return (
      <section className="relative w-full overflow-hidden">
        {renderSlide({
          title: 'The Art of Provenance',
          subtitle: 'CURATED PANTRY — EST. 2024',
          description: 'Every ingredient tells a story of terroir, craft, and obsession.',
          image_url: heroFallbackUrl,
          cta_primary_text: 'Explore the Collection',
          cta_primary_link: '/products',
        })}
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden">
      {renderSlide(slides[current])}
    </section>
  );
};
