import { cn } from '../lib/utils';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ScoreGauge({ score, size = 160, strokeWidth = 12, className }: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI;
  const progress = Math.min(Math.max(score, 0), 100) / 100;
  const offset = circumference * (1 - progress);

  const getScoreColor = (s: number) => {
    if (s >= 80) return '#10b981';
    if (s >= 60) return '#f59e0b';
    return '#f43f5e';
  };

  const color = getScoreColor(score);

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <svg width={size} height={size / 2 + 10} className="transform -rotate-180">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset="0"
          strokeLinecap="round"
          transform={`translate(${size / 2}, ${size / 2}) rotate(90) translate(${-size / 2}, ${-size / 2})`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`translate(${size / 2}, ${size / 2}) rotate(90) translate(${-size / 2}, ${-size / 2})`}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute bottom-0 flex flex-col items-center">
        <span
          className="font-display font-bold text-4xl tracking-tight"
          style={{ color }}
        >
          {score}
        </span>
        <span className="text-xs text-navy-500">健康评分</span>
      </div>
    </div>
  );
}
