import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { dashboardStats, trendData, attackVectors, recentScans } from '../data/mockData';

const statCards = [
  { label: 'Threats Scanned', value: dashboardStats.threatsScanned.toLocaleString(), color: 'text-primary-light' },
  { label: 'High-Risk Threats', value: dashboardStats.highRiskThreats.toLocaleString(), color: 'text-danger' },
  { label: 'Avg Scan Time', value: `${dashboardStats.avgScanTime}s`, color: 'text-warning' },
  { label: 'Detection Accuracy', value: `${dashboardStats.detectionAccuracy}%`, color: 'text-success' },
];

export function DashboardPage() {
  const highRiskIncidents = recentScans.filter((s) => s.riskLevel === 'high-risk' || s.riskLevel === 'suspicious');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Threat Reports & Analytics" />

      <main className="flex-1 overflow-auto p-6">
        <p className="text-text-muted text-sm mb-6">Command Center — real-time security metrics and threat intelligence.</p>

        {/* KPI Cards - assets #12-15 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map(({ label, value, color }) => (
            <Card key={label}>
              <div className="text-text-muted text-xs mb-1">{label}</div>
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Trend Chart */}
          <Card className="lg:col-span-2">
            <h3 className="font-semibold mb-4">Threat Detection Trends</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Line type="monotone" dataKey="scanned" stroke="#2563eb" strokeWidth={2} dot={false} name="Scanned" />
                <Line type="monotone" dataKey="blocked" stroke="#10b981" strokeWidth={2} dot={false} name="Blocked" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Attack Vectors - asset #13 */}
          <Card>
            <h3 className="font-semibold mb-4">Attack Vectors</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={attackVectors} layout="vertical">
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={70} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {attackVectors.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Incidents - asset #28 */}
        <Card>
          <h3 className="font-semibold mb-4">Recent High-Risk Incidents</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-muted border-b border-border">
                  <th className="text-left py-2 pr-4 font-medium">Timestamp</th>
                  <th className="text-left py-2 pr-4 font-medium">Target URL</th>
                  <th className="text-left py-2 pr-4 font-medium">Threat Type</th>
                  <th className="text-left py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {highRiskIncidents.map((incident) => (
                  <tr key={incident.id} className="border-b border-border/50 hover:bg-bg-elevated/30">
                    <td className="py-3 pr-4 text-text-muted whitespace-nowrap">{incident.timestamp}</td>
                    <td className="py-3 pr-4 font-mono truncate max-w-xs">{incident.url}</td>
                    <td className="py-3 pr-4">{incident.threatType ?? '—'}</td>
                    <td className="py-3">
                      <Badge variant={incident.riskLevel}>
                        {incident.riskLevel === 'high-risk' ? 'High Risk' : 'Suspicious'}
                      </Badge>
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
