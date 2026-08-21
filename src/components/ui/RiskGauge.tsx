interface RiskGaugeProps {
  score: number;
  size?: 'sm' | 'lg';
}

function getScoreColor(score: number): string {
  if (score <= 30) return '#10b981';
  if (score <= 60) return '#f59e0b';
  return '#ef4444';
}

export function RiskGauge({ score, size = 'lg' }: RiskGaugeProps) {
  const color = getScoreColor(score);
  const radius = size === 'lg' ? 80 : 50;
  const strokeWidth = size === 'lg' ? 12 : 8;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2 + 10;
  const center = svgSize / 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#334155"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={size === 'lg' ? 'text-4xl font-bold' : 'text-2xl font-bold'}
          style={{ color }}
        >
          {score}
        </span>
        {size === 'lg' && (
          <span className="text-text-muted text-xs mt-1">RISK SCORE</span>
        )}
      </div>
    </div>
  );
}
