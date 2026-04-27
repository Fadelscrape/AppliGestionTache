import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'urgent' | 'high' | 'medium' | 'low' | 'success' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-gray-300',
    urgent: 'bg-red-500/15 text-red-400 border border-red-500/30',
    high: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    medium: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    low: 'bg-gray-500/15 text-gray-400 border border-gray-500/30',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    info: 'bg-violet-500/15 text-violet-400 border border-violet-500/30',
  };

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
