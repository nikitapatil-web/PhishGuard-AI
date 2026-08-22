import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { ScannerPage } from './pages/ScannerPage';
import { ThreatAnalysisPage } from './pages/ThreatAnalysisPage';
import { DashboardPage } from './pages/DashboardPage';
import { QRScannerPage } from './pages/QRScannerPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { HistoryPage } from './pages/HistoryPage';
import { LoginPage } from './pages/LoginPage';
import { useState } from 'react';

export default function App() {
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem('phishguard-authenticated') === 'true');

  if (!authenticated) return <LoginPage onLogin={() => setAuthenticated(true)} />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/analysis" element={<ThreatAnalysisPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/qr-scanner" element={<QRScannerPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
