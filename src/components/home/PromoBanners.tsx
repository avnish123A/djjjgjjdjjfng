import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

const saleEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

export const PromoBanners = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* Sale Banner */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative overflow-hidden bg-primary rounded-2xl p-8 lg:p-10 h-full min-h-[280px] flex flex-col justify-between">
              <div>
                <span className="inline-block px-4 py-1.5 bg-primary-foreground/15 text-primary-foreground text-[10px] font-semibold uppercase tracking-[3px] rounded-full mb-6">
                  Limited Time
                </span>
                <h3 className="font-display text-3xl lg:text-4xl text-primary-foreground mb-3">
                  Festive Sale
                </h3>
                <p className="text-primary-foreground/60 mb-6 text-sm">
                  Up to 50% off on curated gift sets
                </p>
                <CountdownTimer targetDate={saleEndDate} />
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-primary-foreground font-medium text-sm mt-6 hover:gap-3 transition-all uppercase tracking-wider"
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
            <div className="relative overflow-hidden bg-card border border-border rounded-2xl p-8 lg:p-10 h-full min-h-[280px] flex flex-col justify-between">
              <div>
                <span className="inline-block px-4 py-1.5 bg-foreground text-background text-[10px] font-semibold uppercase tracking-[3px] rounded-full mb-6">
                  This Weekend
                </span>
                <h3 className="font-display text-3xl lg:text-4xl text-foreground mb-3">
                  Free Delivery
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  On all orders above ₹499. No code needed.
                </p>
                <p className="text-muted-foreground/50 text-xs">
                  Standard delivery 3-5 business days
                </p>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-foreground font-medium text-sm mt-6 hover:gap-3 transition-all uppercase tracking-wider"
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
