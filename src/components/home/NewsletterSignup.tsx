import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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

      toast.success('Welcome to the inner circle.');
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-xl mx-auto text-center"
        >
          <p className="font-utility text-[10px] tracking-[0.3em] text-foreground/40 mb-4">THE INNER CIRCLE</p>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tighter mb-4">
            First Access to<br />New Harvests
          </h2>
          <p className="font-display-italic text-sm text-muted-foreground mb-10 leading-relaxed">
            Be the first to know when rare ingredients arrive. No noise — only what matters.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-0 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              maxLength={255}
              className="flex-1 px-5 py-4 bg-transparent border border-foreground/15 border-r-0 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/40 transition-colors"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 bg-foreground text-background hover:bg-foreground/90 text-sm font-utility tracking-[0.1em] h-auto rounded-none transition-colors"
            >
              {isSubmitting ? '...' : <><ArrowRight className="h-4 w-4" strokeWidth={1.5} /></>}
            </Button>
          </form>
          <p className="font-utility text-[8px] text-foreground/20 tracking-[0.15em] mt-6">
            NO SPAM. UNSUBSCRIBE ANYTIME.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
