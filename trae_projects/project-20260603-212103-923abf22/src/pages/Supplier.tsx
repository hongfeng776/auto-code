import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  UserX,
  Building2,
  MessageSquare,
  Truck,
  AlertCircle,
  DollarSign,
  Shield,
  HelpCircle,
  Calendar,
  Package,
  ChevronRight,
  User,
} from 'lucide-react'
import { useInventoryStore } from '@/store/useInventoryStore'
import type { Supplier, SkuItem, SupplierCommunication } from '@/types'

function getTypeIcon(type: SupplierCommunication['type']) {
  const icons = {
    order_confirm: MessageSquare,
    delivery_update: Truck,
    delay_notice: AlertCircle,
    price_adjust: DollarSign,
    quality_issue: Shield,
    general: HelpCircle,
  }
  return icons[type]
}

function getTypeColor(type: SupplierCommunication['type']) {
  const colors = {
    order_confirm: 'text-blue-400 bg-blue-500/15',
    delivery_update: 'text-emerald-400 bg-emerald-500/15',
    delay_notice: 'text-red-400 bg-red-500/15',
    price_adjust: 'text-amber-400 bg-amber-500/15',
    quality_issue: 'text-purple-400 bg-purple-500/15',
    general: 'text-gray-400 bg-gray-500/15',
  }
  return colors[type]
}

function getStatusColor(status: SupplierCommunication['status']) {
  const colors = {
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    escalated: 'bg-red-500/20 text-red-400 border-red-500/30',
    resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  }
  return colors[status]
}

function getStatusLabel(status: SupplierCommunication['status']) {
  const labels = {
    pending: '待处理',
    in_progress: '处理中',
    escalated: '已升级',
    resolved: '已解决',
  }
  return labels[status]
}

function getPriorityColor(priority: SupplierCommunication['priority']) {
  const colors = {
    low: 'bg-gray-500/20 text-gray-400',
    medium: 'bg-blue-500/20 text-blue-400',
    high: 'bg-amber-500/20 text-amber-400',
    urgent: 'bg-red-500/20 text-red-400',
  }
  return colors[priority]
}

function getPriorityLabel(priority: SupplierCommunication['priority']) {
  const labels = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急',
  }
  return labels[priority]
}

