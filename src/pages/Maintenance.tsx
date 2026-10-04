import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Mail, RefreshCw, Instagram, Facebook, Youtube, Twitter, Loader2 } from 'lucide-react';
import { useSiteMode } from '@/contexts/SiteModeContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { supabase } from '@/integrations/supabase/client';
import { LogoMark } from '@/components/brand/Logo';
import { toast } from 'sonner';

const ease = [0.22, 1, 0.36, 1] as const;

const Backdrop: React.FC<{ drift?: boolean }> = ({ drift }) => {
  const reduce = useReducedMotion();
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.14),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <motion.div
        className="absolute -inset-[20%] opacity-[0.06]"
        style={{ backgroundImage: 'repeating-linear-gradient(115deg, hsl(var(--primary-foreground)) 0 38px, transparent 38px 110px)' }}
        animate={drift && !reduce ? { x: ['0%', '-6%', '0%'] } : undefined}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-1/3 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
        animate={reduce ? undefined : { y: [0, -30, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary" />
    </div>
  );
};

const Socials: React.FC<{ s: Record<string, string> }> = ({ s }) => {
  const items = [
    { k: 'social_instagram', I: Instagram, l: 'Instagram' },
    { k: 'social_facebook', I: Facebook, l: 'Facebook' },
    { k: 'social_youtube', I: Youtube, l: 'YouTube' },
    { k: 'social_twitter', I: Twitter, l: 'X' },
  ].filter((i) => s[i.k]?.trim());
  const email = s.contact_email || 'hello@cartzebra.com';
  return (
    <footer className="relative z-10 pb-8 pt-12 text-center space-y-4">
      {items.length > 0 && (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground/40">Follow CartZebra</p>
          <div className="flex justify-center gap-3">
            {items.map(({ k, I, l }) => (
              <a key={k} href={s[k]} target="_blank" rel="noopener noreferrer" aria-label={l}
                className="h-10 w-10 rounded-full border border-primary-foreground/15 flex items-center justify-center text-primary-foreground/70 hover:text-accent hover:border-accent transition-colors">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </>
      )}
      <a href={`mailto:${email}`} className="inline-block text-sm text-primary-foreground/50 hover:text-accent transition-colors">{email}</a>
    </footer>
  );
};

const Maintenance: React.FC = () => {
  const { siteMode } = useSiteMode();
  const { data: settings = {} } = useSiteSettings();
  const isComingSoon = siteMode === 'coming_soon';

  useEffect(() => {
    document.title = isComingSoon ? 'Coming Soon — CartZebra' : 'Under Maintenance — CartZebra';
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      isComingSoon ? 'CartZebra is almost here. Shop smart. Discover more.' : 'CartZebra is temporarily unavailable for scheduled improvements.'
    );
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, nofollow');
    return () => robots?.remove();
  }, [isComingSoon]);

  return (
    <div className="min-h-screen bg-primary text-primary-foreground relative overflow-hidden flex flex-col">
      <Backdrop drift={isComingSoon} />
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        {isComingSoon ? <ComingSoon s={settings} /> : <MaintenanceView s={settings} />}
      </main>
      <Socials s={settings} />
    </div>
  );
};

/* ---------------- Coming Soon ---------------- */

const ComingSoon: React.FC<{ s: Record<string, string> }> = ({ s }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const message = s.coming_soon_message || "A smarter shopping experience is on the way. Be among the first to discover what's next.";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;
    setStatus('loading');
    try {
      const { data, error } = await supabase.functions.invoke('submit-query', {
        body: { customer_name: '', email: email.trim(), message: 'Launch notification request', source_form: 'coming_soon' },
      });
      if (error || data?.error) throw new Error(data?.error || 'failed');
      setStatus('done');
    } catch {
      setStatus('idle');
      toast.error('Could not save your email. Please try again.');
    }
  };

  const headline = ['CARTZEBRA', 'IS ALMOST HERE.'];

  return (
    <div className="max-w-2xl w-full text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease }} className="flex justify-center mb-8">
        <LogoMark variant="light" className="h-14 w-14" />
      </motion.div>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
        className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent mb-5">
        The next shopping experience is near
      </motion.p>
      <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.98] mb-6">
        {headline.map((w, i) => (
          <motion.span key={w} className="block" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15, duration: 0.8, ease }}>
            {w}
          </motion.span>
        ))}
      </h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}
        className="text-primary-foreground/60 max-w-md mx-auto mb-10 leading-relaxed">
        {message}
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6, ease }} className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {status === 'done' ? (
            <motion.p key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="status"
              className="rounded-full border border-accent/40 bg-accent/10 px-6 py-4 text-sm font-semibold text-accent">
              You're on the list.
            </motion.p>
          ) : (
            <motion.form key="form" onSubmit={submit} exit={{ opacity: 0 }} className="flex rounded-full border border-primary-foreground/15 bg-primary-foreground/5 p-1.5 focus-within:border-accent/60 transition-colors">
              <Mail className="ml-3 h-4 w-4 self-center shrink-0 text-primary-foreground/40" />
              <label htmlFor="cs-email" className="sr-only">Email address</label>
              <input id="cs-email" type="email" required maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" className="flex-1 min-w-0 bg-transparent px-3 text-sm placeholder:text-primary-foreground/30 focus:outline-none" />
              <button type="submit" disabled={status === 'loading'}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent text-accent-foreground px-4 sm:px-5 py-2.5 text-sm font-bold hover:brightness-110 disabled:opacity-70 transition">
                {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <>NOTIFY ME <ArrowRight className="h-4 w-4" /></>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }}
        className="mt-8 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/50">
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" /> Launching soon
      </motion.p>
    </div>
  );
};

