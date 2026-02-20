import { useState, useEffect } from 'react';
import { Mail, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSiteMode } from '@/contexts/SiteModeContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Maintenance = () => {
  const { siteMode } = useSiteMode();
  const { data: settings = {} } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isComingSoon = siteMode === 'coming_soon';

  // Admin-editable content
  const title = isComingSoon
    ? (settings['coming_soon_title'] || 'Something Special is Coming')
    : (settings['maintenance_title'] || "We're Polishing Things Up");
  const subtitle = isComingSoon
    ? (settings['coming_soon_message'] || 'Our curated gifting experience is almost ready. Be the first to know when we launch.')
    : (settings['maintenance_message'] || "We're making improvements to give you a better experience. We'll be back shortly.");

  // Countdown
  const countdownDate = settings['coming_soon_date'] || '';

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-lg w-full text-center">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-12 space-y-8 shadow-[0_8px_60px_-12px_rgba(0,0,0,0.5)]">

          {/* 3D Illustration - Animated gift box */}
          <div className="flex justify-center">
            <div className="relative" style={{ perspective: '400px' }}>
              <div
                className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.4)]"
                style={{
                  animation: 'float3d 4s ease-in-out infinite',
                  transformStyle: 'preserve-3d',
                }}
              >
                {isComingSoon ? (
                  <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 12v10H4V12" />
                    <path d="M2 7h20v5H2z" />
                    <path d="M12 22V7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                ) : (
                  <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                )}
              </div>
              {/* Shadow beneath */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-3 bg-primary/20 rounded-full blur-md" style={{ animation: 'shadow-pulse 4s ease-in-out infinite' }} />
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center">
            <img src="/logo-ekamgift.png" alt="EkamGift" className="h-10 w-auto object-contain brightness-0 invert opacity-80" />
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{title}</h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mx-auto">{subtitle}</p>
          </div>

          {/* Countdown Timer */}
          {isComingSoon && countdownDate && <CountdownDisplay targetDate={countdownDate} />}

          {/* Email notify */}
          {isComingSoon && !submitted && (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSubmitted(true); }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-10 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-primary/50"
                  required
                />
              </div>
              <Button type="submit" className="gap-1 rounded-xl px-5">
                Notify Me <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {submitted && (
            <div className="bg-primary/10 text-primary text-sm font-medium px-4 py-3 rounded-xl">
              🎉 You're on the list! We'll notify you when we launch.
            </div>
          )}

          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-white/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            {isComingSoon ? 'Launching soon' : 'Back shortly'}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float3d {
          0%, 100% { transform: translateY(0) rotateX(0deg) rotateY(0deg); }
          25% { transform: translateY(-12px) rotateX(5deg) rotateY(-5deg); }
          50% { transform: translateY(-20px) rotateX(-3deg) rotateY(5deg); }
          75% { transform: translateY(-8px) rotateX(3deg) rotateY(-3deg); }
        }
        @keyframes shadow-pulse {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.3; }
          50% { transform: translateX(-50%) scale(0.6); opacity: 0.15; }
        }
      `}</style>
    </div>
  );
};

/* ── Countdown Display ── */
const CountdownDisplay = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const blocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {blocks.map((b) => (
        <div key={b.label} className="text-center">
          <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-xl font-bold text-white tabular-nums">{String(b.value).padStart(2, '0')}</span>
          </div>
          <span className="text-[10px] text-white/30 uppercase tracking-wider mt-1 block">{b.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Maintenance;