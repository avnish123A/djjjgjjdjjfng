import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

const TableSkeleton = ({ rows = 5, columns = 5 }: TableSkeletonProps) => (
  <div className="w-full space-y-3">
    {/* Header */}
    <div className="flex gap-4 px-4 py-3">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={`h-${i}`} className="h-4 flex-1 rounded" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4 px-4 py-4 border-t border-border">
        {Array.from({ length: columns }).map((_, c) => (
          <Skeleton
            key={`${r}-${c}`}
            className="h-4 flex-1 rounded"
            style={{ maxWidth: c === 0 ? '40%' : undefined }}
          />
        ))}
      </div>
    ))}
  </div>
);

export default TableSkeleton;
