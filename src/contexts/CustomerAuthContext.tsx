import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  total_orders: number;
  total_spent: number;
}

interface CustomerAuthContextType {
  user: User | null;
  customer: CustomerProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomerProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('customers')
      .select('id, name, email, phone, total_orders, total_spent')
      .eq('auth_user_id', userId)
      .maybeSingle();
    return data as CustomerProfile | null;
  }, []);

  const refreshCustomer = useCallback(async () => {
    if (user) {
      const profile = await fetchCustomerProfile(user.id);
      setCustomer(profile);
    }
  }, [user, fetchCustomerProfile]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 5000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      clearTimeout(timeout);
      if (session?.user) {
        setUser(session.user);
        // Check if NOT admin - only load customer profile for non-admin users
        const { data: isAdmin } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin',
        });
        if (!isAdmin) {
          const profile = await fetchCustomerProfile(session.user.id);
          setCustomer(profile);
        }
      } else {
        setUser(null);
        setCustomer(null);
      }
      setIsLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(timeout);
      if (session?.user) {
        setUser(session.user);
        const { data: isAdmin } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin',
        });
        if (!isAdmin) {
          const profile = await fetchCustomerProfile(session.user.id);
          setCustomer(profile);
        }
      }
      setIsLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [fetchCustomerProfile]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }
    if (data.user) {
      // Check if this is an admin - admins should use admin login
      const { data: isAdmin } = await supabase.rpc('has_role', {
        _user_id: data.user.id,
        _role: 'admin',
      });
      if (isAdmin) {
        await supabase.auth.signOut();
        setIsLoading(false);
        return { success: false, error: 'Please use the admin login page.' };
      }
      const profile = await fetchCustomerProfile(data.user.id);
      setCustomer(profile);
    }
    setIsLoading(false);
    return { success: true };
  }, [fetchCustomerProfile]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: name },
      },
    });
    if (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }
    // Create customer record linked to auth user
    if (data.user) {
      const { error: custError } = await supabase
        .from('customers')
        .insert({
          auth_user_id: data.user.id,
          name,
          email,
          total_orders: 0,
          total_spent: 0,
        });
      if (custError && !custError.message.includes('duplicate')) {
        console.error('Customer creation error:', custError);
      }
      const profile = await fetchCustomerProfile(data.user.id);
      setCustomer(profile);
    }
    setIsLoading(false);
    return { success: true };
  }, [fetchCustomerProfile]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCustomer(null);
  }, []);

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        customer,
        isLoggedIn: !!user && !!customer,
        isLoading,
        login,
        signup,
        logout,
        refreshCustomer,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  return context;
};
