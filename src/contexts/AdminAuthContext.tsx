import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AdminAuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  adminEmail: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const adminCacheRef = useRef<Map<string, boolean>>(new Map());
  const initDoneRef = useRef(false);

  const checkAdminRole = useCallback(async (userId: string): Promise<boolean> => {
    const cached = adminCacheRef.current.get(userId);
    if (cached !== undefined) return cached;

    try {
      const { data, error } = await Promise.race([
        supabase.rpc('has_role', { _user_id: userId, _role: 'admin' as const }),
        new Promise<{ data: null; error: Error }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: new Error('RPC timeout') }), 4000)
        ),
      ]);
      if (error) {
        console.error('[AdminAuth] checkAdminRole error:', error.message);
        return false;
      }
      const result = !!data;
      adminCacheRef.current.set(userId, result);
      return result;
    } catch {
      return false;
    }
  }, []);

  // Single initialization: getSession first, then listen for changes
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          const admin = await checkAdminRole(session.user.id);
          if (mounted) setIsAdmin(admin);
        }
      } catch (err) {
        console.error('[AdminAuth] init error:', err);
      } finally {
        if (mounted) {
          initDoneRef.current = true;
          setIsLoading(false);
        }
      }
    };

    init();

    // Listen for subsequent auth changes (token refresh, sign out from another tab, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      // Skip until initial load is done to prevent double-processing
      if (!initDoneRef.current) return;

      console.log('[AdminAuth] auth event:', event);

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        // Only re-check admin if not already cached
        const admin = await checkAdminRole(session.user.id);
        if (mounted) setIsAdmin(admin);
      }
    });

    // Safety timeout
    const timeout = setTimeout(() => {
      if (mounted && !initDoneRef.current) {
        console.warn('[AdminAuth] Safety timeout — forcing loaded');
        initDoneRef.current = true;
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [checkAdminRole]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setIsLoading(false);
        return { success: false, error: 'Invalid email or password' };
      }

      if (!data.user) {
        setIsLoading(false);
        return { success: false, error: 'Login failed. Please try again.' };
      }

      const adminStatus = await checkAdminRole(data.user.id);
      if (!adminStatus) {
        await supabase.auth.signOut();
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
        return { success: false, error: 'You do not have admin access' };
      }

      adminCacheRef.current.set(data.user.id, true);
      setUser(data.user);
      setIsAdmin(true);
      setIsLoading(false);
      return { success: true };
    } catch {
      setIsLoading(false);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }, [checkAdminRole]);

  const signup = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setIsLoading(false);
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    adminCacheRef.current.clear();
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        isLoggedIn: !!user && isAdmin,
        isAdmin,
        adminEmail: user?.email || null,
        user,
        login,
        signup,
        logout,
        isLoading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};
