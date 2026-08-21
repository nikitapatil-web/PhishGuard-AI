import { Shield, AlertTriangle, ArrowRight } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const attackSteps = [
  { step: 1, title: 'Reconnaissance', desc: 'Attacker researches target organization and employees' },
  { step: 2, title: 'Craft Email', desc: 'Fake email mimics trusted sender with urgent call-to-action' },
  { step: 3, title: 'Deploy Link', desc: 'Victim clicks link to credential-harvesting page' },
  { step: 4, title: 'Steal Credentials', desc: 'Login details captured and sent to attacker' },
];

const protectionSteps = [
  { step: 1, title: 'URL Submission', desc: 'User submits suspicious link to PhishGuard AI' },
  { step: 2, title: 'AI Analysis', desc: 'ML models analyze domain, content, and behavior patterns' },
  { step: 3, title: 'Threat Scoring', desc: 'Risk score calculated from 40+ signal vectors' },
  { step: 4, title: 'Explainable Report', desc: 'Clear explanation of why the URL is dangerous' },
  { step: 5, title: 'Safety Protocol', desc: 'Actionable dos and don\'ts provided to user' },
  { step: 6, title: 'Threat Intel Feed', desc: 'New threat added to global intelligence database' },
  { step: 7, title: 'Continuous Learning', desc: 'Model retrains on new attack patterns' },
];

export function SimulatorPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Phishing Attack Simulator" />

      <main className="flex-1 overflow-auto p-6">
        <p className="text-text-muted text-sm mb-6">
          Learn how phishing attacks work and how PhishGuard AI protects you. Educational simulation — no real attacks.
        </p>

        {/* Attack concept - assets #19, #20 */}
        <Card className="mb-6 border-danger/30 bg-danger/5">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-danger shrink-0" />
            <div>
              <h3 className="font-semibold text-danger mb-1">How Phishing Attacks Work</h3>
              <p className="text-sm text-text-muted">
                Attackers use social engineering to trick users into revealing credentials or installing malware.
                Understanding the attack flow helps you recognize threats before they succeed.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Attack Flow - asset #22 */}
          <Card>
            <h3 className="font-semibold mb-4 text-danger">Attack Flow (4 Stages)</h3>
            <div className="space-y-4">
              {attackSteps.map(({ step, title, desc }, i) => (
                <div key={step} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-danger/20 text-danger flex items-center justify-center text-sm font-bold shrink-0">
                    {step}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{title}</div>
                    <div className="text-xs text-text-muted">{desc}</div>
                  </div>
                  {i < attackSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-danger/40 ml-auto shrink-0 self-center hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
            <Button variant="danger" size="sm" className="mt-4 w-full">
              Start Attack Simulation
            </Button>
          </Card>

          {/* Protection Flow - asset #23, #21 */}
          <Card glow="green">
            <h3 className="font-semibold mb-4 text-success">PhishGuard Defense (7 Stages)</h3>
            <div className="space-y-3">
              {protectionSteps.map(({ step, title, desc }) => (
                <div key={step} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-success/20 text-success flex items-center justify-center text-xs font-bold shrink-0">
                    {step}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{title}</div>
                    <div className="text-xs text-text-muted">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button size="sm" className="mt-4 w-full">
              <Shield className="w-4 h-4" />
              Try Protection Demo
            </Button>
          </Card>
        </div>

        {/* Fake login mockup reference - asset #20 */}
        <Card>
          <h3 className="font-semibold mb-4">Recognize Fake Login Pages</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-danger/10 border border-danger/30">
              <div className="text-xs text-danger font-medium mb-2">⚠ Suspicious Signs</div>
              <ul className="text-sm space-y-1 text-text-muted">
                <li>• Misspelled domain (paypa1.com)</li>
                <li>• No HTTPS padlock or invalid certificate</li>
                <li>• Urgent language ("Account suspended!")</li>
                <li>• Poor design or broken layout</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-success/10 border border-success/30">
              <div className="text-xs text-success font-medium mb-2">✓ Legitimate Signs</div>
              <ul className="text-sm space-y-1 text-text-muted">
                <li>• Correct domain spelling</li>
                <li>• Valid SSL certificate</li>
                <li>• Consistent branding</li>
                <li>• No pressure tactics</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
