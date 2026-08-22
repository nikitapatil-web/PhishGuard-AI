import { useEffect, useRef, useState } from 'react';
import { Camera, Upload, Shield, QrCode } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getHistory, scanQr } from '../lib/api';
import type { ScanResult } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export function QRScannerPage() {
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getHistory().then((records) => setRecentScans(records.slice(0, 5))).catch(() => undefined);
    return () => streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setScanning(true);
    try {
      const result = await scanQr(file);
      navigate('/analysis', { state: { result } });
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : 'Unable to scan this QR image');
    } finally {
      setScanning(false);
    }
  };

  const toggleCamera = async () => {
    setError('');
    if (cameraActive) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraActive(false);
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera access is not supported by this browser. Use Upload Image instead.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      setError('Camera permission was denied or no camera is available.');
    }
  };

  const captureCameraFrame = async () => {
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      setError('Wait for the camera preview to load.');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) void handleFile(new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg');
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
              <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`} />
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
            <Button className="w-full mt-4" onClick={mode === 'camera' ? (cameraActive ? captureCameraFrame : toggleCamera) : () => fileInput.current?.click()} disabled={scanning}>
              {scanning ? 'Analyzing QR...' : mode === 'camera' ? (cameraActive ? 'Capture QR' : 'Start Camera') : 'Choose File'}
            </Button>
            {mode === 'camera' && cameraActive && <button onClick={toggleCamera} className="w-full mt-2 text-sm text-text-muted hover:text-text">Stop Camera</button>}
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
                {recentScans.length === 0 && <p className="text-sm text-text-muted">No QR scans yet.</p>}
                {recentScans.map((scan) => (
                  <div key={scan.id} onClick={() => navigate('/analysis', { state: { result: scan } })} className="flex items-center justify-between p-2 rounded-lg bg-bg/50 cursor-pointer hover:bg-bg-elevated">
                    <span className="text-sm truncate mr-2">{scan.url}</span>
                    <Badge variant={scan.riskLevel}>{scan.riskLevel === 'high-risk' ? 'High Risk' : scan.riskLevel === 'suspicious' ? 'Suspicious' : 'Safe'}</Badge>
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
