import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const NewsletterSignup = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Welcome to the EkamGift community!');
  };

  return (
    <section className="py-20 lg:py-28 bg-primary relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-[11px] font-medium uppercase tracking-[4px] text-primary-foreground/60 mb-4 block">Newsletter</span>
          <h2 className="font-display text-3xl sm:text-4xl mb-4 text-primary-foreground tracking-tight">Stay in the Know</h2>
          <p className="text-primary-foreground/50 mb-10 text-sm leading-relaxed">
            Be the first to discover new collections, exclusive offers, and curated gift guides.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-0 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              required
              className="flex-1 px-5 py-3.5 bg-primary-foreground/10 border border-primary-foreground/15 border-r-0 rounded-l-lg text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:bg-primary-foreground/15 transition-all"
            />
            <Button type="submit" className="px-8 rounded-l-none rounded-r-lg bg-foreground text-background hover:bg-foreground/90 uppercase tracking-[2px] text-xs font-semibold">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-primary-foreground/30 mt-6">
            No spam, ever. Unsubscribe anytime. Read our{' '}
            <a href="/policies/privacy" className="underline hover:text-primary-foreground/50 transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </section>
  );
};
