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
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-primary p-8 lg:p-10 h-full min-h-[280px] flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full mb-4">
                  Limited Time
                </span>
                <h3 className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-2">
                  Summer Sale
                </h3>
                <p className="text-primary-foreground/70 mb-6">
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

          {/* Free Shipping Banner */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-accent p-8 lg:p-10 h-full min-h-[280px] flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-background text-foreground text-xs font-semibold rounded-full mb-4">
                  This Weekend
                </span>
                <h3 className="text-2xl lg:text-3xl font-bold text-accent-foreground mb-2">
                  Free Shipping
                </h3>
                <p className="text-accent-foreground/80 mb-4">
                  On all orders over $50. No code needed.
                </p>
                <p className="text-accent-foreground/60 text-sm">
                  Standard delivery 3-5 business days
                </p>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-accent-foreground font-semibold text-sm mt-6 hover:gap-3 transition-all"
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