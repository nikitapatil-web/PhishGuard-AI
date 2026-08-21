import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'blue' | 'green' | 'red' | 'none';
  onClick?: () => void;
}

export function Card({ children, className, glow = 'none', onClick }: CardProps) {
  const glowClass = glow !== 'none' ? `glow-${glow}` : '';
  return (
    <div
      className={cn('bg-bg-card border border-border rounded-xl p-5', glowClass, className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
