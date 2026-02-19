import { useEffect, useRef, useCallback } from 'react';

const EVENTS = ['mousedown', 'keydown', 'touchstart', 'scroll'] as const;

export function useInactivityLogout(
  onLogout: () => void,
  timeoutMs = 30 * 60 * 1000 // 30 min default
) {
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(onLogout, timeoutMs);
  }, [onLogout, timeoutMs]);

  useEffect(() => {
    reset();
    EVENTS.forEach(e => window.addEventListener(e, reset, { passive: true }));
    return () => {
      if (timer.current) clearTimeout(timer.current);
      EVENTS.forEach(e => window.removeEventListener(e, reset));
    };
  }, [reset]);
}
