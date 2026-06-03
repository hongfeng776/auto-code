import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, AlertTriangle, Check, ChevronRight, DollarSign, Clock, UserX, Layers } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';

export const Replenishment: React.FC = () => {
  const { 
    suggestions, 
    batchMode, 
    selectedSuggestions, 
    toggleBatchMode, 
    toggleSuggestion,
    selectAllSuggestions,
    clearSelectedSuggestions,
    alertConfig
  } = useInventoryStore();

  const urgentCount = suggestions.filter(s => s.priority === 'urgent').length;
  const highCount = suggestions.filter(s => s.priority === 'high').length;
  const normalCount = suggestions.filter(s => s.priority === 'normal').length;
  const noSupplierCount = suggestions.filter(s => !s.supplierId).length;
  
  const totalCost = suggestions.reduce((acc, s) => acc + s.estimatedCost, 0);
  const selectedCost = suggestions
    .filter(s => selectedSuggestions.includes(s.id))
    .reduce((acc, s) => acc + s.estimatedCost, 0);

  const showBatchWarning = suggestions.length >= alertConfig.maxAlertsBeforeBatch;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-risk-high/20 text-risk-high animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            紧急
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-risk-medium/20 text-risk-medium">
            <Clock className="w-3 h-3" />
            高优
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-700/30 text-primary-200">
            普通
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-dark-400/50 backdrop-blur-sm rounded-xl border border-dark-200 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary-200" />
          <h2 className="text-lg font-semibold text-white">补货建议</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-risk-high">紧急 {urgentCount}</span>
            <span className="text-gray-500">|</span>
            <span className="text-risk-medium">高优 {highCount}</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">普通 {normalCount}</span>
          </div>
          
          <button
            onClick={toggleBatchMode}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1 ${
              batchMode 
                ? 'bg-primary-600 text-white' 
                : 'bg-dark-200 text-gray-300 hover:bg-dark-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            批量处理
          </button>
        </div>
      </div>

      {showBatchWarning && !batchMode && (
        <div className="mb-4 p-3 rounded-lg bg-risk-medium/10 border border-risk-medium/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-risk-medium" />
            <span className="text-sm text-risk-medium">
              预警数量较多（{suggestions.length} 条），建议使用批量处理功能
            </span>
          </div>
          <button
            onClick={toggleBatchMode}
            className="text-xs text-primary-200 hover:text-primary-100 underline"
          >
            开启批量模式
          </button>
        </div>
      )}

      {noSupplierCount > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-risk-high/10 border border-risk-high/30 flex items-center gap-2">
          <UserX className="w-4 h-4 text-risk-high" />
          <span className="text-sm text-risk-high">
            有 {noSupplierCount} 个商品供应商缺失，需先确认供应商信息
          </span>
        </div>
      )}

      {batchMode && (
        <div className="mb-4 p-3 rounded-lg bg-primary-800/20 border border-primary-600/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-200">
              已选择 {selectedSuggestions.length} / {suggestions.length} 项
            </span>
            <span className="text-sm text-gray-400">
              预计成本：<span className="text-white font-mono">¥{selectedCost.toLocaleString()}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={selectAllSuggestions}
              className="px-3 py-1 text-xs rounded bg-dark-200 text-gray-300 hover:bg-dark-100 transition-colors"
            >
              全选
            </button>
            <button
              onClick={clearSelectedSuggestions}
              className="px-3 py-1 text-xs rounded bg-dark-200 text-gray-300 hover:bg-dark-100 transition-colors"
            >
              清空
            </button>
            <button className="px-4 py-1 text-xs rounded bg-primary-600 text-white hover:bg-primary-500 transition-colors">
              生成采购单
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              selectedSuggestions.includes(suggestion.id)
                ? 'bg-primary-800/30 border-primary-500/50'
                : suggestion.priority === 'urgent'
                  ? 'bg-risk-high/5 border-risk-high/30 hover:border-risk-high/50'
                  : 'bg-dark-300/30 border-dark-200 hover:border-primary-600/50'
            }`}
            onClick={() => batchMode && toggleSuggestion(suggestion.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {batchMode && (
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                    selectedSuggestions.includes(suggestion.id)
                      ? 'bg-primary-500 border-primary-400'
                      : 'border-dark-100'
                  }`}>
                    {selectedSuggestions.includes(suggestion.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                )}
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{suggestion.skuName}</span>
                    {getPriorityBadge(suggestion.priority)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span>{suggestion.category}</span>
                    <span>·</span>
                    {suggestion.supplierName ? (
                      <span>供应商: {suggestion.supplierName}</span>
                    ) : (
                      <span className="text-risk-high flex items-center gap-1">
                        <UserX className="w-3 h-3" />
                        供应商缺失
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-gray-400">建议补货</div>
                  <div className="font-mono text-white">
                    {suggestion.suggestedQuantity} 件
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xs text-gray-400">当前库存</div>
                  <div className={`font-mono ${
                    suggestion.currentStock === 0 ? 'text-risk-high' : 'text-white'
                  }`}>
                    {suggestion.currentStock} 件
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xs text-gray-400 flex items-center justify-end gap-1">
                    <DollarSign className="w-3 h-3" />
                    预计成本
                  </div>
                  <div className="font-mono text-primary-200">
                    ¥{suggestion.estimatedCost.toLocaleString()}
                  </div>
                </div>
                
                {!batchMode && (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </div>
            
            <div className="mt-2 pt-2 border-t border-dark-200 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                原因：{suggestion.reason}
              </span>
              <span className="text-xs text-gray-500">
                预计到货：{suggestion.expectedDelivery}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-dark-200 flex items-center justify-between">
        <span className="text-sm text-gray-400">共 {suggestions.length} 条建议</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">预计总采购成本：</span>
          <span className="text-lg font-semibold font-mono text-primary-200">
            ¥{totalCost.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
