import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const NewsletterSignup = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Welcome to the AUREA community.');
  };

  return (
    <section className="py-20 lg:py-28 bg-foreground relative overflow-hidden">
      {/* Subtle gold line accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-accent/20" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-accent/20" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto text-center"
        >
          <span className="text-[11px] font-medium uppercase tracking-[4px] text-accent mb-4 block">Newsletter</span>
          <h2 className="font-display text-3xl sm:text-4xl mb-4 text-background tracking-tight">Stay in the Know</h2>
          <p className="text-background/45 mb-10 text-sm leading-relaxed">
            Be the first to discover new collections, exclusive offers, and curated gift guides.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-0 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              required
              className="flex-1 px-5 py-3.5 bg-background/8 border border-background/15 border-r-0 text-sm text-background placeholder:text-background/30 focus:outline-none focus:bg-background/12 transition-all"
            />
            <Button type="submit" className="px-8 rounded-none bg-accent text-accent-foreground hover:bg-accent/90 uppercase tracking-[2px] text-xs font-semibold">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-background/25 mt-6">
            No spam, ever. Unsubscribe anytime. Read our{' '}
            <a href="/policies/privacy" className="underline hover:text-background/40 transition-colors">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
