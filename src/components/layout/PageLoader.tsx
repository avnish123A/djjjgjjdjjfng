import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageLoader = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname === prevPath.current) return;
    prevPath.current = location.pathname;

    // Start loading
    setVisible(true);
    setProgress(0);

    // Quick jump to ~80%
    requestAnimationFrame(() => setProgress(80));

    // Slowly creep to 95%
    timeoutRef.current = setTimeout(() => setProgress(95), 400);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (progress >= 80) {
      // Complete after a short delay
      const completeTimer = setTimeout(() => {
        setProgress(100);
        // Hide after fade out
        setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 300);
      }, 200);
      return () => clearTimeout(completeTimer);
    }
  }, [progress]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none">
      <div
        className="h-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.4)]"
        style={{
          width: `${progress}%`,
          transition: progress === 0
            ? 'none'
            : progress === 100
              ? 'width 200ms ease-out, opacity 300ms ease-out'
              : 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
};

export default PageLoader;
