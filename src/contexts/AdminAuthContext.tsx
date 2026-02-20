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
  // Cache admin status per user ID to avoid repeated RPC calls
  const adminCacheRef = useRef<Map<string, boolean>>(new Map());

  const checkAdminRole = useCallback(async (userId: string): Promise<boolean> => {
    // Return cached result if available
    const cached = adminCacheRef.current.get(userId);
    if (cached !== undefined) return cached;

    try {
      const rpcPromise = supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin',
      });
      const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error('RPC timeout') }), 5000)
      );
      const { data, error } = await Promise.race([rpcPromise, timeoutPromise]);
      if (error) {
        console.error('checkAdminRole error:', error);
        // Don't cache failures so we can retry
        return false;
      }
      const result = !!data;
      adminCacheRef.current.set(userId, result);
      return result;
    } catch (err) {
      console.error('checkAdminRole failed:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    // Timeout fallback — if auth never responds, stop loading after 3s
    const timeout = setTimeout(() => {
      setIsLoading((prev) => {
        if (prev) console.warn('Auth timeout — forcing isLoading=false');
        return false;
      });
    }, 3000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          setUser(session.user);
          // Use cached admin status; only RPC if not cached
          const adminStatus = await checkAdminRole(session.user.id);
          setIsAdmin(adminStatus);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setUser(session?.user ?? null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      try {
        if (session?.user) {
          setUser(session.user);
          const adminStatus = await checkAdminRole(session.user.id);
          setIsAdmin(adminStatus);
        }
      } catch (err) {
        console.error('Get session error:', err);
        setUser(session?.user ?? null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => {
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
        return { success: false, error: error.message };
      }

      if (data.user) {
        const adminStatus = await checkAdminRole(data.user.id);
        if (!adminStatus) {
          await supabase.auth.signOut();
          setIsLoading(false);
          return { success: false, error: 'You do not have admin access' };
        }
        // Cache and set admin status so subsequent auth state changes use the cache
        adminCacheRef.current.set(data.user.id, true);
        setUser(data.user);
        setIsAdmin(true);
      }

      setIsLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
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
    if (error) {
      return { success: false, error: error.message };
    }
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
