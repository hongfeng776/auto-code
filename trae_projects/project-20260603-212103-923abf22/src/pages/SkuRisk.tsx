import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Package,
  ShieldAlert,
  Search,
  ArrowRight,
  UserX,
  Zap,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { useInventoryStore } from '@/store/useInventoryStore'
import type { SkuItem } from '@/types'

function hasActiveSupplier(sku: SkuItem, supplierIds: ReturnType<typeof useInventoryStore.getState>['suppliers']): boolean {
  if (sku.supplierIds.length === 0) return false
  return sku.supplierIds.some((sid) => {
    const sup = supplierIds.find((s) => s.id === sid)
    return sup?.status === 'active'
  })
}

function FlowStep({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
        active
          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          : 'bg-dark-500 text-gray-400 border border-dark-400'
      }`}
    >
      {label}
    </span>
  )
}

function FlowArrow() {
  return <ArrowRight className="w-3 h-3 text-dark-400 flex-shrink-0" />
}

function ProcessingLogic({ sku, hasSupplier }: { sku: SkuItem; hasSupplier: boolean }) {
  if (sku.currentStock === 0 && hasSupplier) {
    return (
      <div className="flex items-center gap-1 flex-wrap mt-2">
        <Zap className="w-3 h-3 text-red-400 flex-shrink-0" />
        <span className="text-xs text-red-400 font-medium">紧急补货</span>
        <FlowArrow />
        <FlowStep label="联系供应商" />
        <FlowArrow />
        <FlowStep label="生成采购单" />
        <FlowArrow />
        <FlowStep label="跟踪到货" />
      </div>
    )
  }

  if (sku.currentStock === 0 && !hasSupplier) {
    return (
      <div className="flex items-center gap-1 flex-wrap mt-2">
        <UserX className="w-3 h-3 text-red-400 flex-shrink-0" />
        <span className="text-xs text-red-400 font-medium">寻源流程</span>
        <FlowArrow />
        <FlowStep label="标记无供应商" />
        <FlowArrow />
        <FlowStep label="启动寻源" />
        <FlowArrow />
        <FlowStep label="评估新供应商" />
      </div>
    )
  }

  if (sku.riskLevel === 'low' && hasSupplier) {
    return (
      <div className="flex items-center gap-1.5 mt-2">
        <Package className="w-3 h-3 text-amber-400 flex-shrink-0" />
        <Link
          to="/replenishment"
          className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
        >
          补货建议 →
        </Link>
      </div>
    )
  }

  if (sku.riskLevel === 'low' && !hasSupplier) {
    return (
      <div className="flex items-center gap-1.5 mt-2">
        <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />
        <span className="text-xs px-2 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded font-medium">
          需寻源
        </span>
      </div>
    )
  }

  return null
}

function StockProgressBar({ current, safety }: { current: number; safety: number }) {
  const ratio = safety > 0 ? Math.min(current / safety, 1.5) : 0
  const percentage = Math.min(ratio * 100, 100)
  let barColor = 'bg-emerald-500'
  if (ratio === 0) barColor = 'bg-red-500'
  else if (ratio < 0.5) barColor = 'bg-amber-500'

  return (
    <div className="w-full h-1.5 bg-dark-500 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

function SkuCard({ sku, hasSupplier }: { sku: SkuItem; hasSupplier: boolean }) {
  const riskBorder =
    sku.riskLevel === 'out_of_stock'
      ? 'border-l-red-500'
      : sku.riskLevel === 'low'
      ? 'border-l-amber-500'
      : 'border-l-emerald-500'

  const riskGlow =
    sku.riskLevel === 'out_of_stock'
      ? 'hover:shadow-red-500/10'
      : sku.riskLevel === 'low'
      ? 'hover:shadow-amber-500/10'
      : 'hover:shadow-emerald-500/10'

  return (
    <div
      className={`bg-dark-700 border border-dark-500 border-l-4 ${riskBorder} rounded-lg p-4 transition-all duration-200 hover:bg-dark-600 hover:shadow-lg ${riskGlow} slide-in`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs text-gray-500 font-mono">{sku.skuCode}</span>
          <h4 className="text-sm font-semibold text-gray-100 mt-0.5">{sku.name}</h4>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-dark-500 text-gray-400">{sku.category}</span>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-400">
            库存 <span className={sku.currentStock === 0 ? 'text-red-400 font-bold' : 'text-gray-200'}>{sku.currentStock}</span>
            {' / '}安全库存 {sku.safetyStock}
          </span>
          <span
            className={`font-medium ${
              sku.daysOfSupply <= 2
                ? 'text-red-400'
                : sku.daysOfSupply <= 7
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {sku.daysOfSupply} 天
          </span>
        </div>
        <StockProgressBar current={sku.currentStock} safety={sku.safetyStock} />
      </div>

      <div className="flex items-center gap-1.5 mt-3">
        {hasSupplier ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="text-xs text-emerald-400">有活跃供应商</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            <span className="text-xs text-red-400">无供应商</span>
          </>
        )}
      </div>

      <ProcessingLogic sku={sku} hasSupplier={hasSupplier} />

      <div className="mt-3 pt-3 border-t border-dark-500">
        <Link
          to="/replenishment"
          className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
        >
          查看补货方案
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}

