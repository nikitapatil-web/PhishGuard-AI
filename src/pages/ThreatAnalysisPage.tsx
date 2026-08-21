import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RiskGauge } from '../components/ui/RiskGauge';
import { Badge } from '../components/ui/Badge';
import { threatAnalysis } from '../data/mockData';

function StatusIcon({ status }: { status: 'pass' | 'fail' | 'warning' }) {
  if (status === 'pass') return <CheckCircle className="w-4 h-4 text-success" />;
  if (status === 'fail') return <XCircle className="w-4 h-4 text-danger" />;
  return <AlertCircle className="w-4 h-4 text-warning" />;
}

export function ThreatAnalysisPage() {
  const { url, score, riskLevel, aiExplanation, signalVectors, safetyProtocol } = threatAnalysis;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Threat Analysis Report" />

      <main className="flex-1 overflow-auto p-6">
        <div className="flex flex-wrap gap-3 mb-6">
          <Button variant="ghost" size="sm">Ignore & Close</Button>
          <Button variant="danger" size="sm">Report Errors</Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Risk Score - asset #5 risk-meter */}
          <Card className="flex flex-col items-center justify-center text-center" glow="red">
            <RiskGauge score={score} />
            <Badge variant={riskLevel} className="mt-4">High Risk Threat</Badge>
            <p className="text-text-muted text-xs mt-2 font-mono break-all px-2">{url}</p>
          </Card>

          {/* Safety Protocol - asset #26 */}
          <Card>
            <h3 className="font-semibold mb-4">Safety Protocol</h3>
            <ul className="space-y-3">
              {safetyProtocol.map(({ text, type }, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  {type === 'do' ? (
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                  )}
                  <span className={type === 'dont' ? 'text-danger/90' : 'text-text'}>{text}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Signal Vectors - assets #6-8 status icons */}
          <Card>
            <h3 className="font-semibold mb-4">Signal Vectors</h3>
            <div className="space-y-3">
              {signalVectors.map(({ name, status, detail }) => (
                <div key={name} className="flex items-start gap-3">
                  <StatusIcon status={status} />
                  <div>
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-xs text-text-muted">{detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Analysis - assets #9, #24, #25 */}
        <Card className="mt-6" glow="blue">
          <h3 className="font-semibold mb-2">AI Analysis</h3>
          <p className="text-sm text-text-muted mb-1 font-medium">Why is this dangerous?</p>
          <p className="text-sm leading-relaxed">{aiExplanation}</p>
        </Card>
      </main>
    </div>
  );
}
