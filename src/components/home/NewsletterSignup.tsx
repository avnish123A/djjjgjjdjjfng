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

      toast.success('Subscribed! Stay tuned for tech deals.');
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-10 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-xl sm:text-2xl mb-2 tracking-tight">Stay Ahead in Tech</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Get exclusive deals, new launches, and tech guides delivered to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-0 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              maxLength={255}
              className="flex-1 px-4 py-3 bg-secondary border border-border border-r-0 rounded-l-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 rounded-l-none rounded-r-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold h-auto"
            >
              {isSubmitting ? '…' : 'Subscribe'}
            </Button>
          </form>
          <p className="text-[10px] text-muted-foreground/50 mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};
