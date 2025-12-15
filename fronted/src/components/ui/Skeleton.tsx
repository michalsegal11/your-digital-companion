import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circular' | 'text';
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  const variants = {
    default: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4',
  };

  return (
    <div 
      className={cn(
        'bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200',
        'bg-[length:200%_100%] animate-shimmer',
        variants[variant],
        className
      )}
    />
  );
}

// Preset skeleton patterns
export function CardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <Skeleton className="h-4 w-3/4" variant="text" />
      <Skeleton className="h-4 w-1/2" variant="text" />
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 w-10" variant="circular" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/3" variant="text" />
          <Skeleton className="h-3 w-1/4" variant="text" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-neutral-200">
      <Skeleton className="h-10 w-10" variant="circular" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/4" variant="text" />
        <Skeleton className="h-3 w-1/6" variant="text" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
}

export function SlotGridSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {[...Array(12)].map((_, i) => (
        <Skeleton key={i} className="h-10" />
      ))}
    </div>
  );
}
