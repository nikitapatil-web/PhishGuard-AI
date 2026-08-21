export type RiskLevel = 'safe' | 'suspicious' | 'high-risk';

export interface ScanRecord {
  id: string;
  url: string;
  riskLevel: RiskLevel;
  score: number;
  timestamp: string;
  threatType?: string;
}

export interface SignalVector {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  detail: string;
}

export const recentScans: ScanRecord[] = [
  { id: '1', url: 'https://secure-bank-login.xyz/verify', riskLevel: 'high-risk', score: 92, timestamp: '2026-08-21 14:32', threatType: 'Phishing' },
  { id: '2', url: 'https://github.com/phishguard-ai', riskLevel: 'safe', score: 8, timestamp: '2026-08-21 13:15' },
  { id: '3', url: 'https://free-prize-winner.com/claim', riskLevel: 'high-risk', score: 87, timestamp: '2026-08-21 12:48', threatType: 'Scam' },
  { id: '4', url: 'https://google.com', riskLevel: 'safe', score: 3, timestamp: '2026-08-21 11:22' },
  { id: '5', url: 'https://paypa1-secure.net/update', riskLevel: 'suspicious', score: 64, timestamp: '2026-08-21 10:05', threatType: 'Spoofing' },
];

export const threatAnalysis = {
  url: 'https://secure-bank-login.xyz/verify',
  score: 92,
  riskLevel: 'high-risk' as RiskLevel,
  aiExplanation: `This site exhibits characteristics of a credential-stealing campaign. The domain was registered 3 days ago and mimics a major financial institution's login page. Our AI detected homoglyph substitution in the URL, missing SSL certificate chain validation, and JavaScript that captures form inputs before submission.`,
  signalVectors: [
    { name: 'Domain Age & Registration', status: 'fail' as const, detail: 'Registered 3 days ago' },
    { name: 'SSL Certificate Validity', status: 'fail' as const, detail: 'Self-signed certificate' },
    { name: 'Social Engineering Patterns', status: 'fail' as const, detail: 'Urgency language detected' },
    { name: 'Malware Analysis', status: 'warning' as const, detail: 'Suspicious scripts found' },
    { name: 'Brand Impersonation', status: 'fail' as const, detail: 'Mimics Chase Bank login' },
    { name: 'Blacklist Status', status: 'fail' as const, detail: 'Listed on 4 threat feeds' },
  ] satisfies SignalVector[],
  safetyProtocol: [
    { text: 'Do NOT enter any credentials on this site', type: 'dont' as const },
    { text: 'Close this tab immediately', type: 'dont' as const },
    { text: 'Report this URL to your IT department', type: 'do' as const },
    { text: 'Run a password audit if you visited this site', type: 'do' as const },
    { text: 'Enable 2FA on all financial accounts', type: 'do' as const },
  ],
};

export const dashboardStats = {
  threatsScanned: 12482,
  highRiskThreats: 1204,
  avgScanTime: 1.4,
  detectionAccuracy: 99.99,
};

export const trendData = [
  { date: 'Mon', scanned: 420, blocked: 38 },
  { date: 'Tue', scanned: 580, blocked: 52 },
  { date: 'Wed', scanned: 490, blocked: 41 },
  { date: 'Thu', scanned: 720, blocked: 68 },
  { date: 'Fri', scanned: 650, blocked: 55 },
  { date: 'Sat', scanned: 380, blocked: 28 },
  { date: 'Sun', scanned: 310, blocked: 22 },
];

export const attackVectors = [
  { name: 'Phishing', count: 482, color: '#ef4444' },
  { name: 'Malware', count: 312, color: '#f59e0b' },
  { name: 'Spoofing', count: 245, color: '#2563eb' },
  { name: 'Scam', count: 165, color: '#10b981' },
];

export const historyRecords: ScanRecord[] = [
  ...recentScans,
  { id: '6', url: 'https://amazon-deals.tk/offer', riskLevel: 'high-risk', score: 89, timestamp: '2026-08-20 18:30', threatType: 'Phishing' },
  { id: '7', url: 'https://stackoverflow.com', riskLevel: 'safe', score: 5, timestamp: '2026-08-20 16:12' },
  { id: '8', url: 'https://micros0ft-update.net/patch', riskLevel: 'high-risk', score: 95, timestamp: '2026-08-20 14:45', threatType: 'Malware' },
];

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'safe': return '#10b981';
    case 'suspicious': return '#f59e0b';
    case 'high-risk': return '#ef4444';
  }
}

export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case 'safe': return 'Safe';
    case 'suspicious': return 'Suspicious';
    case 'high-risk': return 'High Risk';
  }
}
