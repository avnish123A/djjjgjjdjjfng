import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Send, Sparkles } from 'lucide-react';
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

      toast.success('Subscribed! Stay tuned for tech deals.');
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden"
        >
          {/* Dark gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-accent/15 rounded-full blur-[80px]" />
          
          <div className="relative p-8 lg:p-12 text-center">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Stay Updated
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-white mb-3 tracking-tight">Stay Ahead in Tech</h2>
            <p className="text-white/40 mb-8 text-sm max-w-md mx-auto">
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
                className="flex-1 px-5 py-3.5 bg-white/10 border border-white/10 border-r-0 rounded-l-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all backdrop-blur-sm"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 rounded-l-none rounded-r-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow text-sm font-semibold h-auto transition-all duration-300"
              >
                {isSubmitting ? '…' : <><Send className="h-4 w-4 mr-1.5" /> Subscribe</>}
              </Button>
            </form>
            <p className="text-[10px] text-white/20 mt-5">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
