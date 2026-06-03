import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, CheckCircle, Package, UserX, ChevronDown, ChevronUp, TrendingDown } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import { Sku } from '../../types';
import { getSupplierById } from '../../data/mockData';

export const SkuRisk: React.FC = () => {
  const { getFilteredSkus, suppliers } = useInventoryStore();
  const [expandedSku, setExpandedSku] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const skus = getFilteredSkus();
  
  const filteredSkus = filter === 'all' 
    ? skus 
    : skus.filter(s => s.riskLevel === filter);

  const highRiskCount = skus.filter(s => s.riskLevel === 'high').length;
  const mediumRiskCount = skus.filter(s => s.riskLevel === 'medium').length;
  const lowRiskCount = skus.filter(s => s.riskLevel === 'low').length;
  const noSupplierCount = skus.filter(s => !s.supplierId).length;

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-risk-high/20 text-risk-high risk-high-pulse">
            <AlertTriangle className="w-3 h-3" />
            高风险
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-risk-medium/20 text-risk-medium">
            <AlertCircle className="w-3 h-3" />
            中风险
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-risk-low/20 text-risk-low">
            <CheckCircle className="w-3 h-3" />
            低风险
          </span>
        );
    }
  };

  const SkuDetail = ({ sku }: { sku: Sku }) => {
    const supplier = getSupplierById(sku.supplierId);
    
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="overflow-hidden"
      >
        <div className="pt-3 pb-2 px-4 bg-dark-500/50 border-t border-dark-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-400 text-xs mb-1">当前库存</div>
              <div className={`font-mono font-semibold ${sku.currentStock === 0 ? 'text-risk-high animate-pulse' : 'text-white'}`}>
                {sku.currentStock} / {sku.safetyStock}
              </div>
              <div className="w-full h-1.5 bg-dark-300 rounded-full mt-1">
                <div 
                  className={`h-full rounded-full transition-all ${
                    sku.currentStock === 0 ? 'bg-risk-high' :
                    sku.currentStock < sku.safetyStock * 0.3 ? 'bg-risk-high' :
                    sku.currentStock < sku.safetyStock ? 'bg-risk-medium' : 'bg-risk-low'
                  }`}
                  style={{ width: `${Math.min(100, (sku.currentStock / sku.safetyStock) * 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">日消耗量</div>
              <div className="font-mono text-white">{sku.avgDailyConsumption} 件/天</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">预计断货</div>
              <div className={`font-mono font-semibold ${
                sku.daysUntilOutOfStock === 0 ? 'text-risk-high' :
                sku.daysUntilOutOfStock <= 3 ? 'text-risk-medium' : 'text-white'
              }`}>
                {sku.daysUntilOutOfStock === 0 ? '已断货' : `${sku.daysUntilOutOfStock} 天后`}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">供应商</div>
              {supplier ? (
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    supplier.status === 'active' ? 'bg-risk-low' :
                    supplier.status === 'warning' ? 'bg-risk-medium' : 'bg-gray-500'
                  }`} />
                  <span className="text-white truncate">{supplier.name}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-risk-high">
                  <UserX className="w-3 h-3" />
                  <span className="text-xs">供应商缺失</span>
                </div>
              )}
            </div>
          </div>
          
          {(!sku.supplierId || sku.currentStock === 0) && (
            <div className="mt-3 p-3 rounded-lg bg-risk-high/10 border border-risk-high/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-risk-high flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-risk-high">
                    {!sku.supplierId && sku.currentStock === 0 
                      ? '紧急：库存已耗尽且无供应商'
                      : !sku.supplierId 
                        ? '警告：该商品无指定供应商' 
                        : '紧急：库存已耗尽'}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {!sku.supplierId 
                      ? '请尽快联系采购部门确认供应商信息，避免持续断货' 
                      : '请立即发起补货申请，确认最快到货时间'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-dark-400/50 backdrop-blur-sm rounded-xl border border-dark-200 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-risk-high" />
          <h2 className="text-lg font-semibold text-white">SKU 风险监控</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs rounded-lg transition-all ${
              filter === 'all' 
                ? 'bg-primary-600/30 text-primary-200 border border-primary-500/50' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-3 py-1 text-xs rounded-lg transition-all ${
              filter === 'high' 
                ? 'bg-risk-high/30 text-risk-high border border-risk-high/50' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            高 ({highRiskCount})
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-3 py-1 text-xs rounded-lg transition-all ${
              filter === 'medium' 
                ? 'bg-risk-medium/30 text-risk-medium border border-risk-medium/50' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            中 ({mediumRiskCount})
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-3 py-1 text-xs rounded-lg transition-all ${
              filter === 'low' 
                ? 'bg-risk-low/30 text-risk-low border border-risk-low/50' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            低 ({lowRiskCount})
          </button>
        </div>
      </div>

      {noSupplierCount > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-risk-medium/10 border border-risk-medium/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserX className="w-4 h-4 text-risk-medium" />
            <span className="text-sm text-risk-medium">
              有 {noSupplierCount} 个 SKU 未指定供应商，请尽快处理
            </span>
          </div>
          <button className="text-xs text-primary-200 hover:text-primary-100 underline">
            查看详情
          </button>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {filteredSkus.map((sku, index) => (
          <motion.div
            key={sku.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`rounded-lg border overflow-hidden transition-all ${
              sku.currentStock === 0 
                ? 'border-risk-high/50 bg-risk-high/5' 
                : sku.riskLevel === 'high' 
                  ? 'border-risk-high/30 bg-dark-300/50' 
                  : 'border-dark-200 bg-dark-300/30'
            }`}
          >
            <div
              onClick={() => setExpandedSku(expandedSku === sku.id ? null : sku.id)}
              className="p-4 cursor-pointer hover:bg-dark-300/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    sku.riskLevel === 'high' ? 'bg-risk-high/20' :
                    sku.riskLevel === 'medium' ? 'bg-risk-medium/20' : 'bg-risk-low/20'
                  }`}>
                    <Package className={`w-5 h-5 ${
                      sku.riskLevel === 'high' ? 'text-risk-high' :
                      sku.riskLevel === 'medium' ? 'text-risk-medium' : 'text-risk-low'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        sku.currentStock === 0 ? 'text-risk-high' : 'text-white'
                      }`}>
                        {sku.name}
                      </span>
                      {sku.currentStock === 0 && (
                        <TrendingDown className="w-4 h-4 text-risk-high animate-bounce" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      <span>{sku.category}</span>
                      <span className="font-mono">ID: {sku.id}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-gray-400">库存</div>
                    <div className={`font-mono font-semibold ${
                      sku.currentStock === 0 ? 'text-risk-high animate-pulse' : 'text-white'
                    }`}>
                      {sku.currentStock}
                    </div>
                  </div>
                  
                  {getRiskBadge(sku.riskLevel)}
                  
                  {expandedSku === sku.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
            
            <AnimatePresence>
              {expandedSku === sku.id && <SkuDetail sku={sku} />}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