/* ---------------- Maintenance ---------------- */

const steps = ['Updating', 'Optimizing', 'Almost ready'];

const MaintenanceView: React.FC<{ s: Record<string, string> }> = ({ s }) => {
  const reduce = useReducedMotion();
  const [checking, setChecking] = useState(false);
  const [step, setStep] = useState(0);
  const title = s.maintenance_title && !/getting better/i.test(s.maintenance_title) ? s.maintenance_title : "We're making things better.";
  const message = s.maintenance_message && !/scheduled maintenance to enhance/i.test(s.maintenance_message)
    ? s.maintenance_message
    : 'CartZebra is temporarily unavailable while we complete scheduled improvements.';
  const returnTime = s.maintenance_return_time?.trim();
  const email = s.contact_email || 'hello@cartzebra.com';

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setStep((i) => (i + 1) % steps.length), 2600);
    return () => clearInterval(t);
  }, [reduce]);

  const retry = async () => {
    setChecking(true);
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'site_mode').maybeSingle();
    if (data?.value === 'live') {
      window.location.assign('/');
      return;
    }
    setChecking(false);
    toast("We're still working on it. Please check back shortly.");
  };

  return (
    <div className="max-w-xl w-full text-center">
      <div className="relative flex justify-center mb-10">
        <motion.div animate={reduce ? undefined : { y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
          <LogoMark variant="light" className="h-16 w-16" />
        </motion.div>
        <motion.div className="absolute -bottom-5 h-2 w-14 rounded-full bg-primary-foreground/20 blur-md"
          animate={reduce ? undefined : { scale: [1, 0.7, 1], opacity: [0.5, 0.25, 0.5] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-warning mb-6">
        <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" /> Maintenance in progress
      </motion.p>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="font-display text-3xl sm:text-5xl leading-tight mb-5">
        {title}
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-primary-foreground/60 leading-relaxed max-w-md mx-auto mb-4">
        {message}
      </motion.p>
      {returnTime && <p className="text-sm font-semibold text-accent mb-4">Back online around {returnTime}</p>}

      <div className="flex items-center justify-center gap-6 my-10" aria-hidden="true">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full transition-colors duration-500 ${i <= step ? 'bg-accent' : 'bg-primary-foreground/20'}`} />
            <span className={`text-xs transition-colors duration-500 ${i === step ? 'text-primary-foreground' : 'text-primary-foreground/40'}`}>{label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-6 py-3 text-sm font-bold hover:brightness-110 transition">
          Contact support
        </a>
        <button onClick={retry} disabled={checking}
          className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-6 py-3 text-sm font-semibold hover:bg-primary-foreground hover:text-primary disabled:opacity-60 transition">
          <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} /> Try again
        </button>
      </div>
    </div>
  );
};

export default Maintenance;
