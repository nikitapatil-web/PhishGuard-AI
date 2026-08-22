import { useRef, useState } from 'react';
import { Camera, Upload, Shield, QrCode } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { scanQr } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export function QRScannerPage() {
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [error, setError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    try {
      const result = await scanQr(file);
      navigate('/analysis', { state: { result } });
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : 'Unable to scan this QR image');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="QR Code Auditor" />

      <main className="flex-1 overflow-auto p-6">
        <p className="text-text-muted text-sm mb-6">
          Scan QR codes safely before visiting embedded links. Detect malicious redirects and phishing payloads.
        </p>

        <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
          {/* Scanner interface - assets #16, #18 */}
          <Card glow="blue">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setMode('camera')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'camera' ? 'bg-primary text-white' : 'text-text-muted hover:bg-bg-elevated'
                }`}
              >
                <Camera className="w-4 h-4" />
                Camera Scan
              </button>
              <button
                onClick={() => setMode('upload')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'upload' ? 'bg-primary text-white' : 'text-text-muted hover:bg-bg-elevated'
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload Image
              </button>
            </div>

            <div className="aspect-square bg-bg rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-success/5" />
              <QrCode className="w-24 h-24 text-text-muted/30 mb-4" />
              <p className="text-text-muted text-sm">
                {mode === 'camera' ? 'Point camera at QR code' : 'Drop QR code image here'}
              </p>
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary" />
            </div>

            <input ref={fileInput} type="file" accept=".png,.jpg,.jpeg,.webp" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
            <Button className="w-full mt-4" onClick={() => fileInput.current?.click()}>
              {mode === 'camera' ? 'Choose QR Image' : 'Choose File'}
            </Button>
            {error && <p className="mt-3 text-sm text-danger">{error}</p>}
          </Card>

          {/* Info panel - asset #17 */}
          <div className="space-y-4">
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-success flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure QR Analysis</h3>
                  <p className="text-text-muted text-sm">AI checks destination before you visit</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>• Detects URL shortener redirects</li>
                <li>• Identifies phishing landing pages</li>
                <li>• Checks domain reputation in real-time</li>
                <li>• Warns about credential harvesting forms</li>
              </ul>
            </Card>

            <Card>
              <h3 className="font-semibold mb-3">Recent QR Scans</h3>
              <div className="space-y-2">
                {[
                  { label: 'Restaurant Menu QR', status: 'safe' as const },
                  { label: 'Parking Payment QR', status: 'safe' as const },
                  { label: 'Unknown Event QR', status: 'suspicious' as const },
                ].map(({ label, status }) => (
                  <div key={label} className="flex items-center justify-between p-2 rounded-lg bg-bg/50">
                    <span className="text-sm">{label}</span>
                    <Badge variant={status}>{status === 'safe' ? 'Safe' : 'Suspicious'}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
