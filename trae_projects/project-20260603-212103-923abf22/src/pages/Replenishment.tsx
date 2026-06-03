import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  UserX,
  ShoppingCart,
  Filter,
  ArrowLeft,
  Zap,
} from 'lucide-react'
import { useInventoryStore } from '@/store/useInventoryStore'
import type { ReplenishmentSuggestion } from '@/types'

type PriorityFilter = 'all' | 'urgent' | 'high' | 'medium' | 'low'
type StatusFilter = 'all' | 'pending' | 'approved' | 'ordered' | 'delivered'

const priorityColorMap: Record<ReplenishmentSuggestion['priority'], string> = {
  urgent: 'border-l-red-500',
  high: 'border-l-amber-500',
  medium: 'border-l-blue-500',
  low: 'border-l-gray-500',
}

const priorityBgMap: Record<ReplenishmentSuggestion['priority'], string> = {
  urgent: 'bg-red-500/15 text-red-400',
  high: 'bg-amber-500/15 text-amber-400',
  medium: 'bg-blue-500/15 text-blue-400',
  low: 'bg-gray-500/15 text-gray-400',
}

const priorityLabelMap: Record<ReplenishmentSuggestion['priority'], string> = {
  urgent: '紧急',
  high: '高',
  medium: '中',
  low: '低',
}

function StatusActionButton({ suggestion }: { suggestion: ReplenishmentSuggestion }) {
  const updateSuggestionStatus = useInventoryStore((s) => s.updateSuggestionStatus)

  if (suggestion.status === 'pending') {
    return (
      <button
        onClick={() => updateSuggestionStatus(suggestion.id, 'approved')}
        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
      >
        审批
      </button>
    )
  }

  if (suggestion.status === 'approved') {
    return (
      <button
        onClick={() => updateSuggestionStatus(suggestion.id, 'ordered')}
        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
      >
        下单
      </button>
    )
  }

  if (suggestion.status === 'ordered') {
    return (
      <button
        onClick={() => updateSuggestionStatus(suggestion.id, 'delivered')}
        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
      >
        确认到货
      </button>
    )
  }

  return <CheckCircle2 className="w-5 h-5 text-emerald-400" />
}

