import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

type SiteMode = 'live' | 'maintenance' | 'coming_soon';

interface SiteModeContextType {
  siteMode: SiteMode;
  isLoading: boolean;
  setSiteMode: (mode: SiteMode) => Promise<void>;
}

const SiteModeContext = createContext<SiteModeContextType | undefined>(undefined);

export const SiteModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteMode, setSiteModeState] = useState<SiteMode>('live');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchMode = async () => {
      try {
        const result = await Promise.race([
          supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'site_mode')
            .maybeSingle(),
          new Promise<{ data: null; error: Error }>((resolve) =>
            setTimeout(() => resolve({ data: null, error: new Error('Timeout') }), 3000)
          ),
        ]);
        if (mounted && result.data?.value) setSiteModeState(result.data.value as SiteMode);
      } catch {
        // Default to 'live' on any failure — never block the site
      }
      if (mounted) setIsLoading(false);
    };
    fetchMode();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('site_settings_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'site_settings',
        filter: 'key=eq.site_mode',
      }, (payload: any) => {
        if (payload.new?.value) {
          setSiteModeState(payload.new.value as SiteMode);
        }
      })
      .subscribe();

    return () => { mounted = false; supabase.removeChannel(channel); };
  }, []);

  const setSiteMode = useCallback(async (mode: SiteMode) => {
    const { error } = await supabase
      .from('site_settings')
      .update({ value: mode, updated_at: new Date().toISOString() })
      .eq('key', 'site_mode');
    if (error) throw error;
    setSiteModeState(mode);
  }, []);

  return (
    <SiteModeContext.Provider value={{ siteMode, isLoading, setSiteMode }}>
      {children}
    </SiteModeContext.Provider>
  );
};

export const useSiteMode = () => {
  const ctx = useContext(SiteModeContext);
  if (!ctx) throw new Error('useSiteMode must be used within SiteModeProvider');
  return ctx;
};
