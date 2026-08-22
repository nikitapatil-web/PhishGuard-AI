import { useRef, useState } from 'react';
import { Upload, Activity, Database, Wifi } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { SearchBar } from '../components/ui/SearchBar';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { recentScans } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { scanFile, scanUrl } from '../lib/api';

export function ScannerPage() {
  const [tab, setTab] = useState<'url' | 'file'>('url');
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleScan = async (url: string) => {
    setError('');
    setScanning(true);
    try {
      const result = await scanUrl(url);
      navigate('/analysis', { state: { result } });
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : 'Unable to scan this URL');
    } finally {
      setScanning(false);
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setScanning(true);
    try {
      const result = await scanFile(file);
      navigate('/analysis', { state: { result } });
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : 'Unable to scan this file');
    } finally {
      setScanning(false);
    }
  };

  const systemHealth = [
    { label: 'AI Sync', status: 'Operational', icon: Activity },
    { label: 'Database', status: 'Operational', icon: Database },
    { label: 'API Status', status: 'Operational', icon: Wifi },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Threat Scanner" />

      <main className="flex-1 overflow-auto p-6">
        <p className="text-text-muted text-sm mb-6">
          AI-powered intelligence engine for real-time URL and file threat analysis.
        </p>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card glow="blue">
              <div className="flex gap-2 mb-4">
                {(['url', 'file'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      tab === t
                        ? 'bg-primary text-white'
                        : 'text-text-muted hover:text-text hover:bg-bg-elevated'
                    }`}
                  >
                    {t === 'url' ? 'URL / Domain' : 'File Upload'}
                  </button>
                ))}
              </div>

              {tab === 'url' ? (
                <SearchBar
                  size="lg"
                  buttonText="Scan Now"
                  onScan={handleScan}
                />
              ) : (
                <div
                  className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInput.current?.click()}
                >
                  <input ref={fileInput} type="file" accept=".pdf,.html,.htm,.eml,.txt" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
                  <Upload className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-muted text-sm">Drop a file here or click to upload</p>
                  <p className="text-text-muted text-xs mt-1">Supports PDF, HTML, EML up to 10MB</p>
                </div>
              )}
              {scanning && <p className="mt-3 text-sm text-text-muted">Analyzing URL...</p>}
              {error && <p className="mt-3 text-sm text-danger">{error}</p>}
            </Card>

            <Card>
              <h3 className="font-semibold mb-4">Recent Scans</h3>
              <div className="space-y-2">
                {recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-bg/50 hover:bg-bg-elevated/50 transition-colors cursor-pointer"
                    onClick={() => navigate('/analysis')}
                  >
                    <span className="text-sm truncate flex-1 mr-4 font-mono">{scan.url}</span>
                    <Badge variant={scan.riskLevel}>{scan.riskLevel === 'high-risk' ? 'High Risk' : scan.riskLevel === 'suspicious' ? 'Suspicious' : 'Safe'}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold mb-4">System Health</h3>
              <div className="space-y-3">
                {systemHealth.map(({ label, status, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon className="w-4 h-4 text-text-muted" />
                      {label}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-success">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      {status}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold mb-2">Bulk Scan Tool</h3>
              <p className="text-text-muted text-sm mb-4">Upload a CSV with multiple URLs for batch analysis.</p>
              <Button variant="secondary" size="sm" className="w-full" onClick={() => fileInput.current?.click()}>
                <Upload className="w-4 h-4" />
                Upload CSV
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
