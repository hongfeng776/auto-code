import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Bell, RefreshCw, User, Settings, Clock } from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';

export const Header: React.FC = () => {
  const { skus, suggestions } = useInventoryStore();
  
  const highRiskCount = skus.filter(s => s.riskLevel === 'high').length;
  const urgentSuggestions = suggestions.filter(s => s.priority === 'urgent').length;
  const totalAlerts = highRiskCount + urgentSuggestions;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-dark-400/80 backdrop-blur-md border-b border-dark-200 sticky top-0 z-50"
    >
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-200" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">库存补货协同看板</h1>
                <p className="text-xs text-gray-400">Inventory Replenishment Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-300/50 rounded-lg">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300 font-mono">
                {new Date().toLocaleString('zh-CN')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-lg bg-dark-300/50 text-gray-400 hover:text-white hover:bg-dark-200 transition-all">
                <Bell className="w-5 h-5" />
                {totalAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-risk-high text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {totalAlerts}
                  </span>
                )}
              </button>
              
              <button className="p-2 rounded-lg bg-dark-300/50 text-gray-400 hover:text-white hover:bg-dark-200 transition-all">
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <button className="p-2 rounded-lg bg-dark-300/50 text-gray-400 hover:text-white hover:bg-dark-200 transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="h-8 w-px bg-dark-200" />

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-white">运营管理员</div>
                <div className="text-xs text-gray-400">供应链运营部</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-600/30 flex items-center justify-center border border-primary-500/50">
                <User className="w-5 h-5 text-primary-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">高风险 SKU:</span>
            <span className={`font-mono font-semibold ${highRiskCount > 0 ? 'text-risk-high' : 'text-risk-low'}`}>
              {highRiskCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">紧急补货:</span>
            <span className={`font-mono font-semibold ${urgentSuggestions > 0 ? 'text-risk-high' : 'text-risk-low'}`}>
              {urgentSuggestions}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">总 SKU 数:</span>
            <span className="font-mono font-semibold text-white">{skus.length}</span>
          </div>
          <div className="flex-1" />
          <div className="text-xs text-gray-500">
            数据每 5 分钟自动刷新 · 上次更新: 刚刚
          </div>
        </div>
      </div>
    </motion.header>
  );
};
