import { useRef } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/products/ProductCard';
import { CountdownTimer } from '@/components/home/CountdownTimer';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

// Flash deal ends 3 days from now (rolling)
const getFlashEndDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  d.setHours(23, 59, 59, 0);
  return d;
};

const flashEnd = getFlashEndDate();

export const FlashDeals = () => {
  const { data: products = [] } = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Pick sale-badged products first, then highest-discount products
  const dealProducts = products
    .filter(p => p.originalPrice && p.originalPrice > p.price)
    .sort((a, b) => {
      const discA = ((a.originalPrice! - a.price) / a.originalPrice!) * 100;
      const discB = ((b.originalPrice! - b.price) / b.originalPrice!) * 100;
      return discB - discA;
    })
    .slice(0, 12);

  if (dealProducts.length === 0) return null;

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="py-10 lg:py-14 relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-destructive/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div className="flex flex-col gap-3">
            {/* Pulsing badge */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-xl bg-destructive/10 border border-destructive/20"
            >
              <Zap className="h-4 w-4 text-destructive fill-destructive animate-pulse" />
              <span className="text-xs font-bold text-destructive uppercase tracking-widest">
                Limited Time Only
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
              </span>
            </motion.div>

            <h2 className="font-display text-2xl sm:text-3xl tracking-tight">
              ⚡ Flash Deals
            </h2>
            <p className="text-sm text-muted-foreground">
              Grab these deals before time runs out
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown */}
            <div className="flex items-center gap-3 bg-foreground text-background px-5 py-3 rounded-2xl shadow-lg">
              <Timer className="h-4 w-4 text-destructive shrink-0" />
              <CountdownTimer targetDate={flashEnd} />
            </div>

            {/* Scroll controls */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2.5 rounded-xl border border-border/60 hover:bg-card hover:shadow-sm transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2.5 rounded-xl border border-border/60 hover:bg-card hover:shadow-sm transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Product carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        >
          {dealProducts.map((product, i) => {
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="flex-shrink-0 w-[210px] sm:w-[230px] lg:w-[250px] snap-start relative"
              >
                {/* Discount ribbon */}
                {discount > 0 && (
                  <div className="absolute -top-1 -right-1 z-20">
                    <motion.div
                      animate={{ rotate: [0, 3, -3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="bg-destructive text-destructive-foreground text-[11px] font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-2xl shadow-lg"
                    >
                      {discount}% OFF
                    </motion.div>
                  </div>
                )}
                <ProductCard product={product} />
              </motion.div>
            );
          })}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-6"
        >
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
          >
            View All Deals <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
