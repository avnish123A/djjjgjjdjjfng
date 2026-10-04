import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { motion, AnimatePresence } from 'framer-motion';

const fallbackSlide = {
  id: 'fallback',
  title: 'Shop Smart. Discover More.',
  subtitle: 'Smarter Shopping',
  description: 'Discover products, experiences and everyday finds curated for people who want more value from every purchase.',
  image_url: '/hero/cartzebra-hero-1.jpg',
  cta_primary_text: 'Shop Now',
  cta_primary_link: '/products',
  cta_secondary_text: 'Explore Deals',
  cta_secondary_link: '/products',
};

const ease = [0.22, 1, 0.36, 1] as const;

export const HeroCarousel = () => {
  const { data = [] } = useHeroSlides(true);
  const slides = data.length ? data : [fallbackSlide];
  const [current, setCurrent] = useState(0);
  const count = slides.length;

  const next = useCallback(() => count > 1 && setCurrent((i) => (i + 1) % count), [count]);
  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next, count]);

  const slide = slides[Math.min(current, count - 1)];
  const words = (slide.title || '').split(/(?<=\.)\s+/);

  return (
    <section className="relative w-full overflow-hidden bg-primary">
      <div className="relative min-h-[78vh] lg:min-h-[88vh] flex items-center">
        <AnimatePresence mode="wait">
          <motion.img
            key={slide.id}
            src={slide.image_url || fallbackSlide.image_url}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover object-[70%_center]"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease }}
            loading="eager"
            width={1920}
            height={1080}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/55 to-transparent" />
        <div className="absolute inset-0 zebra-stripes opacity-40 pointer-events-none" />

        <div className="relative w-full container mx-auto px-4 py-24">
          <AnimatePresence mode="wait">
            <motion.div key={slide.id + '-c'} className="max-w-xl" exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
              {slide.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="inline-flex items-center gap-2 font-utility text-accent mb-6"
                >
                  <span className="h-px w-8 bg-accent" />
                  {slide.subtitle}
                </motion.p>
              )}
              <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl text-primary-foreground leading-[1.0] mb-6">
                {words.map((w, i) => (
                  <motion.span
                    key={i}
                    className="block"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease }}
                  >
                    {w}
                  </motion.span>
                ))}
              </h2>
              {slide.description && (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.45, ease }}
                  className="text-base sm:text-lg text-primary-foreground/75 mb-10 max-w-md leading-relaxed"
                >
                  {slide.description}
                </motion.p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease }}
                className="flex flex-wrap gap-3"
              >
                {slide.cta_primary_text && (
                  <Link
                    to={slide.cta_primary_link || '/products'}
                    className="group inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-7 py-3.5 text-sm font-bold hover:brightness-110 active:scale-[0.97] transition"
                  >
                    {slide.cta_primary_text}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                {slide.cta_secondary_text && (
                  <Link
                    to={slide.cta_secondary_link || '/products'}
                    className="inline-flex items-center rounded-full border border-primary-foreground/30 text-primary-foreground px-7 py-3.5 text-sm font-semibold hover:bg-primary-foreground hover:text-primary active:scale-[0.97] transition"
                  >
                    {slide.cta_secondary_text}
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {count > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                className={`h-1 rounded-full transition-all duration-500 ${i === current ? 'w-10 bg-accent' : 'w-4 bg-primary-foreground/30'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
