import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const AdminResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });
    // Check hash for type=recovery
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/admin/login'), 2500);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute w-[500px] h-[500px] -top-40 -left-40 rounded-full opacity-20 blur-3xl bg-accent pointer-events-none animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute w-[400px] h-[400px] -bottom-32 -right-32 rounded-full opacity-20 blur-3xl bg-accent/60 pointer-events-none animate-[float_10s_ease-in-out_infinite_reverse]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-strong rounded-2xl p-8 shadow-[0_8px_60px_-12px_rgba(200,169,106,0.15)]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-accent" />
              <h1 className="text-2xl font-bold tracking-[0.15em] text-white">
                EkamGift <span className="text-accent font-normal tracking-normal text-lg">Admin</span>
              </h1>
            </div>
            <p className="text-sm text-white/50">Set your new password</p>
          </div>

          <AnimatePresence mode="wait">
            {success && (
              <motion.div key="ok" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 flex items-center gap-2 text-sm bg-success/10 text-green-400 px-4 py-3 rounded-lg border border-success/20">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Password updated! Redirecting…
              </motion.div>
            )}
            {error && (
              <motion.div key="err" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {!isRecovery && !success ? (
            <p className="text-sm text-white/50 text-center">Invalid or expired reset link. Please request a new one from the login page.</p>
          ) : !success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="new-pw" className="text-white/70 text-xs uppercase tracking-wider">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    id="new-pw"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-accent/50"
                    required
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors" tabIndex={-1}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div className={`h-full rounded-full ${strength.color}`} initial={{ width: 0 }} animate={{ width: `${strength.pct}%` }} transition={{ duration: 0.3 }} />
                    </div>
                    <p className="text-[10px] text-white/40">{strength.label}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-pw" className="text-white/70 text-xs uppercase tracking-wider">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    id="confirm-pw"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-accent/50"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-white font-medium h-11 rounded-lg transition-all duration-200 hover:shadow-[0_0_24px_-4px_hsl(var(--accent)/0.4)] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating…
                  </span>
                ) : 'Update Password'}
              </Button>
            </form>
          )}

          <p className="mt-6 text-xs text-center text-white/40">
            <button onClick={() => navigate('/admin/login')} className="text-accent hover:underline">Back to Sign in</button>
          </p>
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

export default AdminResetPassword;
