import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, Mail, AlertCircle, Eye, EyeOff, Shield, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

/* ── password strength helper ── */
const getPasswordStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', pct: 25, color: 'bg-destructive' };
  if (score <= 3) return { label: 'Medium', pct: 55, color: 'bg-warning' };
  return { label: 'Strong', pct: 100, color: 'bg-success' };
};

const Orb = ({ className }: { className?: string }) => (
  <div className={`absolute rounded-full opacity-20 blur-3xl pointer-events-none ${className}`} />
);

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, signup } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  // Get the intended destination after login
  const from = (location.state as { from?: string })?.from || '/admin/dashboard';

  useEffect(() => {
    const saved = localStorage.getItem('ekamgift_admin_email');
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'forgot') {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      setLoading(false);
      if (err) {
        setError(err.message);
      } else {
        setForgotSuccess(true);
      }
      return;
    }

    if (mode === 'signup') {
      const result = await signup(email, password);
      setLoading(false);
      if (result.success) {
        setSignupSuccess(true);
      } else {
        setError(result.error || 'Signup failed');
      }
      return;
    }

    // login
    if (rememberMe) {
      localStorage.setItem('ekamgift_admin_email', email);
    } else {
      localStorage.removeItem('ekamgift_admin_email');
    }
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast({ title: 'Welcome back!', description: 'Logged in successfully.' });
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  const switchMode = (m: 'login' | 'signup' | 'forgot') => {
    setMode(m);
    setError('');
    setSignupSuccess(false);
    setForgotSuccess(false);
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#0a0a0a]">
      <Orb className="w-[500px] h-[500px] -top-40 -left-40 bg-accent animate-[float_8s_ease-in-out_infinite]" />
      <Orb className="w-[400px] h-[400px] -bottom-32 -right-32 bg-accent/60 animate-[float_10s_ease-in-out_infinite_reverse]" />
      <Orb className="w-[300px] h-[300px] top-1/2 left-1/3 bg-accent/30 animate-[float_12s_ease-in-out_infinite]" />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-strong rounded-2xl p-8 shadow-[0_8px_60px_-12px_rgba(200,169,106,0.15)]">
          <motion.div variants={container} initial="hidden" animate="show" className="text-center mb-8">
            <motion.div variants={item} className="inline-flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-accent" />
              <h1 className="text-2xl font-bold tracking-[0.15em] text-white">
                EkamGift <span className="text-accent font-normal tracking-normal text-lg">Admin</span>
              </h1>
            </motion.div>
            <motion.p variants={item} className="text-sm text-white/50">
              {mode === 'login' && 'Sign in to manage your store'}
              {mode === 'signup' && 'Create an admin account'}
              {mode === 'forgot' && 'Reset your password'}
            </motion.p>
          </motion.div>

          <AnimatePresence mode="wait">
            {signupSuccess && (
              <motion.div key="signup-ok" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 flex items-center gap-2 text-sm bg-success/10 text-green-400 px-4 py-3 rounded-lg border border-success/20">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Account created! Check your email, then sign in.
              </motion.div>
            )}
            {forgotSuccess && (
              <motion.div key="forgot-ok" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 flex items-center gap-2 text-sm bg-accent/10 text-accent px-4 py-3 rounded-lg border border-accent/20">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Reset link sent! Check your inbox.
              </motion.div>
            )}
            {error && (
              <motion.div key="error" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form onSubmit={handleSubmit} variants={container} initial="hidden" animate="show" className="space-y-5">
            <motion.div variants={item} className="space-y-2">
              <Label htmlFor="email" className="text-white/70 text-xs uppercase tracking-wider">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-accent/50 focus-visible:border-accent/30"
                  required
                />
              </div>
            </motion.div>

            {mode !== 'forgot' && (
              <motion.div variants={item} className="space-y-2">
                <Label htmlFor="password" className="text-white/70 text-xs uppercase tracking-wider">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-accent/50 focus-visible:border-accent/30"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {mode === 'signup' && password.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1 pt-1">
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${strength.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${strength.pct}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-[10px] text-white/40">{strength.label}</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {mode === 'login' && (
              <motion.div variants={item} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(v) => setRememberMe(!!v)}
                    className="border-white/20 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                  <Label htmlFor="remember" className="text-xs text-white/50 cursor-pointer">Remember me</Label>
                </div>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-xs text-accent/70 hover:text-accent transition-colors"
                >
                  Forgot password?
                </button>
              </motion.div>
            )}

            <motion.div variants={item}>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-white font-medium h-11 rounded-lg transition-all duration-200 hover:shadow-[0_0_24px_-4px_hsl(var(--accent)/0.4)] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {mode === 'login' ? 'Signing in…' : mode === 'signup' ? 'Creating…' : 'Sending…'}
                  </span>
                ) : (
                  mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'
                )}
              </Button>
            </motion.div>
          </motion.form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 space-y-2 text-center">
            {mode === 'login' && (
              <p className="text-xs text-white/40">
                Need an account?{' '}
                <button onClick={() => switchMode('signup')} className="text-accent hover:underline">Sign up</button>
              </p>
            )}
            {mode === 'signup' && (
              <>
                <p className="text-xs text-white/40">
                  Already have an account?{' '}
                  <button onClick={() => switchMode('login')} className="text-accent hover:underline">Sign in</button>
                </p>
                <p className="text-[10px] text-white/30">After signup, an admin must assign you the admin role.</p>
              </>
            )}
            {mode === 'forgot' && (
              <p className="text-xs text-white/40">
                Back to{' '}
                <button onClick={() => switchMode('login')} className="text-accent hover:underline">Sign in</button>
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
