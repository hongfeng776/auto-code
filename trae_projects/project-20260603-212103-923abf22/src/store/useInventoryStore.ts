import { create } from 'zustand'
import type { Warehouse, SkuItem, Supplier, ReplenishmentSuggestion, AlertRecord, SimulationParams, TrendDataPoint, SupplierCommunication } from '@/types'
import { warehouses as initWarehouses, skuItems as initSkuItems, suppliers as initSuppliers, replenishmentSuggestions as initSuggestions, alertRecords as initAlerts, trendData as initTrendData, supplierCommunications as initCommunications } from '@/data/mockData'

interface InventoryState {
  warehouses: Warehouse[]
  skuItems: SkuItem[]
  suppliers: Supplier[]
  suggestions: ReplenishmentSuggestion[]
  alerts: AlertRecord[]
  trendData: TrendDataPoint[]
  communications: SupplierCommunication[]
  simulationParams: SimulationParams
  simulationResults: AlertRecord[]
  simulationRun: boolean
  selectedWarehouse: string | null
  selectedSkuRiskFilter: 'all' | 'out_of_stock' | 'low' | 'normal'
  selectedSkuId: string | null
  lastLinkedFrom: 'sku-risk' | 'replenishment' | null

  setSelectedWarehouse: (id: string | null) => void
  setSelectedSkuRiskFilter: (filter: 'all' | 'out_of_stock' | 'low' | 'normal') => void
  setSelectedSkuId: (id: string | null, from?: 'sku-risk' | 'replenishment' | null) => void
  resolveAlert: (id: string) => void
  updateSuggestionStatus: (id: string, status: ReplenishmentSuggestion['status']) => void
  addCommunication: (comm: Omit<SupplierCommunication, 'id'>) => void
  updateCommunicationStatus: (id: string, status: SupplierCommunication['status']) => void
  runSimulation: (params: SimulationParams) => void
  getWarehouseById: (id: string) => Warehouse | undefined
  getSkuById: (id: string) => SkuItem | undefined
  getSupplierById: (id: string) => Supplier | undefined
  getSkusByWarehouse: (warehouseId: string) => SkuItem[]
  getAlertsByWarehouse: (warehouseId: string) => AlertRecord[]
  getSuggestionsByWarehouse: (warehouseId: string) => ReplenishmentSuggestion[]
  getSuggestionsBySku: (skuId: string) => ReplenishmentSuggestion[]
  getCommunicationsBySupplier: (supplierId: string) => SupplierCommunication[]
  getCommunicationsBySku: (skuId: string) => SupplierCommunication[]
  getPendingCommunications: () => SupplierCommunication[]
  getLatestCommunicationBySupplier: (supplierId: string) => SupplierCommunication | undefined
  getSkuRiskSummary: () => { outOfStock: number; low: number; normal: number }
  getUnresolvedAlerts: () => AlertRecord[]
  getCriticalAlerts: () => AlertRecord[]
  getSupplierForSku: (skuId: string) => Supplier[]
  getSkuWithoutSupplier: () => SkuItem[]
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  warehouses: initWarehouses,
  skuItems: initSkuItems,
  suppliers: initSuppliers,
  suggestions: initSuggestions,
  alerts: initAlerts,
  trendData: initTrendData,
  communications: initCommunications,
  simulationParams: {
    safetyStockDays: 7,
    consumptionMultiplier: 1.0,
    alertThreshold: 10,
    leadTimeBuffer: 2,
  },
  simulationResults: [],
  simulationRun: false,
  selectedWarehouse: null,
  selectedSkuRiskFilter: 'all',
  selectedSkuId: null,
  lastLinkedFrom: null,

  setSelectedWarehouse: (id) => set({ selectedWarehouse: id }),
  setSelectedSkuRiskFilter: (filter) => set({ selectedSkuRiskFilter: filter }),
  setSelectedSkuId: (id, from = null) => set({ selectedSkuId: id, lastLinkedFrom: from }),

  resolveAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, resolved: true } : a)),
    })),

  updateSuggestionStatus: (id, status) =>
    set((state) => ({
      suggestions: state.suggestions.map((s) => (s.id === id ? { ...s, status } : s)),
    })),

  addCommunication: (comm) =>
    set((state) => ({
      communications: [
        { ...comm, id: `comm-${Date.now()}` },
        ...state.communications,
      ],
    })),

  updateCommunicationStatus: (id, status) =>
    set((state) => ({
      communications: state.communications.map((c) =>
        c.id === id ? { ...c, status, lastFollowUp: new Date().toISOString() } : c
      ),
    })),

  runSimulation: (params) => {
    const { skuItems, suppliers, warehouses } = get()
    const results: AlertRecord[] = []
    let altCounter = 1000

    for (const sku of skuItems) {
      const adjustedSafetyStock = sku.avgDailyConsumption * params.safetyStockDays
      const adjustedConsumption = sku.avgDailyConsumption * params.consumptionMultiplier
      const adjustedDaysOfSupply = sku.currentStock / Math.max(adjustedConsumption, 1)

      if (sku.currentStock === 0) {
        const supplierList = sku.supplierIds
          .map((sid) => suppliers.find((s) => s.id === sid))
          .filter((s): s is Supplier => !!s)
        const hasActiveSupplier = supplierList.some((s) => s.status === 'active')
        results.push({
          id: `sim-alt-${altCounter++}`,
          type: 'out_of_stock',
          skuId: sku.id,
          warehouseId: sku.warehouseId,
          severity: 'critical',
          message: `[模拟] ${sku.name} 库存为0${hasActiveSupplier ? '' : '，无可用供应商'}`,
          timestamp: new Date().toISOString(),
          resolved: false,
          actionSuggestion: hasActiveSupplier
            ? `立即联系供应商紧急补货，建议量 ${Math.ceil(adjustedSafetyStock * 2)} 件`
            : '启动紧急寻源流程，联系备选供应商',
        })
      } else if (adjustedDaysOfSupply < params.safetyStockDays + params.leadTimeBuffer) {
        const supplierList = sku.supplierIds
          .map((sid) => suppliers.find((s) => s.id === sid))
          .filter((s): s is Supplier => !!s)
        const hasActiveSupplier = supplierList.some((s) => s.status === 'active')

        if (sku.supplierIds.length === 0 || !hasActiveSupplier) {
          results.push({
            id: `sim-alt-${altCounter++}`,
            type: 'supplier_missing',
            skuId: sku.id,
            warehouseId: sku.warehouseId,
            severity: 'critical',
            message: `[模拟] ${sku.name} 供应商缺失或不可用`,
            timestamp: new Date().toISOString(),
            resolved: false,
            actionSuggestion: '启动寻源流程，评估新供应商',
          })
        } else {
          results.push({
            id: `sim-alt-${altCounter++}`,
            type: 'low_stock',
            skuId: sku.id,
            warehouseId: sku.warehouseId,
            severity: adjustedDaysOfSupply < 3 ? 'critical' : 'warning',
            message: `[模拟] ${sku.name} 仅剩 ${adjustedDaysOfSupply.toFixed(1)} 天库存`,
            timestamp: new Date().toISOString(),
            resolved: false,
            actionSuggestion: `建议补货 ${Math.ceil(adjustedSafetyStock * 1.5 - sku.currentStock)} 件`,
          })
        }
      }

      const supplierList = sku.supplierIds
        .map((sid) => suppliers.find((s) => s.id === sid))
        .filter((s): s is Supplier => !!s)
      for (const sup of supplierList) {
        if (sup.status === 'inactive' || sup.status === 'blacklisted') {
          results.push({
            id: `sim-alt-${altCounter++}`,
            type: 'lead_time_overdue',
            skuId: sku.id,
            warehouseId: sku.warehouseId,
            severity: 'warning',
            message: `[模拟] ${sku.name} 供应商「${sup.name}」状态异常(${sup.status})`,
            timestamp: new Date().toISOString(),
            resolved: false,
            actionSuggestion: '评估替换供应商或恢复合作关系',
          })
        }
      }
    }

    set({
      simulationParams: params,
      simulationResults: results,
      simulationRun: true,
    })
  },

  getWarehouseById: (id) => get().warehouses.find((w) => w.id === id),
  getSkuById: (id) => get().skuItems.find((s) => s.id === id),
  getSupplierById: (id) => get().suppliers.find((s) => s.id === id),
  getSkusByWarehouse: (warehouseId) => get().skuItems.filter((s) => s.warehouseId === warehouseId),
  getAlertsByWarehouse: (warehouseId) => get().alerts.filter((a) => a.warehouseId === warehouseId),
  getSuggestionsByWarehouse: (warehouseId) => get().suggestions.filter((s) => s.warehouseId === warehouseId),
  getSuggestionsBySku: (skuId) => get().suggestions.filter((s) => s.skuId === skuId),
  getCommunicationsBySupplier: (supplierId) =>
    get()
      .communications.filter((c) => c.supplierId === supplierId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  getCommunicationsBySku: (skuId) =>
    get()
      .communications.filter((c) => c.skuId === skuId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  getPendingCommunications: () =>
    get()
      .communications.filter((c) => c.status === 'pending' || c.status === 'in_progress' || c.status === 'escalated')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  getLatestCommunicationBySupplier: (supplierId) => {
    const comms = get().communications.filter((c) => c.supplierId === supplierId)
    if (comms.length === 0) return undefined
    return comms.sort((a, b) => new Date(b.lastFollowUp).getTime() - new Date(a.lastFollowUp).getTime())[0]
  },

  getSkuRiskSummary: () => {
    const skus = get().skuItems
    return {
      outOfStock: skus.filter((s) => s.riskLevel === 'out_of_stock').length,
      low: skus.filter((s) => s.riskLevel === 'low').length,
      normal: skus.filter((s) => s.riskLevel === 'normal').length,
    }
  },

  getUnresolvedAlerts: () => get().alerts.filter((a) => !a.resolved),
  getCriticalAlerts: () => get().alerts.filter((a) => !a.resolved && a.severity === 'critical'),

  getSupplierForSku: (skuId) => {
    const sku = get().skuItems.find((s) => s.id === skuId)
    if (!sku) return []
    return sku.supplierIds
      .map((sid) => get().suppliers.find((s) => s.id === sid))
      .filter((s): s is Supplier => !!s)
  },

  getSkuWithoutSupplier: () => {
    return get().skuItems.filter((sku) => {
      if (sku.supplierIds.length === 0) return true
      const activeSuppliers = sku.supplierIds
        .map((sid) => get().suppliers.find((s) => s.id === sid))
        .filter((s): s is Supplier => !!s && s.status === 'active')
      return activeSuppliers.length === 0
    })
  },
}))
