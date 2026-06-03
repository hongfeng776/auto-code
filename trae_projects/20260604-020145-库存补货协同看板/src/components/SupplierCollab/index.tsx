import React from 'react';
import { motion } from 'framer-motion';
import { Users, Phone, Clock, Package, AlertTriangle, CheckCircle, XCircle, ChevronRight, MessageSquare } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import { ProgressRing } from '../ui/ProgressRing';

export const SupplierCollab: React.FC = () => {
  const { suppliers, skus } = useInventoryStore();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-risk-low/20 text-risk-low">
            <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
            正常
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-risk-medium/20 text-risk-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-risk-medium animate-pulse" />
            关注
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-600/30 text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            停用
          </span>
        );
    }
  };

  const getDeliveryRateColor = (rate: number) => {
    if (rate >= 90) return '#2ED573';
    if (rate >= 75) return '#FFA502';
    return '#FF4757';
  };

  const activeSuppliers = suppliers.filter(s => s.status !== 'inactive');
  const warningSuppliers = suppliers.filter(s => s.status === 'warning');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-dark-400/50 backdrop-blur-sm rounded-xl border border-dark-200 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-200" />
          <h2 className="text-lg font-semibold text-white">供应商协同</h2>
        </div>
        
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-risk-low">
            <CheckCircle className="w-3.5 h-3.5" />
            正常 {activeSuppliers.length - warningSuppliers.length}
          </span>
          <span className="flex items-center gap-1 text-risk-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            关注 {warningSuppliers.length}
          </span>
          <span className="flex items-center gap-1 text-gray-400">
            <XCircle className="w-3.5 h-3.5" />
            停用 {suppliers.filter(s => s.status === 'inactive').length}
          </span>
        </div>
      </div>

      {warningSuppliers.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-risk-medium/10 border border-risk-medium/30">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-risk-medium flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-risk-medium">
                {warningSuppliers.length} 个供应商需要关注
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {warningSuppliers.map(s => s.name).join('、')} 交付及时率偏低
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {suppliers.map((supplier, index) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.08 }}
            className={`p-4 rounded-lg border transition-all cursor-pointer card-hover ${
              supplier.status === 'warning'
                ? 'bg-risk-medium/5 border-risk-medium/30'
                : supplier.status === 'inactive'
                  ? 'bg-dark-300/30 border-dark-200 opacity-60'
                  : 'bg-dark-300/50 border-dark-200 hover:border-primary-600/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <ProgressRing
                    progress={supplier.deliveryRate}
                    size={56}
                    strokeWidth={4}
                    color={getDeliveryRateColor(supplier.deliveryRate)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span 
                      className="text-sm font-semibold font-mono"
                      style={{ color: getDeliveryRateColor(supplier.deliveryRate) }}
                    >
                      {supplier.deliveryRate}%
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{supplier.name}</h3>
                    {getStatusBadge(supplier.status)}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{supplier.contact} · {supplier.phone}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Package className="w-3 h-3" />
                      <span>供应 SKU: <span className="text-white font-mono">{supplier.totalSkus}</span></span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>平均交付: <span className="text-white font-mono">{supplier.avgDeliveryDays} 天</span></span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <MessageSquare className="w-3 h-3" />
                      <span>待处理: <span className={`font-mono ${
                        supplier.pendingOrders > 8 ? 'text-risk-high' : 
                        supplier.pendingOrders > 4 ? 'text-risk-medium' : 'text-white'
                      }`}>{supplier.pendingOrders} 单</span></span>
                    </div>
                  </div>
                </div>
              </div>
              
              <ChevronRight className="w-4 h-4 text-gray-500 mt-6" />
            </div>
            
            {supplier.status === 'warning' && (
              <div className="mt-3 pt-3 border-t border-risk-medium/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-risk-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>交付及时率偏低，建议跟进</span>
                  </div>
                  <button className="text-xs text-primary-200 hover:text-primary-100 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    发送提醒
                  </button>
                </div>
              </div>
            )}
            
            {supplier.status === 'inactive' && (
              <div className="mt-3 pt-3 border-t border-dark-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>该供应商已停用，上次合作: {supplier.lastDeliveryDate}</span>
                  </div>
                  <button className="text-xs text-primary-200 hover:text-primary-100">
                    重新启用
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-dark-200 flex items-center justify-between">
        <span className="text-sm text-gray-400">共 {suppliers.length} 个供应商</span>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">
            平均交付及时率: <span className="text-risk-low font-mono">
              {Math.round(suppliers.reduce((acc, s) => acc + s.deliveryRate, 0) / suppliers.length)}%
            </span>
          </span>
          <span className="text-gray-400">
            待处理订单: <span className="text-risk-medium font-mono">
              {suppliers.reduce((acc, s) => acc + s.pendingOrders, 0)} 单
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};
