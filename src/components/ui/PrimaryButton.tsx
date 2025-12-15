import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export function PrimaryButton({ 
  children, 
  className, 
  loading = false, 
  size = 'md',
  glow = false,
  disabled,
  ...props 
}: PrimaryButtonProps) {
  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  };

  return (
    <button 
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl',
        'gradient-brand text-white',
        'transition-all duration-300 ease-out',
        'hover:opacity-90 hover:-translate-y-0.5',
        'active:translate-y-0 active:opacity-100',
        'disabled:opacity-50 disabled:pointer-events-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        sizes[size],
        glow && 'shadow-glow',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
