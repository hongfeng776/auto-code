import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, AlertTriangle, AlertCircle, CheckCircle, Warehouse } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import { ProgressRing } from '../ui/ProgressRing';

export const WarehouseList: React.FC = () => {
  const { warehouses, selectedWarehouseId, selectWarehouse } = useInventoryStore();

  const getHealthColor = (score: number) => {
    if (score >= 80) return '#2ED573';
    if (score >= 60) return '#FFA502';
    return '#FF4757';
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return '健康';
    if (score >= 60) return '关注';
    return '异常';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-dark-400/50 backdrop-blur-sm rounded-xl border border-dark-200 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Warehouse className="w-5 h-5 text-primary-200" />
          <h2 className="text-lg font-semibold text-white">仓库列表</h2>
        </div>
        <span className="text-xs text-gray-400">共 {warehouses.length} 个仓库</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {warehouses.map((warehouse, index) => (
          <motion.div
            key={warehouse.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onClick={() => selectWarehouse(selectedWarehouseId === warehouse.id ? null : warehouse.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 card-hover ${
              selectedWarehouseId === warehouse.id
                ? 'bg-primary-800/30 border-primary-500/50'
                : 'bg-dark-300/50 border-dark-200 hover:border-primary-600/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <h3 className="font-medium text-white">{warehouse.name}</h3>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{warehouse.location}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-risk-high" />
                    <span className="text-risk-high font-mono">{warehouse.highRiskCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-risk-medium" />
                    <span className="text-risk-medium font-mono">{warehouse.mediumRiskCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-risk-low" />
                    <span className="text-risk-low font-mono">{warehouse.lowRiskCount}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative">
                  <ProgressRing
                    progress={warehouse.healthScore}
                    size={56}
                    strokeWidth={4}
                    color={getHealthColor(warehouse.healthScore)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold font-mono" style={{ color: getHealthColor(warehouse.healthScore) }}>
                      {warehouse.healthScore}
                    </span>
                  </div>
                </div>
                <span className="text-xs mt-1" style={{ color: getHealthColor(warehouse.healthScore) }}>
                  {getHealthStatus(warehouse.healthScore)}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-dark-200 flex items-center justify-between">
              <span className="text-xs text-gray-400">SKU 总数</span>
              <span className="text-sm font-mono text-white">{warehouse.totalSkus}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
