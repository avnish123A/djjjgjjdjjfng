import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RotateCw } from 'lucide-react';

/** Lightweight content placeholder used while an admin page's code or data loads. */
export const AdminPageSkeleton: React.FC = () => (
  <div className="space-y-6" aria-busy="true" aria-label="Loading">
    <div className="space-y-2">
      <Skeleton className="h-7 w-44" />
      <Skeleton className="h-4 w-64" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
    </div>
    <Skeleton className="h-72 rounded-xl" />
  </div>
);

export const TableRowsSkeleton: React.FC<{ rows?: number }> = ({ rows = 6 }) => (
  <div className="divide-y divide-border" aria-busy="true">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-6 py-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-48 hidden sm:block" />
        <Skeleton className="h-4 w-20 ml-auto" />
      </div>
    ))}
  </div>
);

/** Small, retryable inline error for a single widget — never blanks the page. */
export const InlineError: React.FC<{ message?: string; onRetry?: () => void; className?: string }> = ({
  message = 'Couldn’t load this data.',
  onRetry,
  className = '',
}) => (
  <div role="alert" className={`flex items-center justify-between gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm ${className}`}>
    <span className="flex items-center gap-2 text-foreground"><AlertCircle className="h-4 w-4 text-destructive shrink-0" /> {message}</span>
    {onRetry && (
      <button onClick={onRetry} className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:underline shrink-0">
        <RotateCw className="h-3.5 w-3.5" /> Retry
      </button>
    )}
  </div>
);
