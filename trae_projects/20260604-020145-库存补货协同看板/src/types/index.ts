export interface Warehouse {
  id: string;
  name: string;
  location: string;
  healthScore: number;
  totalSkus: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
}

export interface Sku {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  safetyStock: number;
  avgDailyConsumption: number;
  warehouseId: string;
  supplierId: string | null;
  riskLevel: 'high' | 'medium' | 'low';
  lastRestockDate: string;
  daysUntilOutOfStock: number;
  unitPrice: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  status: 'active' | 'inactive' | 'warning';
  deliveryRate: number;
  avgDeliveryDays: number;
  pendingOrders: number;
  lastDeliveryDate: string;
  totalSkus: number;
}

export interface ReplenishmentSuggestion {
  id: string;
  skuId: string;
  skuName: string;
  category: string;
  suggestedQuantity: number;
  priority: 'urgent' | 'high' | 'normal';
  estimatedCost: number;
  expectedDelivery: string;
  reason: string;
  supplierId: string | null;
  supplierName: string | null;
  currentStock: number;
}

export interface InventoryLog {
  date: string;
  stockLevel: number;
}

export interface AlertConfig {
  highStockThreshold: number;
  mediumStockThreshold: number;
  supplierMissingAlert: boolean;
  maxAlertsBeforeBatch: number;
}

export interface TrendData {
  date: string;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  totalStock: number;
}

export interface SimulationResult {
  days: number;
  simulatedStock: number;
  alertLevel: 'normal' | 'warning' | 'critical';
  message: string;
}
