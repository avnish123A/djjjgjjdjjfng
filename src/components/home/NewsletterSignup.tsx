import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const NewsletterSignup = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thanks for subscribing!');
  };

  return (
    <section className="py-16 lg:py-20 bg-primary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-primary-foreground">Join Our Community</h2>
          <p className="text-primary-foreground/70 mb-8 text-sm">
            Get exclusive offers, new arrivals, and 10% off your first order.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
            />
            <Button type="submit" className="px-6 bg-accent text-accent-foreground hover:bg-accent/90">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-primary-foreground/40 mt-4">
            No spam, unsubscribe anytime. Read our{' '}
            <a href="/policies/privacy" className="underline hover:text-primary-foreground/60">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
