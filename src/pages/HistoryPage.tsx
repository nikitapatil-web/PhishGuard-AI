import { Clock, ExternalLink } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { RiskGauge } from '../components/ui/RiskGauge';
import type { ScanResult } from '../lib/api';
import { getHistory } from '../lib/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function HistoryPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getHistory()
      .then(setRecords)
      .catch((historyError) => setError(historyError instanceof Error ? historyError.message : 'Unable to load scan history'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Scan History" />

      <main className="flex-1 overflow-auto p-6">
        <p className="text-text-muted text-sm mb-6">
          Complete activity log of all URL scans and threat analyses. Asset #28 timeline, #29 clock icon.
        </p>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-muted border-b border-border">
                  <th className="text-left py-3 pr-4 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Timestamp
                    </div>
                  </th>
                  <th className="text-left py-3 pr-4 font-medium">URL</th>
                  <th className="text-left py-3 pr-4 font-medium">Risk Score</th>
                  <th className="text-left py-3 pr-4 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={5} className="py-8 text-center text-text-muted">Loading scan history...</td></tr>}
                {!loading && error && <tr><td colSpan={5} className="py-8 text-center text-danger">{error}. Start the backend on port 8000 and refresh.</td></tr>}
                {!loading && !error && records.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-text-muted">No scans have been recorded yet.</td></tr>}
                {records.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-border/50 hover:bg-bg-elevated/30 cursor-pointer transition-colors"
                    onClick={() => navigate('/analysis', { state: { result: record } })}
                  >
                    <td className="py-4 pr-4 text-text-muted whitespace-nowrap">{record.timestamp}</td>
                    <td className="py-4 pr-4 font-mono truncate max-w-xs">{record.url}</td>
                    <td className="py-4 pr-4">
                      <RiskGauge score={record.score} size="sm" />
                    </td>
                    <td className="py-4 pr-4">
                      <Badge variant={record.riskLevel}>
                        {record.riskLevel === 'high-risk' ? 'High Risk' : record.riskLevel === 'suspicious' ? 'Suspicious' : 'Safe'}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <button className="p-1.5 rounded hover:bg-bg-elevated text-text-muted hover:text-primary transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
