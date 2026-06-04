import { Activity, Clock, TrendingUp, Award } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { EmptyState } from './EmptyState';
import { ScoreGauge } from './ScoreGauge';
import { cn } from '../lib/utils';

const levelConfig = {
  excellent: { label: '优秀', className: 'bg-healthy-100 text-healthy-700 border-healthy-200' },
  good: { label: '良好', className: 'bg-healthy-100 text-healthy-700 border-healthy-200' },
  fair: { label: '一般', className: 'bg-warning-100 text-warning-700 border-warning-200' },
  poor: { label: '较差', className: 'bg-risk-100 text-risk-700 border-risk-200' },
};

export function RiskScore() {
  const { selectedCustomerId, getCurrentRiskScore, getSelectedCustomer } = useAppStore();
  const riskScore = getCurrentRiskScore();
  const customer = getSelectedCustomer();

  if (!selectedCustomerId) {
    return (
      <div className="h-full flex flex-col bg-white rounded-xl shadow-card border border-navy-100">
        <div className="p-4 border-b border-navy-100">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-navy-600" />
            <h2 className="font-display font-semibold text-navy-900">风险评分</h2>
          </div>
        </div>
        <div className="flex-1 p-4">
          <EmptyState type="no-selection" />
        </div>
      </div>
    );
  }

  if (riskScore?.ruleMissing) {
    return (
      <div className="h-full flex flex-col bg-white rounded-xl shadow-card border border-navy-100">
        <div className="p-4 border-b border-navy-100">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-navy-600" />
            <h2 className="font-display font-semibold text-navy-900">风险评分</h2>
          </div>
        </div>
        <div className="flex-1 p-4">
          <EmptyState type="rule-missing" />
        </div>
      </div>
    );
  }

  if (!riskScore) {
    return (
      <div className="h-full flex flex-col bg-white rounded-xl shadow-card border border-navy-100">
        <div className="p-4 border-b border-navy-100">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-navy-600" />
            <h2 className="font-display font-semibold text-navy-900">风险评分</h2>
          </div>
        </div>
        <div className="flex-1 p-4">
          <EmptyState type="no-data" />
        </div>
      </div>
    );
  }

  const level = levelConfig[riskScore.level];

  return (
    <div
      key={selectedCustomerId}
      className="h-full flex flex-col bg-white rounded-xl shadow-card border border-navy-100 animate-fade-in"
    >
      <div className="p-4 border-b border-navy-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-navy-600" />
            <h2 className="font-display font-semibold text-navy-900">风险评分</h2>
          </div>
          <div className="flex items-center gap-1 text-xs text-navy-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{riskScore.lastUpdated}</span>
          </div>
        </div>
        {customer && (
          <div className="mt-2 text-sm text-navy-600">
            <span className="text-navy-400">当前客户：</span>
            <span className="font-medium text-navy-800">{customer.name}</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <ScoreGauge score={riskScore.totalScore} size={180} strokeWidth={14} />
          <div className="flex flex-col items-end gap-2">
            <span className={cn(
              'px-3 py-1 text-sm font-semibold rounded-full border',
              level.className
            )}>
              {level.label}
            </span>
            <div className="flex items-center gap-1 text-xs text-navy-500 mt-2">
              <TrendingUp className="w-4 h-4 text-healthy-500" />
              <span>较上期 +3.2%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-navy-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-navy-500" />
            评分维度详情
          </h3>
          <div className="space-y-3">
            {riskScore.dimensions.map((dim, index) => (
              <div
                key={dim.name}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-navy-700">{dim.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-navy-800">{dim.score}分</span>
                    <span className="text-xs text-navy-400">权重 {Math.round(dim.weight * 100)}%</span>
                  </div>
                </div>
                <div className="h-2 bg-navy-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-700 ease-out',
                      dim.score >= 80 ? 'bg-healthy-500' : dim.score >= 60 ? 'bg-warning-500' : 'bg-risk-500'
                    )}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
