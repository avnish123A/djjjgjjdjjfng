import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight } from 'lucide-react';

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !email.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('submit-query', {
        body: {
          customer_name: '',
          email,
          message: 'Newsletter subscription',
          source_form: 'newsletter',
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success('Welcome to the EkamWear family!');
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-[11px] font-medium uppercase tracking-[5px] text-primary mb-4 block">Newsletter</span>
          <h2 className="font-display text-3xl sm:text-4xl mb-4 tracking-tight">Stay in Style</h2>
          <p className="text-muted-foreground mb-10 text-sm leading-relaxed max-w-md mx-auto">
            Be the first to know about new collections, exclusive drops, and seasonal fashion guides.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-0 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              maxLength={255}
              className="flex-1 px-5 py-4 bg-secondary border border-border border-r-0 rounded-l-xl text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 rounded-l-none rounded-r-xl bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[2px] text-xs font-semibold h-auto"
            >
              {isSubmitting ? '…' : <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground/50 mt-6">
            No spam, ever. Unsubscribe anytime.{' '}
            <a href="/policies/privacy" className="underline hover:text-muted-foreground transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </section>
  );
};
