export interface ScanResult {
  id: number;
  url: string;
  score: number;
  riskLevel: 'safe' | 'suspicious' | 'high-risk';
  timestamp: string;
  threatType?: string | null;
  aiExplanation: string;
  signalVectors: { name: string; status: 'pass' | 'fail' | 'warning'; detail: string }[];
  safetyProtocol: { text: string; type: 'do' | 'dont' }[];
  websiteAnalysis: string[];
  reasons: string[];
}

const API_URL = import.meta.env.VITE_API_URL ?? '';

export async function scanUrl(url: string): Promise<ScanResult> {
  const response = await fetch(`${API_URL}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.detail ?? 'Unable to scan this URL');
  }
  return response.json() as Promise<ScanResult>;
}

export async function scanFile(file: File): Promise<ScanResult> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_URL}/api/scan-file`, { method: 'POST', body: formData });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.detail ?? 'Unable to scan this file');
  }
  return response.json() as Promise<ScanResult>;
}

export async function scanQr(file: File): Promise<ScanResult> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_URL}/api/scan-qr`, { method: 'POST', body: formData });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.detail ?? 'Unable to scan this QR image');
  }
  return response.json() as Promise<ScanResult>;
}

export async function getHistory(): Promise<ScanResult[]> {
  const response = await fetch(`${API_URL}/api/history`);
  if (!response.ok) throw new Error('Unable to load scan history');
  return response.json() as Promise<ScanResult[]>;
}

export async function scanCsv(file: File): Promise<ScanResult[]> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_URL}/api/scan-csv`, { method: 'POST', body: formData });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.detail ?? 'Unable to scan this CSV');
  }
  return response.json() as Promise<ScanResult[]>;
}