function statusBadge(status: Supplier['status']) {
  const map = {
    active: { label: '活跃', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    inactive: { label: '停止合作', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    blacklisted: { label: '黑名单', cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
  }
  const s = map[status]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${s.cls}`}>
      {status === 'active' && <CheckCircle2 className="w-3 h-3 mr-1" />}
      {status === 'inactive' && <XCircle className="w-3 h-3 mr-1" />}
      {status === 'blacklisted' && <AlertTriangle className="w-3 h-3 mr-1" />}
      {s.label}
    </span>
  )
}

function onTimeRateColor(rate: number) {
  if (rate > 0.9) return 'text-emerald-400'
  if (rate >= 0.7) return 'text-amber-400'
  return 'text-red-400'
}

function riskBadge(level: SkuItem['riskLevel']) {
  const map = {
    out_of_stock: { label: '断货', cls: 'bg-red-500/20 text-red-400' },
    low: { label: '低库存', cls: 'bg-amber-500/20 text-amber-400' },
    normal: { label: '正常', cls: 'bg-emerald-500/20 text-emerald-400' },
  }
  const s = map[level]
  return <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${s.cls}`}>{s.label}</span>
}

function CommCard({ comm, supplierName }: { comm: SupplierCommunication; supplierName: string }) {
  const TypeIcon = getTypeIcon(comm.type)
  return (
    <div className="bg-dark-700 border border-dark-500 rounded-xl p-4 hover:border-dark-400 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${getTypeColor(comm.type)}`}>
          <TypeIcon className="w-4.5 h-4.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${getStatusColor(comm.status)}`}>
              {getStatusLabel(comm.status)}
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getPriorityColor(comm.priority)}`}>
              {getPriorityLabel(comm.priority)}
            </span>
          </div>
          <h4 className="text-sm font-medium text-gray-200 truncate">{comm.title}</h4>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Building2 className="w-3.5 h-3.5 text-gray-500" />
          <span className="truncate">{supplierName}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5 text-gray-500" />
          <span>{new Date(comm.lastFollowUp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        {comm.expectedDeliveryDate && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-amber-400">预计到货: {comm.expectedDeliveryDate}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function SupplierDetail({ supplier, skuItems, communications }: { supplier: Supplier; skuItems: SkuItem[]; communications: SupplierCommunication[] }) {
  const coveredSkus = useMemo(
    () => skuItems.filter((s) => supplier.coveredSkuIds.includes(s.id)),
    [skuItems, supplier.coveredSkuIds]
  )

  const upcomingFollowUps = useMemo(
    () => communications.filter((c) => c.nextFollowUp && c.status !== 'resolved'),
    [communications]
  )

  return (
    <tr className="bg-dark-800/50">
      <td colSpan={8} className="px-5 py-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                覆盖SKU明细
              </h4>
              <div className="space-y-1.5">
                {coveredSkus.length === 0 && (
                  <p className="text-xs text-gray-500">暂无覆盖SKU</p>
                )}
                {coveredSkus.map((sku) => (
                  <div
                    key={sku.id}
                    className="flex items-center gap-3 bg-dark-700 rounded px-3 py-2 text-xs"
                  >
                    <span className="text-gray-400 font-mono">{sku.skuCode}</span>
                    <span className="text-gray-200 flex-1 truncate">{sku.name}</span>
                    <span className="text-gray-500">库存 {sku.currentStock}</span>
                    {riskBadge(sku.riskLevel)}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                沟通记录时间线
              </h4>
              <div className="space-y-2">
                {communications.length === 0 && (
                  <p className="text-xs text-gray-500">暂无沟通记录</p>
                )}
                {communications.map((comm) => {
                  const TypeIcon = getTypeIcon(comm.type)
                  return (
                    <div key={comm.id} className="bg-dark-700 rounded-lg p-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${getTypeColor(comm.type)}`}>
                          <TypeIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-200">{comm.title}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${getStatusColor(comm.status)}`}>
                              {getStatusLabel(comm.status)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-gray-400">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {comm.contactPerson}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(comm.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {comm.expectedDeliveryDate && (
                              <span className="flex items-center gap-1 text-amber-400">
                                <Calendar className="w-3 h-3" />
                                预计到货: {comm.expectedDeliveryDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-gray-300 mb-2">绩效指标</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">平均交期</span>
                  <span className="text-gray-200 font-medium">{supplier.avgLeadTime} 天</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">准时率</span>
                  <span className={`font-medium ${onTimeRateColor(supplier.onTimeRate)}`}>
                    {(supplier.onTimeRate * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">最近下单</span>
                  <span className="text-gray-200 font-medium">{supplier.lastOrderDate}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">覆盖SKU数</span>
                  <span className="text-gray-200 font-medium">{supplier.coveredSkuIds.length}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-300 mb-2">联系方式</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-300">{supplier.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-300">{supplier.phone}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <a
                    href={`tel:${supplier.phone}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-[11px] font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    拨打电话
                  </a>
                  <Link
                    to="/replenishment"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-[11px] font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 transition-colors"
                  >
                    <Clock className="w-3 h-3" />
                    补货下单
                  </Link>
                </div>
              </div>
            </div>

            {upcomingFollowUps.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  待跟进事项
                </h4>
                <div className="space-y-2">
                  {upcomingFollowUps.map((comm) => (
                    <div key={comm.id} className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                      <div className="text-xs font-medium text-amber-400 mb-0.5">{comm.title}</div>
                      <div className="flex items-center gap-1 text-[10px] text-amber-300/70">
                        <Calendar className="w-3 h-3" />
                        跟进时间: {comm.nextFollowUp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  )
}

export default function Supplier() {
  const suppliers = useInventoryStore((s) => s.suppliers)
  const skuItems = useInventoryStore((s) => s.skuItems)
  const getSkuWithoutSupplier = useInventoryStore((s) => s.getSkuWithoutSupplier)
  const getWarehouseById = useInventoryStore((s) => s.getWarehouseById)
  const getSupplierById = useInventoryStore((s) => s.getSupplierById)
  const getPendingCommunications = useInventoryStore((s) => s.getPendingCommunications)
  const getCommunicationsBySupplier = useInventoryStore((s) => s.getCommunicationsBySupplier)
  const getLatestCommunicationBySupplier = useInventoryStore((s) => s.getLatestCommunicationBySupplier)

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const activeCount = useMemo(() => suppliers.filter((s) => s.status === 'active').length, [suppliers])
  const inactiveCount = useMemo(() => suppliers.filter((s) => s.status === 'inactive').length, [suppliers])
  const blacklistedCount = useMemo(() => suppliers.filter((s) => s.status === 'blacklisted').length, [suppliers])

  const pendingCommunications = useMemo(() => getPendingCommunications(), [getPendingCommunications])

  const filteredSuppliers = useMemo(() => {
    if (!searchTerm.trim()) return suppliers
    const lower = searchTerm.toLowerCase()
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.contactPerson.toLowerCase().includes(lower) ||
        s.phone.includes(searchTerm)
    )
  }, [suppliers, searchTerm])

  const skusWithoutSupplier = useMemo(() => getSkuWithoutSupplier(), [getSkuWithoutSupplier])

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6 space-y-6 fade-in">
      <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-semibold text-gray-200">待处理沟通汇总</h2>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">
            {pendingCommunications.length} 项
          </span>
        </div>
        {pendingCommunications.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">暂无待处理沟通</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pendingCommunications.map((comm) => {
              const supplier = getSupplierById(comm.supplierId)
              return (
                <CommCard
                  key={comm.id}
                  comm={comm}
                  supplierName={supplier?.name || '未知供应商'}
                />
              )
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{activeCount}</div>
              <div className="text-xs text-gray-400">活跃供应商</div>
            </div>
          </div>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <UserX className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{inactiveCount}</div>
              <div className="text-xs text-gray-400">停止合作</div>
            </div>
          </div>
        </div>
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{blacklistedCount}</div>
              <div className="text-xs text-gray-400">黑名单</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-500">
          <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            供应商覆盖矩阵
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索供应商..."
              className="bg-dark-800 border border-dark-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500/50 w-56"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-dark-800 text-gray-400">
                <th className="text-left px-5 py-3 font-medium">供应商</th>
                <th className="text-left px-5 py-3 font-medium">状态</th>
                <th className="text-left px-5 py-3 font-medium">联系人 / 电话</th>
                <th className="text-center px-5 py-3 font-medium">平均交期</th>
                <th className="text-center px-5 py-3 font-medium">准时率</th>
                <th className="text-center px-5 py-3 font-medium">覆盖SKU</th>
                <th className="text-center px-5 py-3 font-medium">最近沟通</th>
                <th className="text-center px-5 py-3 font-medium">预计到货</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((sup) => {
                const latestComm = getLatestCommunicationBySupplier(sup.id)
                const supplierComms = getCommunicationsBySupplier(sup.id)
                return (
                  <>
                    <tr
                      key={sup.id}
                      onClick={() => toggleExpand(sup.id)}
                      className="border-b border-dark-500 hover:bg-dark-700/60 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="font-medium text-gray-200">{sup.name}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">最近下单: {sup.lastOrderDate}</div>
                      </td>
                      <td className="px-5 py-3">{statusBadge(sup.status)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <Users className="w-3 h-3 text-gray-500" />
                          {sup.contactPerson}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 mt-0.5">
                          <Phone className="w-3 h-3 text-gray-500" />
                          {sup.phone}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-gray-300">
                          <Clock className="w-3 h-3 text-gray-500" />
                          {sup.avgLeadTime}天
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`font-semibold ${onTimeRateColor(sup.onTimeRate)}`}>
                          {(sup.onTimeRate * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-dark-600 text-gray-200 text-[11px] font-medium">
                          {sup.coveredSkuIds.length}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        {latestComm ? (
                          <span className="text-gray-300">
                            {new Date(latestComm.lastFollowUp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {latestComm?.expectedDeliveryDate ? (
                          <span className="text-amber-400">{latestComm.expectedDeliveryDate}</span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                    {expandedId === sup.id && (
                      <SupplierDetail
                        key={`${sup.id}-detail`}
                        supplier={sup}
                        skuItems={skuItems}
                        communications={supplierComms}
                      />
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
        {filteredSuppliers.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">未找到匹配的供应商</div>
        )}
      </div>

      {skusWithoutSupplier.length > 0 && (
        <div className="bg-dark-700 border border-red-500/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-base font-semibold text-red-400">无供应商覆盖的SKU</h3>
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
              {skusWithoutSupplier.length} 项
            </span>
          </div>
          <div className="space-y-3">
            {skusWithoutSupplier.map((sku) => {
              const wh = getWarehouseById(sku.warehouseId)
              const hasAnySupplier = sku.supplierIds.length > 0

              return (
                <div
                  key={sku.id}
                  className="bg-dark-800 border border-red-500/20 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500 font-mono">{sku.skuCode}</span>
                        {riskBadge(sku.riskLevel)}
                      </div>
                      <h4 className="text-sm font-semibold text-gray-100">{sku.name}</h4>
                    </div>
                    <Link
                      to="/replenishment"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 transition-colors shrink-0"
                    >
                      补货方案 →
                    </Link>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {wh?.name ?? '未知仓库'}
                    </span>
                    <span>
                      当前库存: <span className={sku.currentStock === 0 ? 'text-red-400 font-bold' : 'text-gray-200'}>{sku.currentStock}</span>
                    </span>
                    <span>安全库存: {sku.safetyStock}</span>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-xs font-semibold text-red-400">寻源建议</span>
                    </div>
                    <p className="text-xs text-red-300/80">
                      {hasAnySupplier
                        ? '已绑定供应商均不可用，需评估替换'
                        : '该SKU未绑定任何供应商，需寻找新供应商'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
