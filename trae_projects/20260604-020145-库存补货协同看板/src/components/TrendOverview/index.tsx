import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Calendar, AlertTriangle, AlertCircle, CheckCircle, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { trendData } from '../../data/mockData';

export const TrendOverview: React.FC = () => {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('7d');

  const chartColors = {
    highRisk: '#FF4757',
    mediumRisk: '#FFA502',
    lowRisk: '#2ED573',
    totalStock: '#00D4AA',
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-400 border border-dark-100 rounded-lg p-3 shadow-xl">
          <p className="text-sm text-gray-300 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
              <span style={{ color: entry.color }}>{entry.name}</span>
              <span className="font-mono text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const riskStats = {
    total: trendData[trendData.length - 1].highRisk + trendData[trendData.length - 1].mediumRisk + trendData[trendData.length - 1].lowRisk,
    high: trendData[trendData.length - 1].highRisk,
    medium: trendData[trendData.length - 1].mediumRisk,
    low: trendData[trendData.length - 1].lowRisk,
    highChange: trendData[trendData.length - 1].highRisk - trendData[trendData.length - 2].highRisk,
    mediumChange: trendData[trendData.length - 1].mediumRisk - trendData[trendData.length - 2].mediumRisk,
    stockChange: trendData[trendData.length - 1].totalStock - trendData[trendData.length - 2].totalStock,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-dark-400/50 backdrop-blur-sm rounded-xl border border-dark-200 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-200" />
          <h2 className="text-lg font-semibold text-white">趋势概览</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-dark-300 rounded-lg p-0.5">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${
                chartType === 'area' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              趋势图
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${
                chartType === 'bar' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              柱状图
            </button>
          </div>
          
          <div className="flex bg-dark-300 rounded-lg p-0.5">
            {(['7d', '14d', '30d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  timeRange === range ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {range === '7d' ? '7天' : range === '14d' ? '14天' : '30天'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="bg-dark-300/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-risk-high" />
            高风险 SKU
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-mono font-semibold text-risk-high">
              {riskStats.high}
            </span>
            <span className={`text-xs ${riskStats.highChange > 0 ? 'text-risk-high' : 'text-risk-low'}`}>
              {riskStats.highChange > 0 ? '+' : ''}{riskStats.highChange}
            </span>
          </div>
        </div>
        
        <div className="bg-dark-300/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-risk-medium" />
            中风险 SKU
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-mono font-semibold text-risk-medium">
              {riskStats.medium}
            </span>
            <span className={`text-xs ${riskStats.mediumChange > 0 ? 'text-risk-high' : 'text-risk-low'}`}>
              {riskStats.mediumChange > 0 ? '+' : ''}{riskStats.mediumChange}
            </span>
          </div>
        </div>
        
        <div className="bg-dark-300/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-risk-low" />
            低风险 SKU
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-mono font-semibold text-risk-low">
              {riskStats.low}
            </span>
            <span className="text-xs text-gray-400">稳定</span>
          </div>
        </div>
        
        <div className="bg-dark-300/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Package className="w-3.5 h-3.5 text-primary-200" />
            总库存量
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-mono font-semibold text-primary-200">
              {(riskStats.stockChange / 1000).toFixed(1)}k
            </span>
            <span className={`text-xs ${riskStats.stockChange < 0 ? 'text-risk-medium' : 'text-risk-low'}`}>
              {riskStats.stockChange > 0 ? '+' : ''}
              {(riskStats.stockChange / 1000).toFixed(1)}k
            </span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="highRiskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.highRisk} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColors.highRisk} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mediumRiskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.mediumRisk} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColors.mediumRisk} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lowRiskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.lowRisk} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColors.lowRisk} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2B3D" />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Area type="monotone" dataKey="highRisk" name="高风险" stroke={chartColors.highRisk} fill="url(#highRiskGradient)" strokeWidth={2} />
              <Area type="monotone" dataKey="mediumRisk" name="中风险" stroke={chartColors.mediumRisk} fill="url(#mediumRiskGradient)" strokeWidth={2} />
              <Area type="monotone" dataKey="lowRisk" name="低风险" stroke={chartColors.lowRisk} fill="url(#lowRiskGradient)" strokeWidth={2} />
            </AreaChart>
          ) : (
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2B3D" />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Bar dataKey="highRisk" name="高风险" fill={chartColors.highRisk} radius={[4, 4, 0, 0]} />
              <Bar dataKey="mediumRisk" name="中风险" fill={chartColors.mediumRisk} radius={[4, 4, 0, 0]} />
              <Bar dataKey="lowRisk" name="低风险" fill={chartColors.lowRisk} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-dark-200">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.totalStock} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={chartColors.totalStock} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2B3D" />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="totalStock" 
                name="总库存量" 
                stroke={chartColors.totalStock} 
                fill="url(#stockGradient)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};
