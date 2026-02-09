import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, AlertCircle } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { login, signup } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      const result = await signup(email, password);
      if (result.success) {
        setSignupSuccess(true);
      } else {
        setError(result.error || 'Signup failed');
      }
    } else {
      const result = await login(email, password);
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error || 'Invalid email or password');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-secondary/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl border border-border shadow-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight">
              LUXE <span className="text-accent">Admin</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {mode === 'login' ? 'Sign in to manage your store' : 'Create an admin account'}
            </p>
          </div>

          {/* Success message */}
          {signupSuccess && (
            <div className="mb-6 text-sm bg-success/10 text-success px-4 py-3 rounded-lg">
              Account created! Please check your email to verify, then sign in.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-4 py-3 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="accent"
              className="w-full"
              disabled={loading}
            >
              {loading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <p className="mt-6 text-xs text-center text-muted-foreground">
            {mode === 'login' ? (
              <>
                Need an account?{' '}
                <button onClick={() => { setMode('signup'); setError(''); setSignupSuccess(false); }} className="text-accent hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(''); setSignupSuccess(false); }} className="text-accent hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>

          <p className="mt-3 text-xs text-center text-muted-foreground">
            Note: After signup, an admin must assign you the admin role.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
