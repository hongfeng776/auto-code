import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, AlertCircle, CheckCircle, Settings, Play, RotateCcw, Clock, Zap, TrendingDown } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const SimulationAlert: React.FC = () => {
  const { 
    skus, 
    alertConfig, 
    updateAlertConfig, 
    simulationResults, 
    runSimulation 
  } = useInventoryStore();
  
  const [simulationDays, setSimulationDays] = useState(7);
  const [consumptionMultiplier, setConsumptionMultiplier] = useState(1.0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    runSimulation(simulationDays, consumptionMultiplier);
  }, [simulationDays, consumptionMultiplier, runSimulation]);

  const currentResult = simulationResults[simulationResults.length - 1];
  const chartData = simulationResults.map((r, i) => ({
    day: `第${r.days}天`,
    stock: r.simulatedStock,
    alertLevel: r.alertLevel,
  }));

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return '#FF4757';
      case 'warning': return '#FFA502';
      default: return '#2ED573';
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getAlertLabel = (level: string) => {
    switch (level) {
      case 'critical': return '严重预警';
      case 'warning': return '注意预警';
      default: return '状态正常';
    }
  };

  const handleReset = () => {
    setSimulationDays(7);
    setConsumptionMultiplier(1.0);
  };

  const estimatedOutOfStock = () => {
    let maxDays = 0;
    skus.forEach(sku => {
      if (sku.avgDailyConsumption > 0) {
        const days = Math.floor(sku.currentStock / (sku.avgDailyConsumption * consumptionMultiplier));
        if (days > maxDays) maxDays = days;
      }
    });
    return maxDays;
  };

  const criticalSkus = skus.filter(sku => {
    const simulatedStock = sku.currentStock - sku.avgDailyConsumption * consumptionMultiplier * simulationDays;
    return simulatedStock <= 0;
  }).length;

  const warningSkus = skus.filter(sku => {
    const simulatedStock = sku.currentStock - sku.avgDailyConsumption * consumptionMultiplier * simulationDays;
    return simulatedStock > 0 && simulatedStock <= sku.safetyStock * 0.5;
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-dark-400/50 backdrop-blur-sm rounded-xl border border-dark-200 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary-200" />
          <h2 className="text-lg font-semibold text-white">本地模拟预警</h2>
        </div>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg transition-all ${
            showSettings 
              ? 'bg-primary-600/30 text-primary-200' 
              : 'text-gray-400 hover:text-white hover:bg-dark-200'
          }`}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-4 p-4 bg-dark-300/50 rounded-lg border border-dark-200">
              <h3 className="text-sm font-medium text-white mb-3">预警阈值配置</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-gray-400">高风险阈值（天）</label>
                    <span className="text-sm font-mono text-risk-high">{alertConfig.highStockThreshold} 天</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={alertConfig.highStockThreshold}
                    onChange={(e) => updateAlertConfig({ highStockThreshold: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-gray-400">中风险阈值（天）</label>
                    <span className="text-sm font-mono text-risk-medium">{alertConfig.mediumStockThreshold} 天</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="14"
                    value={alertConfig.mediumStockThreshold}
                    onChange={(e) => updateAlertConfig({ mediumStockThreshold: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">供应商缺失预警</label>
                  <button
                    onClick={() => updateAlertConfig({ supplierMissingAlert: !alertConfig.supplierMissingAlert })}
                    className={`w-10 h-5 rounded-full transition-all ${
                      alertConfig.supplierMissingAlert ? 'bg-primary-500' : 'bg-dark-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all ${
                      alertConfig.supplierMissingAlert ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {currentResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-lg mb-4 border ${
            currentResult.alertLevel === 'critical'
              ? 'bg-risk-high/10 border-risk-high/50 glow-risk'
              : currentResult.alertLevel === 'warning'
                ? 'bg-risk-medium/10 border-risk-medium/50'
                : 'bg-risk-low/10 border-risk-low/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div 
              className={`p-2 rounded-lg ${
                currentResult.alertLevel === 'critical'
                  ? 'bg-risk-high/20 text-risk-high animate-pulse'
                  : currentResult.alertLevel === 'warning'
                    ? 'bg-risk-medium/20 text-risk-medium'
                    : 'bg-risk-low/20 text-risk-low'
              }`}
            >
              {getAlertIcon(currentResult.alertLevel)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${
                  currentResult.alertLevel === 'critical' ? 'text-risk-high' :
                  currentResult.alertLevel === 'warning' ? 'text-risk-medium' : 'text-risk-low'
                }`}>
                  {getAlertLabel(currentResult.alertLevel)}
                </span>
                {currentResult.alertLevel === 'critical' && (
                  <span className="text-xs text-risk-high animate-bounce">!</span>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-0.5">{currentResult.message}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-dark-300/50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-risk-high" />
            预计断货 SKU
          </div>
          <div className="text-2xl font-mono font-semibold text-risk-high">
            {criticalSkus}
          </div>
        </div>
        
        <div className="bg-dark-300/50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-risk-medium" />
            预警 SKU
          </div>
          <div className="text-2xl font-mono font-semibold text-risk-medium">
            {warningSkus}
          </div>
        </div>
        
        <div className="bg-dark-300/50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-primary-200" />
            预计坚持天数
          </div>
          <div className="text-2xl font-mono font-semibold text-primary-200">
            ~{estimatedOutOfStock()} 天
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary-200" />
              模拟天数
            </label>
            <span className="text-lg font-mono font-semibold text-primary-200">
              {simulationDays} 天
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={simulationDays}
            onChange={(e) => setSimulationDays(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1天</span>
            <span>15天</span>
            <span>30天</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-risk-medium" />
              消耗倍率
            </label>
            <span className="text-lg font-mono font-semibold text-risk-medium">
              {consumptionMultiplier.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={consumptionMultiplier}
            onChange={(e) => setConsumptionMultiplier(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.5x 低销</span>
            <span>1x 正常</span>
            <span>3x 爆单</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={handleReset}
          className="flex-1 py-2 px-4 rounded-lg bg-dark-200 text-gray-300 hover:bg-dark-100 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          重置
        </button>
        <button
          onClick={() => runSimulation(simulationDays, consumptionMultiplier)}
          className="flex-1 py-2 px-4 rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition-colors flex items-center justify-center gap-2 glow-primary"
        >
          <Play className="w-4 h-4" />
          运行模拟
        </button>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="simulationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2B3D" />
            <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F1825',
                border: '1px solid #1F2B3D',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <ReferenceLine 
              y={0} 
              stroke="#FF4757" 
              strokeDasharray="3 3" 
              label={{ value: '断货线', position: 'insideTopRight', fill: '#FF4757', fontSize: 10 }}
            />
            <Line
              type="monotone"
              dataKey="stock"
              name="模拟库存"
              stroke="#00D4AA"
              strokeWidth={2}
              dot={{ fill: '#00D4AA', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: '#00D4AA' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-dark-200 flex items-center justify-between text-xs text-gray-500">
        <span>基于当前库存和消耗速度模拟</span>
        <span>更新时间: {new Date().toLocaleTimeString()}</span>
      </div>
    </motion.div>
  );
};
