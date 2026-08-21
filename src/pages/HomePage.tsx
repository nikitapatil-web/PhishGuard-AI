import { useNavigate } from 'react-router-dom';
import { Shield, ScanSearch, QrCode, Globe, AlertTriangle } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { SearchBar } from '../components/ui/SearchBar';
import { Card } from '../components/ui/Card';

const modules = [
  {
    icon: ScanSearch,
    title: 'URL Scanner',
    description: 'Deep-dive analysis of suspicious links with AI-powered threat detection.',
    color: 'from-primary to-primary-light',
    path: '/scanner',
  },
  {
    icon: QrCode,
    title: 'QR Auditor',
    description: 'Scan and verify QR codes before opening hidden destinations.',
    color: 'from-success to-emerald-400',
    path: '/qr-scanner',
  },
  {
    icon: Globe,
    title: 'Global Threat Intel',
    description: 'Real-time feed of worldwide phishing campaigns and attack vectors.',
    color: 'from-warning to-amber-400',
    path: '/dashboard',
  },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full overflow-auto">
      <TopBar showSearch />

      <main className="flex-1 overflow-auto">
        {/* Hero Section - uses asset #1 hero-banner, #2 shield-icon */}
        <section className="relative px-6 py-16 lg:py-24 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-success/5 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto">
            {/* Shield icon placeholder - replace with /assets/images/02-shield-icon.png */}
            <div className="mx-auto w-24 h-24 mb-8 rounded-2xl bg-gradient-to-br from-primary to-success flex items-center justify-center glow-blue">
              <Shield className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
              AI-Powered Digital
              <br />
              <span className="bg-gradient-to-r from-primary-light to-success bg-clip-text text-transparent">
                Threat Protection
              </span>
            </h1>
            <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto">
              Detect phishing attacks, analyze suspicious URLs, and protect yourself with explainable AI security intelligence.
            </p>

            <SearchBar
              size="lg"
              className="max-w-2xl mx-auto"
              onScan={() => navigate('/scanner')}
            />
          </div>
        </section>

        {/* Core Modules */}
        <section className="px-6 pb-12 max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-center">Core Modules</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {modules.map(({ icon: Icon, title, description, color, path }) => (
              <Card
                key={title}
                className="cursor-pointer hover:border-primary/50 transition-all group"
                onClick={() => navigate(path)}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-text-muted text-sm">{description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Threat Level Widget */}
        <section className="px-6 pb-12 max-w-5xl mx-auto">
          <Card className="flex items-center gap-4 border-warning/30 bg-warning/5">
            <AlertTriangle className="w-8 h-8 text-warning shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-warning">Global Threat Level: Elevated</div>
              <div className="text-sm text-text-muted">1,204 high-risk threats detected in the last 24 hours</div>
            </div>
            <div className="hidden sm:block w-32 h-2 bg-bg-elevated rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-warning to-danger rounded-full" />
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
