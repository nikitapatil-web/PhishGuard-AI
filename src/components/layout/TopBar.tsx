import { Bell, Settings, User } from 'lucide-react';
import { SearchBar } from '../ui/SearchBar';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title?: string;
  showSearch?: boolean;
}

export function TopBar({ title, showSearch = false }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b border-border bg-bg-sidebar/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
        {showSearch && (
          <div className="max-w-md flex-1 hidden md:block">
            <SearchBar
              size="md"
              buttonText="Scan"
              onScan={() => navigate('/scanner')}
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>
        <button className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <button className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <User className="w-4 h-4 text-primary-light" />
        </button>
      </div>
    </header>
  );
}
