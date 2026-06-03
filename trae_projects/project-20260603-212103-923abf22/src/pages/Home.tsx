import { Link } from 'react-router-dom'
import { Warehouse, AlertTriangle, Package, TrendingUp, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useInventoryStore } from '@/store/useInventoryStore'

function formatTimestamp(ts: string): string {
  const d = new Date(ts)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hour}:${minute}`
}

function getUtilizationColor(utilization: number): string {
  if (utilization > 0.9) return 'bg-red-500'
  if (utilization >= 0.8) return 'bg-amber-500'
  return 'bg-emerald-500'
}

export default function Home() {
  const warehouses = useInventoryStore((s) => s.warehouses)
  const trendData = useInventoryStore((s) => s.trendData)
  const getCriticalAlerts = useInventoryStore((s) => s.getCriticalAlerts)
  const getSkuRiskSummary = useInventoryStore((s) => s.getSkuRiskSummary)
  const getUnresolvedAlerts = useInventoryStore((s) => s.getUnresolvedAlerts)
  const setSelectedWarehouse = useInventoryStore((s) => s.setSelectedWarehouse)
  const setSelectedSkuRiskFilter = useInventoryStore((s) => s.setSelectedSkuRiskFilter)

  const criticalAlerts = getCriticalAlerts()
  const riskSummary = getSkuRiskSummary()
  const unresolvedAlerts = getUnresolvedAlerts().slice(0, 5)

  return (
    <div className="min-h-screen bg-dark-900 p-6 space-y-6 fade-in">
      {criticalAlerts.length > 0 && (
        <Link
          to="/sku-risk"
          className="pulse-critical block rounded-lg bg-red-900/60 border border-red-500/50 px-5 py-3.5 flex items-center justify-between hover:bg-red-900/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-red-100 font-semibold">
              {criticalAlerts.length} 条紧急预警需处理
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-red-400" />
        </Link>
      )}

      <div className="grid grid-cols-5 gap-4">
        {warehouses.map((wh) => (
          <Link
            key={wh.id}
            to="/sku-risk"
            onClick={() => setSelectedWarehouse(wh.id)}
            className="card-glow block bg-dark-700 border border-dark-500 rounded-xl p-4 hover:border-amber-500/40 transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <Warehouse className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-gray-100 truncate">{wh.name}</span>
            </div>
            <div className="text-xs text-gray-400 mb-3">{wh.location}</div>
            <div className="text-xs text-gray-400 mb-2">SKU 总数 <span className="text-gray-200 font-medium">{wh.totalSku}</span></div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500/20 text-red-400">
                断货 {wh.outOfStockSku}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-400">
                低库存 {wh.lowStockSku}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-500/20 text-purple-400">
                预警 {wh.alertSku}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>容量利用率</span>
                <span>{(wh.utilization * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1.5 bg-dark-500 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getUtilizationColor(wh.utilization)}`}
                  style={{ width: `${wh.utilization * 100}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Link
          to="/sku-risk"
          onClick={() => { setSelectedWarehouse(null); setSelectedSkuRiskFilter('out_of_stock') }}
          className="card-glow block bg-dark-700 border border-dark-500 rounded-xl p-5 hover:border-red-500/40 transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{riskSummary.outOfStock}</div>
              <div className="text-xs text-gray-400">断货 SKU</div>
            </div>
          </div>
          <div className="h-1 bg-dark-500 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: '100%' }} />
          </div>
        </Link>

        <Link
          to="/sku-risk"
          onClick={() => { setSelectedWarehouse(null); setSelectedSkuRiskFilter('low') }}
          className="card-glow block bg-dark-700 border border-dark-500 rounded-xl p-5 hover:border-amber-500/40 transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{riskSummary.low}</div>
              <div className="text-xs text-gray-400">低库存 SKU</div>
            </div>
          </div>
          <div className="h-1 bg-dark-500 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '100%' }} />
          </div>
        </Link>

        <Link
          to="/sku-risk"
          onClick={() => { setSelectedWarehouse(null); setSelectedSkuRiskFilter('normal') }}
          className="card-glow block bg-dark-700 border border-dark-500 rounded-xl p-5 hover:border-emerald-500/40 transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{riskSummary.normal}</div>
              <div className="text-xs text-gray-400">正常 SKU</div>
            </div>
          </div>
          <div className="h-1 bg-dark-500 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              最近预警
            </h3>
            <Link to="/sku-risk" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
              查看全部 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {unresolvedAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 py-2 border-b border-dark-500 last:border-b-0">
                {alert.severity === 'critical' ? (
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-200 truncate">{alert.message}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{formatTimestamp(alert.timestamp)}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5 truncate">{alert.actionSuggestion}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              库存趋势
            </h3>
            <Link to="/trends" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
              查看详情 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="alertGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={(v: string) => v.slice(5)}
                  tick={{ fill: '#686880', fontSize: 10 }}
                  axisLine={{ stroke: '#2a2a4a' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#686880', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e1e35',
                    border: '1px solid #2a2a4a',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#e8e8f0',
                  }}
                  labelStyle={{ color: '#9898b0' }}
                />
                <Area
                  type="monotone"
                  dataKey="totalStock"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#stockGradient)"
                  name="总库存"
                />
                <Area
                  type="monotone"
                  dataKey="alertCount"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#alertGradient)"
                  name="预警数"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
