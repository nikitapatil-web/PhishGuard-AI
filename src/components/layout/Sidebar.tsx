import { NavLink } from 'react-router-dom';
import {
  Shield,
  Home,
  ScanSearch,
  BarChart3,
  QrCode,
  Fish,
  History,
  Brain,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/scanner', icon: ScanSearch, label: 'Scanner' },
  { to: '/analysis', icon: Brain, label: 'Analysis' },
  { to: '/dashboard', icon: BarChart3, label: 'Reports' },
  { to: '/qr-scanner', icon: QrCode, label: 'QR Auditor' },
  { to: '/simulator', icon: Fish, label: 'Simulator' },
  { to: '/history', icon: History, label: 'History' },
];

export function Sidebar() {
  return (
    <aside className="w-16 lg:w-56 bg-bg-sidebar border-r border-border flex flex-col shrink-0">
      <div className="p-4 flex items-center gap-3 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-success flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="hidden lg:block font-semibold text-sm whitespace-nowrap">
          PhishGuard <span className="text-primary-light">AI</span>
        </span>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-success/15 text-success border border-success/20'
                  : 'text-text-muted hover:text-text hover:bg-bg-elevated/50'
              )
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="hidden lg:block">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border hidden lg:block">
        <div className="text-xs text-text-muted">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            All Systems Operational
          </div>
          <div className="text-[10px]">v2.0.0</div>
        </div>
      </div>
    </aside>
  );
}
