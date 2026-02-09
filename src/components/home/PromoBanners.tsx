import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

const saleEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

export const PromoBanners = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* Sale Banner */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-foreground p-8 lg:p-10 h-full min-h-[280px] flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-[11px] font-bold rounded-full uppercase tracking-wider mb-5">
                  Limited Time
                </span>
                <h3 className="text-2xl lg:text-3xl font-bold text-background mb-2 tracking-tight">
                  Mega Sale
                </h3>
                <p className="text-background/55 mb-6 text-sm">
                  Up to 50% off on selected items
                </p>
                <CountdownTimer targetDate={saleEndDate} />
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-accent font-semibold text-sm mt-6 hover:gap-3 transition-all"
              >
                Shop Sale <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Free Delivery Banner */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-secondary p-8 lg:p-10 h-full min-h-[280px] flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-foreground text-background text-[11px] font-bold rounded-full uppercase tracking-wider mb-5">
                  This Weekend
                </span>
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2 tracking-tight">
                  Free Delivery
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  On all orders above ₹499. No code needed.
                </p>
                <p className="text-muted-foreground/60 text-xs">
                  Standard delivery 3-5 business days
                </p>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-foreground font-semibold text-sm mt-6 hover:gap-3 transition-all"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
