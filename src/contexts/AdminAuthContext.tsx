import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface AdminAuthContextType {
  isLoggedIn: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Demo mode: simple client-side auth for UI preview
// In production, replace with your Express backend API calls
const DEMO_EMAIL = 'studenthubince@gmail.com';
const DEMO_PASSWORD = 'avnish@123A';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const session = localStorage.getItem('admin_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.loggedIn && parsed.email) {
          setIsLoggedIn(true);
          setAdminEmail(parsed.email);
        }
      } catch {
        localStorage.removeItem('admin_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // TODO: Replace with actual API call to your Express backend
    // const res = await apiFetch(apiConfig.endpoints.login, {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password }),
    // });
    
    // Demo mode: client-side check
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network
    
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setIsLoggedIn(true);
      setAdminEmail(email);
      localStorage.setItem('admin_session', JSON.stringify({ loggedIn: true, email }));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setAdminEmail(null);
    localStorage.removeItem('admin_session');
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isLoggedIn, adminEmail, login, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};
