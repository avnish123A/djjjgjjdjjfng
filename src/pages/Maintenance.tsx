import { useState } from 'react';
import { Gift, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSiteMode } from '@/contexts/SiteModeContext';

const Maintenance = () => {
  const { siteMode } = useSiteMode();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isComingSoon = siteMode === 'coming_soon';
  const title = isComingSoon ? 'Something Special is Coming' : "We're Polishing Things Up";
  const subtitle = isComingSoon
    ? 'Our curated gifting experience is almost ready. Be the first to know when we launch.'
    : "We're making improvements to give you a better experience. We'll be back shortly.";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/8 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/3 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        {/* Animated gift icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center animate-float-gentle">
              <Gift className="w-12 h-12 text-primary" />
            </div>
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-3xl border-2 border-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
        </div>

        {/* Brand */}
        <div>
          <h2 className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">EkamGift</h2>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">{title}</h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto">{subtitle}</p>
        </div>

        {/* Email notify */}
        {isComingSoon && !submitted && (
          <form
            onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSubmitted(true); }}
            className="flex gap-2 max-w-sm mx-auto"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="pl-10"
                required
              />
            </div>
            <Button type="submit" className="gap-1 rounded-full px-5 bg-primary text-primary-foreground hover:bg-primary/90">
              Notify Me <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        )}

        {submitted && (
          <div className="bg-primary/10 text-primary text-sm font-medium px-4 py-3 rounded-xl animate-fade-in">
            🎉 You're on the list! We'll notify you when we launch.
          </div>
        )}

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          {isComingSoon ? 'Launching soon' : 'Back shortly'}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
