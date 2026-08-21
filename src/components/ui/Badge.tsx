import { cn } from '../../lib/utils';

interface BadgeProps {
  variant: 'safe' | 'suspicious' | 'high-risk' | 'default';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  safe: 'bg-success/15 text-success border-success/30',
  suspicious: 'bg-warning/15 text-warning border-warning/30',
  'high-risk': 'bg-danger/15 text-danger border-danger/30',
  default: 'bg-primary/15 text-primary-light border-primary/30',
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', variants[variant], className)}>
      {children}
    </span>
  );
}
