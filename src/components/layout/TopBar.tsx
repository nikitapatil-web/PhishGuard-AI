import { Bell, Settings, User, X } from 'lucide-react';
import { useState } from 'react';
import { SearchBar } from '../ui/SearchBar';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title?: string;
  showSearch?: boolean;
}

export function TopBar({ title, showSearch = false }: TopBarProps) {
  const navigate = useNavigate();
  const [panel, setPanel] = useState<'notifications' | 'profile' | null>(null);

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
        <button aria-label="Notifications" onClick={() => setPanel(panel === 'notifications' ? null : 'notifications')} className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>
        <button className="p-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <button aria-label="Profile" onClick={() => setPanel(panel === 'profile' ? null : 'profile')} className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <User className="w-4 h-4 text-primary-light" />
        </button>
      </div>
      {panel && (
        <div className="absolute right-6 top-16 z-20 w-72 rounded-xl border border-border bg-bg-card p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">{panel === 'notifications' ? 'Notifications' : 'Profile'}</h2>
            <button aria-label="Close panel" onClick={() => setPanel(null)} className="text-text-muted hover:text-text"><X className="w-4 h-4" /></button>
          </div>
          {panel === 'notifications' ? (
            <div className="space-y-3 text-sm"><p className="text-text">3 recent scans completed</p><p className="text-text-muted">Threat intelligence feed is up to date.</p><p className="text-text-muted">No unresolved alerts.</p></div>
          ) : (
            <div className="space-y-3 text-sm"><p className="text-text">Demo Analyst</p><p className="text-text-muted">Local prototype account</p><button onClick={() => { localStorage.removeItem('phishguard-authenticated'); navigate('/'); window.location.reload(); }} className="text-danger hover:underline">Sign out</button></div>
          )}
        </div>
      )}
    </header>
  );
}
