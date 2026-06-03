export interface Warehouse {
  id: string
  name: string
  location: string
  totalSku: number
  outOfStockSku: number
  lowStockSku: number
  alertSku: number
  capacity: number
  utilization: number
}

export interface SkuItem {
  id: string
  skuCode: string
  name: string
  warehouseId: string
  currentStock: number
  safetyStock: number
  avgDailyConsumption: number
  daysOfSupply: number
  riskLevel: 'out_of_stock' | 'low' | 'normal'
  supplierIds: string[]
  lastReplenished: string
  category: string
}

export interface Supplier {
  id: string
  name: string
  contactPerson: string
  phone: string
  status: 'active' | 'inactive' | 'blacklisted'
  avgLeadTime: number
  onTimeRate: number
  coveredSkuIds: string[]
  lastOrderDate: string
}

export interface ReplenishmentSuggestion {
  id: string
  skuId: string
  warehouseId: string
  suggestedQty: number
  priority: 'urgent' | 'high' | 'medium' | 'low'
  reason: string
  supplierId: string | null
  supplierAvailable: boolean
  estimatedArrival: string | null
  status: 'pending' | 'approved' | 'ordered' | 'delivered'
}

export interface AlertRecord {
  id: string
  type: 'out_of_stock' | 'low_stock' | 'supplier_missing' | 'lead_time_overdue'
  skuId: string
  warehouseId: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  timestamp: string
  resolved: boolean
  actionSuggestion: string
}

export interface SimulationParams {
  safetyStockDays: number
  consumptionMultiplier: number
  alertThreshold: number
  leadTimeBuffer: number
}

export interface TrendDataPoint {
  date: string
  totalStock: number
  alertCount: number
  replenishmentCount: number
  outOfStockCount: number
}
