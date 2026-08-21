import { Search } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface SearchBarProps {
  placeholder?: string;
  buttonText?: string;
  size?: 'md' | 'lg';
  className?: string;
  onScan?: (url: string) => void;
}

export function SearchBar({
  placeholder = 'Enter URL or domain to scan...',
  buttonText = 'SCAN NOW',
  size = 'md',
  className,
  onScan,
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('url') as HTMLInputElement;
    onScan?.(input.value);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2 w-full', className)}>
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          name="url"
          type="url"
          placeholder={placeholder}
          className={cn(
            'w-full bg-bg border border-border rounded-lg pl-12 pr-4 text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors',
            size === 'lg' ? 'py-4 text-base' : 'py-2.5 text-sm'
          )}
        />
      </div>
      <Button type="submit" size={size === 'lg' ? 'lg' : 'md'}>
        {buttonText}
      </Button>
    </form>
  );
}