function SupplierStatusSection({ suggestion }: { suggestion: ReplenishmentSuggestion }) {
  const getSupplierById = useInventoryStore((s) => s.getSupplierById)

  if (suggestion.supplierAvailable && suggestion.supplierId) {
    const supplier = getSupplierById(suggestion.supplierId)
    return (
      <div className="flex items-center gap-3 flex-wrap mt-3 p-3 bg-dark-800/60 rounded-lg border border-dark-500/50">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {supplier?.name ?? suggestion.supplierId}
        </span>
        <span className="text-xs text-gray-400">
          <Clock className="w-3 h-3 inline mr-1" />
          平均交期 {supplier?.avgLeadTime ?? '-'} 天
        </span>
        <span className="text-xs text-gray-400">
          准时率 {supplier ? `${(supplier.onTimeRate * 100).toFixed(0)}%` : '-'}
        </span>
        {suggestion.estimatedArrival && (
          <span className="text-xs text-gray-400">
            <Truck className="w-3 h-3 inline mr-1" />
            预计到货 {suggestion.estimatedArrival}
          </span>
        )}
      </div>
    )
  }

  if (!suggestion.supplierAvailable && suggestion.supplierId) {
    const supplier = getSupplierById(suggestion.supplierId)
    const reason = supplier?.status === 'blacklisted' ? '供应商已被列入黑名单' : '供应商状态异常(未激活)'
    return (
      <div className="flex items-center gap-3 flex-wrap mt-3 p-3 bg-red-500/5 rounded-lg border border-red-500/20">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
          <AlertTriangle className="w-3 h-3" />
          供应商不可用
        </span>
        <span className="text-xs text-red-400/80">
          {supplier?.name ?? suggestion.supplierId} — {reason}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 flex-wrap mt-3 p-3 bg-red-500/5 rounded-lg border border-red-500/20">
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
        <UserX className="w-3 h-3" />
        无可用供应商
      </span>
      <span className="text-xs text-red-400/80">需启动寻源流程</span>
    </div>
  )
}

function SuggestionCard({ suggestion }: { suggestion: ReplenishmentSuggestion }) {
  const navigate = useNavigate()
  const getSkuById = useInventoryStore((s) => s.getSkuById)
  const getWarehouseById = useInventoryStore((s) => s.getWarehouseById)
  const selectedSkuId = useInventoryStore((s) => s.selectedSkuId)
  const lastLinkedFrom = useInventoryStore((s) => s.lastLinkedFrom)
  const setSelectedSkuId = useInventoryStore((s) => s.setSelectedSkuId)

  const sku = getSkuById(suggestion.skuId)
  const warehouse = getWarehouseById(suggestion.warehouseId)
  const isHighlighted = selectedSkuId === suggestion.skuId && lastLinkedFrom === 'sku-risk'

  const handleViewSkuRisk = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedSkuId(suggestion.skuId, 'replenishment')
    navigate('/sku-risk')
  }

  return (
    <div
      data-sku-id={suggestion.skuId}
      className={`bg-dark-700 border border-dark-500 border-l-4 ${priorityColorMap[suggestion.priority]} rounded-lg p-4 transition-all duration-200 hover:bg-dark-600 hover:shadow-lg slide-in ${
        isHighlighted ? 'ring-2 ring-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)] scale-[1.01]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${priorityBgMap[suggestion.priority]}`}>
              {priorityLabelMap[suggestion.priority]}
            </span>
            <span className="text-sm font-semibold text-gray-100">{sku?.name ?? suggestion.skuId}</span>
            <span className="text-xs text-gray-500 font-mono">{sku?.skuCode}</span>
            {isHighlighted && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 animate-pulse">
                <Zap className="w-3 h-3" />
                关联选中
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              {warehouse?.name ?? suggestion.warehouseId}
            </span>
            <span className="flex items-center gap-1">
              <ShoppingCart className="w-3 h-3" />
              建议补货 <span className="text-gray-200 font-medium">{suggestion.suggestedQty}</span> 件
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-2">{suggestion.reason}</p>

          <SupplierStatusSection suggestion={suggestion} />
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <StatusActionButton suggestion={suggestion} />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-dark-500 flex items-center justify-between">
        <button
          onClick={handleViewSkuRisk}
          className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          查看 SKU 风险详情
        </button>
        <span className="text-[10px] text-gray-600">
          状态: {suggestion.status === 'pending' ? '待处理' : suggestion.status === 'approved' ? '已审批' : suggestion.status === 'ordered' ? '已下单' : '已到货'}
        </span>
      </div>
    </div>
  )
}

export default function Replenishment() {
  const navigate = useNavigate()
  const suggestions = useInventoryStore((s) => s.suggestions)
  const updateSuggestionStatus = useInventoryStore((s) => s.updateSuggestionStatus)
  const selectedSkuId = useInventoryStore((s) => s.selectedSkuId)
  const lastLinkedFrom = useInventoryStore((s) => s.lastLinkedFrom)
  const setSelectedSkuId = useInventoryStore((s) => s.setSelectedSkuId)
  const getSkuById = useInventoryStore((s) => s.getSkuById)

  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const linkedSku = selectedSkuId ? getSkuById(selectedSkuId) : null
  const hasLinkedSuggestion = selectedSkuId && lastLinkedFrom === 'sku-risk'

  useEffect(() => {
    if (hasLinkedSuggestion) {
      const timer = setTimeout(() => {
        const element = document.querySelector(`[data-sku-id="${selectedSkuId}"]`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [hasLinkedSuggestion, selectedSkuId])

  const handleClearSelection = () => {
    setSelectedSkuId(null, null)
  }

  const handleBackToSkuRisk = () => {
    navigate('/sku-risk')
  }

  const stats = useMemo(() => ({
    pending: suggestions.filter((s) => s.status === 'pending').length,
    approved: suggestions.filter((s) => s.status === 'approved').length,
    ordered: suggestions.filter((s) => s.status === 'ordered').length,
    delivered: suggestions.filter((s) => s.status === 'delivered').length,
  }), [suggestions])

  const filtered = useMemo(() => {
    let result = suggestions
    if (priorityFilter !== 'all') {
      result = result.filter((s) => s.priority === priorityFilter)
    }
    if (statusFilter !== 'all') {
      result = result.filter((s) => s.status === statusFilter)
    }
    return result
  }, [suggestions, priorityFilter, statusFilter])

  const pendingSuggestions = useMemo(
    () => suggestions.filter((s) => s.status === 'pending'),
    [suggestions]
  )

  const priorityFilters: { key: PriorityFilter; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'urgent', label: '紧急' },
    { key: 'high', label: '高' },
    { key: 'medium', label: '中' },
    { key: 'low', label: '低' },
  ]

  const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待处理' },
    { key: 'approved', label: '已审批' },
    { key: 'ordered', label: '已下单' },
    { key: 'delivered', label: '已到货' },
  ]

  const handleBatchApprove = () => {
    pendingSuggestions.forEach((s) => {
      updateSuggestionStatus(s.id, 'approved')
    })
  }

  const handleBatchOrder = () => {
    suggestions
      .filter((s) => s.status === 'approved')
      .forEach((s) => {
        updateSuggestionStatus(s.id, 'ordered')
      })
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6 pb-24 font-body">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <ShoppingCart className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl font-display font-bold text-gray-100">补货建议</h1>
        </div>
        <p className="text-sm text-gray-500 ml-9">管理库存补货建议与供应商协同</p>
      </div>

      {hasLinkedSuggestion && linkedSku && (
        <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center animate-pulse">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-amber-300">
                从 SKU 风险页联动跳转
              </div>
              <div className="text-xs text-amber-400/70">
                已定位到 <span className="font-semibold text-amber-300">{linkedSku.name}</span> ({linkedSku.skuCode}) 的补货建议
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackToSkuRisk}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-dark-600 text-gray-300 border border-dark-500 hover:bg-dark-500 hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              返回 SKU 风险
            </button>
            <button
              onClick={handleClearSelection}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-dark-600 text-gray-400 border border-dark-500 hover:bg-dark-500 hover:text-gray-200 transition-colors"
            >
              清除选中
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{stats.pending}</div>
              <div className="text-xs text-gray-400">待处理</div>
            </div>
          </div>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{stats.approved}</div>
              <div className="text-xs text-gray-400">已审批</div>
            </div>
          </div>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center">
              <Truck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{stats.ordered}</div>
              <div className="text-xs text-gray-400">已下单</div>
            </div>
          </div>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{stats.delivered}</div>
              <div className="text-xs text-gray-400">已到货</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6 bg-dark-700 rounded-lg p-4 border border-dark-500">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-400">优先级</span>
        </div>
        <div className="flex items-center gap-1 bg-dark-600 rounded-lg p-1">
          {priorityFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setPriorityFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                priorityFilter === f.key
                  ? 'bg-amber-500 text-dark-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-dark-500'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-dark-500" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">状态</span>
        </div>
        <div className="flex items-center gap-1 bg-dark-600 rounded-lg p-1">
          {statusFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                statusFilter === f.key
                  ? 'bg-amber-500 text-dark-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-dark-500'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">暂无匹配的补货建议</div>
        ) : (
          filtered.map((s) => <SuggestionCard key={s.id} suggestion={s} />)
        )}
      </div>

      {pendingSuggestions.length > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-dark-800/95 backdrop-blur-sm border-t border-dark-500 px-6 py-3 z-50">
          <div className="flex items-center justify-between max-w-screen-xl mx-auto">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-gray-200">
                <span className="text-amber-400 font-semibold">{pendingSuggestions.length}</span> 条待处理建议
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBatchApprove}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
              >
                批量审批
              </button>
              <button
                onClick={handleBatchOrder}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
              >
                生成采购单
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
