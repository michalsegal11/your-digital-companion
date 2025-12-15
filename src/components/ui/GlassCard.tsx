import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  variant?: 'default' | 'strong' | 'subtle';
}

export function GlassCard({ 
  children, 
  className, 
  hover = false, 
  glow = false,
  variant = 'default' 
}: GlassCardProps) {
  const variants = {
    default: 'bg-white/80 backdrop-blur-xl border border-white/30',
    strong: 'bg-white/90 backdrop-blur-2xl border border-white/40',
    subtle: 'bg-white/60 backdrop-blur-lg border border-white/20',
  };

  return (
    <div 
      className={cn(
        'rounded-2xl shadow-soft transition-all duration-300',
        variants[variant],
        hover && 'hover:-translate-y-1 hover:shadow-elevated cursor-pointer',
        glow && 'shadow-glow',
        className
      )}
    >
      {children}
    </div>
  );
}