function RiskColumn({
  title,
  icon: Icon,
  skus,
  borderColor,
  bgColor,
  suppliers,
}: {
  title: string
  icon: React.ElementType
  skus: SkuItem[]
  borderColor: string
  bgColor: string
  suppliers: ReturnType<typeof useInventoryStore.getState>['suppliers']
}) {
  return (
    <div className={`flex-1 min-w-0`}>
      <div className={`flex items-center gap-2 mb-4 px-1`}>
        <div className={`p-1.5 rounded ${bgColor}`}>
          <Icon className={`w-4 h-4 ${borderColor}`} />
        </div>
        <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full bg-dark-600 ${borderColor} font-medium`}>
          {skus.length}
        </span>
      </div>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
        {skus.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">暂无数据</div>
        ) : (
          skus.map((sku) => (
            <SkuCard
              key={sku.id}
              sku={sku}
              hasSupplier={hasActiveSupplier(sku, suppliers)}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default function SkuRisk() {
  const {
    warehouses,
    skuItems,
    suppliers,
    selectedWarehouse,
    selectedSkuRiskFilter,
    setSelectedWarehouse,
    setSelectedSkuRiskFilter,
  } = useInventoryStore()

  const filteredSkus = useMemo(() => {
    let result = skuItems
    if (selectedWarehouse) {
      result = result.filter((s) => s.warehouseId === selectedWarehouse)
    }
    if (selectedSkuRiskFilter !== 'all') {
      result = result.filter((s) => s.riskLevel === selectedSkuRiskFilter)
    }
    return result
  }, [skuItems, selectedWarehouse, selectedSkuRiskFilter])

  const outOfStockSkus = useMemo(
    () => filteredSkus.filter((s) => s.riskLevel === 'out_of_stock'),
    [filteredSkus]
  )
  const lowSkus = useMemo(() => filteredSkus.filter((s) => s.riskLevel === 'low'), [filteredSkus])
  const normalSkus = useMemo(
    () => filteredSkus.filter((s) => s.riskLevel === 'normal'),
    [filteredSkus]
  )

  const anomalySkus = useMemo(
    () =>
      outOfStockSkus.filter((sku) => !hasActiveSupplier(sku, suppliers)),
    [outOfStockSkus, suppliers]
  )

  const criticalCount = outOfStockSkus.length
  const showBatchProcessing = criticalCount > 5

  const riskTabs: { key: typeof selectedSkuRiskFilter; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'out_of_stock', label: '断货' },
    { key: 'low', label: '低库存' },
    { key: 'normal', label: '正常' },
  ]

  return (
    <div className="min-h-screen bg-dark-900 p-6 font-body">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <ShieldAlert className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl font-display font-bold text-gray-100">SKU 风险分析</h1>
        </div>
        <p className="text-sm text-gray-500 ml-9">按风险等级查看 SKU 库存状况与处理流程</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6 bg-dark-700 rounded-lg p-4 border border-dark-500">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <select
            value={selectedWarehouse ?? ''}
            onChange={(e) => setSelectedWarehouse(e.target.value || null)}
            className="bg-dark-600 border border-dark-400 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 transition-colors"
          >
            <option value="">全部仓库</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 bg-dark-600 rounded-lg p-1">
          {riskTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedSkuRiskFilter(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                selectedSkuRiskFilter === tab.key
                  ? 'bg-amber-500 text-dark-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-dark-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-5">
        {(selectedSkuRiskFilter === 'all' || selectedSkuRiskFilter === 'out_of_stock') && (
          <RiskColumn
            title="断货"
            icon={AlertTriangle}
            skus={outOfStockSkus}
            borderColor="text-red-400"
            bgColor="bg-red-500/15"
            suppliers={suppliers}
          />
        )}
        {(selectedSkuRiskFilter === 'all' || selectedSkuRiskFilter === 'low') && (
          <RiskColumn
            title="低库存"
            icon={Package}
            skus={lowSkus}
            borderColor="text-amber-400"
            bgColor="bg-amber-500/15"
            suppliers={suppliers}
          />
        )}
        {(selectedSkuRiskFilter === 'all' || selectedSkuRiskFilter === 'normal') && (
          <RiskColumn
            title="正常"
            icon={CheckCircle2}
            skus={normalSkus}
            borderColor="text-emerald-400"
            bgColor="bg-emerald-500/15"
            suppliers={suppliers}
          />
        )}
      </div>

      {anomalySkus.length > 0 && (
        <div className="mt-8">
          <div className="bg-dark-700 border border-red-500/40 rounded-lg p-5 pulse-critical">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h3 className="text-base font-semibold text-red-400">异常处理</h3>
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
                {anomalySkus.length} 项
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              以下 SKU 库存为0且无活跃供应商，需启动寻源流程
            </p>
            <div className="space-y-3">
              {anomalySkus.map((sku) => (
                <div
                  key={sku.id}
                  className="bg-dark-800 border border-dark-500 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs text-gray-500 font-mono">{sku.skuCode}</span>
                      <span className="text-sm text-gray-200 ml-2">{sku.name}</span>
                    </div>
                    <span className="text-xs text-red-400 font-medium">库存: 0</span>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <UserX className="w-3 h-3 text-red-400 flex-shrink-0" />
                    <span className="text-xs text-red-400 font-medium">寻源流程</span>
                    <FlowArrow />
                    <FlowStep label="标记无供应商" active />
                    <FlowArrow />
                    <FlowStep label="启动寻源" />
                    <FlowArrow />
                    <FlowStep label="评估新供应商" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showBatchProcessing && (
        <div className="mt-6">
          <div className="bg-dark-700 border border-amber-500/30 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-semibold text-amber-400">批量处理方案</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              当前有 {criticalCount} 个断货 SKU，建议使用批量处理方案统一管理补货流程
            </p>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>批量生成采购单</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Package className="w-3.5 h-3.5 text-amber-400" />
                <span>统一供应商协商</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>优先级排序</span>
              </div>
            </div>
            <Link
              to="/simulation"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-dark-900 text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors"
            >
              进入模拟推演
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
