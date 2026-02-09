import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
}

function getTimeLeft(target: Date) {
  const now = new Date();
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hrs: Math.floor((diff / (1000 * 60 * 60)) % 24),
    min: Math.floor((diff / (1000 * 60)) % 60),
    sec: Math.floor((diff / 1000) % 60),
  };
}

export const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-2">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="text-center">
          <div className="bg-background text-foreground rounded-lg px-2.5 py-1.5 text-lg font-bold tabular-nums min-w-[2.75rem]">
            {String(value).padStart(2, '0')}
          </div>
          <span className="text-[10px] text-background/45 mt-1 block uppercase tracking-wide">{label}</span>
        </div>
      ))}
    </div>
  );
};
