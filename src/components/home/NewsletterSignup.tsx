import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const NewsletterSignup = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thanks for subscribing!');
  };

  return (
    <section className="py-16 lg:py-24 bg-foreground relative overflow-hidden">
      {/* Geometric decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-background/10 opacity-50" />
      <div className="absolute bottom-8 right-16 w-48 h-48 rounded-full border border-background/5 opacity-50" />
      <div className="absolute top-1/2 left-1/4 w-20 h-20 rounded-full bg-accent/10 blur-2xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-background tracking-tight">Join Our Community</h2>
          <p className="text-background/50 mb-8 text-sm">
            Get exclusive offers, new arrivals, and 10% off your first order.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-3 bg-background/10 border border-background/15 rounded-full text-sm text-background placeholder:text-background/35 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
            />
            <Button type="submit" className="px-6 rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-background/30 mt-5">
            No spam, unsubscribe anytime. Read our{' '}
            <a href="/policies/privacy" className="underline hover:text-background/50">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
