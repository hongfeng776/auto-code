import { Warehouse, Sku, Supplier, ReplenishmentSuggestion, TrendData } from '../types';

export const warehouses: Warehouse[] = [
  {
    id: 'wh-001',
    name: '华东仓储中心',
    location: '上海',
    healthScore: 78,
    totalSkus: 256,
    highRiskCount: 12,
    mediumRiskCount: 28,
    lowRiskCount: 216,
  },
  {
    id: 'wh-002',
    name: '华南仓储中心',
    location: '广州',
    healthScore: 85,
    totalSkus: 189,
    highRiskCount: 6,
    mediumRiskCount: 15,
    lowRiskCount: 168,
  },
  {
    id: 'wh-003',
    name: '华北仓储中心',
    location: '北京',
    healthScore: 62,
    totalSkus: 312,
    highRiskCount: 25,
    mediumRiskCount: 42,
    lowRiskCount: 245,
  },
  {
    id: 'wh-004',
    name: '西南仓储中心',
    location: '成都',
    healthScore: 91,
    totalSkus: 145,
    highRiskCount: 3,
    mediumRiskCount: 8,
    lowRiskCount: 134,
  },
];

export const suppliers: Supplier[] = [
  {
    id: 'sup-001',
    name: '优品供应链',
    contact: '张经理',
    phone: '138****5678',
    status: 'active',
    deliveryRate: 96,
    avgDeliveryDays: 2,
    pendingOrders: 5,
    lastDeliveryDate: '2026-06-03',
    totalSkus: 45,
  },
  {
    id: 'sup-002',
    name: '盛达电子',
    contact: '李总监',
    phone: '139****1234',
    status: 'warning',
    deliveryRate: 72,
    avgDeliveryDays: 5,
    pendingOrders: 12,
    lastDeliveryDate: '2026-05-28',
    totalSkus: 28,
  },
  {
    id: 'sup-003',
    name: '恒远商贸',
    contact: '王主管',
    phone: '137****9876',
    status: 'active',
    deliveryRate: 89,
    avgDeliveryDays: 3,
    pendingOrders: 8,
    lastDeliveryDate: '2026-06-02',
    totalSkus: 62,
  },
  {
    id: 'sup-004',
    name: '鑫源科技',
    contact: '赵经理',
    phone: '136****5432',
    status: 'inactive',
    deliveryRate: 55,
    avgDeliveryDays: 8,
    pendingOrders: 3,
    lastDeliveryDate: '2026-05-15',
    totalSkus: 15,
  },
  {
    id: 'sup-005',
    name: '华丰物流',
    contact: '陈总',
    phone: '135****8765',
    status: 'active',
    deliveryRate: 94,
    avgDeliveryDays: 2,
    pendingOrders: 6,
    lastDeliveryDate: '2026-06-03',
    totalSkus: 38,
  },
];

export const skus: Sku[] = [
  {
    id: 'sku-001',
    name: '无线蓝牙耳机 Pro',
    category: '电子产品',
    currentStock: 0,
    safetyStock: 50,
    avgDailyConsumption: 15,
    warehouseId: 'wh-001',
    supplierId: 'sup-001',
    riskLevel: 'high',
    lastRestockDate: '2026-05-20',
    daysUntilOutOfStock: 0,
    unitPrice: 299,
  },
  {
    id: 'sku-002',
    name: '智能手表 S3',
    category: '电子产品',
    currentStock: 12,
    safetyStock: 30,
    avgDailyConsumption: 8,
    warehouseId: 'wh-001',
    supplierId: 'sup-002',
    riskLevel: 'high',
    lastRestockDate: '2026-05-25',
    daysUntilOutOfStock: 1,
    unitPrice: 599,
  },
  {
    id: 'sku-003',
    name: 'Type-C 快充线',
    category: '配件',
    currentStock: 25,
    safetyStock: 80,
    avgDailyConsumption: 25,
    warehouseId: 'wh-001',
    supplierId: null,
    riskLevel: 'high',
    lastRestockDate: '2026-05-18',
    daysUntilOutOfStock: 1,
    unitPrice: 29,
  },
  {
    id: 'sku-004',
    name: '手机支架',
    category: '配件',
    currentStock: 45,
    safetyStock: 60,
    avgDailyConsumption: 12,
    warehouseId: 'wh-002',
    supplierId: 'sup-003',
    riskLevel: 'medium',
    lastRestockDate: '2026-05-28',
    daysUntilOutOfStock: 4,
    unitPrice: 49,
  },
  {
    id: 'sku-005',
    name: '蓝牙音箱 Mini',
    category: '电子产品',
    currentStock: 38,
    safetyStock: 40,
    avgDailyConsumption: 10,
    warehouseId: 'wh-002',
    supplierId: 'sup-001',
    riskLevel: 'medium',
    lastRestockDate: '2026-05-30',
    daysUntilOutOfStock: 4,
    unitPrice: 199,
  },
  {
    id: 'sku-006',
    name: '钢化膜套装',
    category: '配件',
    currentStock: 120,
    safetyStock: 100,
    avgDailyConsumption: 15,
    warehouseId: 'wh-003',
    supplierId: 'sup-005',
    riskLevel: 'low',
    lastRestockDate: '2026-06-01',
    daysUntilOutOfStock: 8,
    unitPrice: 39,
  },
  {
    id: 'sku-007',
    name: '充电宝 20000mAh',
    category: '电子产品',
    currentStock: 8,
    safetyStock: 50,
    avgDailyConsumption: 6,
    warehouseId: 'wh-003',
    supplierId: null,
    riskLevel: 'high',
    lastRestockDate: '2026-05-22',
    daysUntilOutOfStock: 1,
    unitPrice: 159,
  },
  {
    id: 'sku-008',
    name: '数据线三合一',
    category: '配件',
    currentStock: 0,
    safetyStock: 60,
    avgDailyConsumption: 20,
    warehouseId: 'wh-003',
    supplierId: 'sup-004',
    riskLevel: 'high',
    lastRestockDate: '2026-05-10',
    daysUntilOutOfStock: 0,
    unitPrice: 35,
  },
  {
    id: 'sku-009',
    name: '无线充电器',
    category: '电子产品',
    currentStock: 65,
    safetyStock: 40,
    avgDailyConsumption: 8,
    warehouseId: 'wh-004',
    supplierId: 'sup-003',
    riskLevel: 'low',
    lastRestockDate: '2026-06-02',
    daysUntilOutOfStock: 8,
    unitPrice: 129,
  },
  {
    id: 'sku-010',
    name: '手机壳防摔款',
    category: '配件',
    currentStock: 180,
    safetyStock: 100,
    avgDailyConsumption: 22,
    warehouseId: 'wh-004',
    supplierId: 'sup-005',
    riskLevel: 'low',
    lastRestockDate: '2026-06-03',
    daysUntilOutOfStock: 8,
    unitPrice: 59,
  },
  {
    id: 'sku-011',
    name: '平板电脑支架',
    category: '配件',
    currentStock: 15,
    safetyStock: 30,
    avgDailyConsumption: 5,
    warehouseId: 'wh-001',
    supplierId: 'sup-002',
    riskLevel: 'medium',
    lastRestockDate: '2026-05-26',
    daysUntilOutOfStock: 3,
    unitPrice: 89,
  },
  {
    id: 'sku-012',
    name: '降噪耳塞',
    category: '电子产品',
    currentStock: 8,
    safetyStock: 25,
    avgDailyConsumption: 4,
    warehouseId: 'wh-002',
    supplierId: null,
    riskLevel: 'high',
    lastRestockDate: '2026-05-20',
    daysUntilOutOfStock: 2,
    unitPrice: 79,
  },
];

export const generateReplenishmentSuggestions = (): ReplenishmentSuggestion[] => {
  const highRiskSkus = skus.filter(s => s.riskLevel === 'high' || s.riskLevel === 'medium');
  
  return highRiskSkus.map(sku => {
    const supplier = suppliers.find(s => s.id === sku.supplierId);
    const baseQuantity = Math.max(0, sku.safetyStock * 2 - sku.currentStock);
    const deliveryBuffer = supplier 
      ? supplier.avgDeliveryDays * sku.avgDailyConsumption 
      : sku.safetyStock;
    const suggestedQuantity = Math.ceil(baseQuantity + deliveryBuffer);
    
    let reason = '';
    let priority: 'urgent' | 'high' | 'normal' = 'normal';
    
    if (sku.currentStock === 0) {
      reason = '库存已耗尽，需紧急补货';
      priority = 'urgent';
    } else if (!sku.supplierId) {
      reason = '供应商缺失，建议寻找新供应商';
      priority = 'urgent';
    } else if (sku.daysUntilOutOfStock <= 3) {
      reason = `预计 ${sku.daysUntilOutOfStock} 天后断货`;
      priority = 'high';
    } else {
      reason = `预计 ${sku.daysUntilOutOfStock} 天后断货`;
      priority = 'normal';
    }
    
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + (supplier?.avgDeliveryDays || 5));
    
    return {
      id: `suggestion-${sku.id}`,
      skuId: sku.id,
      skuName: sku.name,
      category: sku.category,
      suggestedQuantity,
      priority,
      estimatedCost: suggestedQuantity * sku.unitPrice,
      expectedDelivery: expectedDeliveryDate.toISOString().split('T')[0],
      reason,
      supplierId: sku.supplierId,
      supplierName: supplier?.name || null,
      currentStock: sku.currentStock,
    };
  }).sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, normal: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

export const trendData: TrendData[] = [
  { date: '05-29', highRisk: 8, mediumRisk: 15, lowRisk: 200, totalStock: 12500 },
  { date: '05-30', highRisk: 10, mediumRisk: 18, lowRisk: 195, totalStock: 11800 },
  { date: '05-31', highRisk: 12, mediumRisk: 22, lowRisk: 189, totalStock: 10500 },
  { date: '06-01', highRisk: 15, mediumRisk: 25, lowRisk: 183, totalStock: 9800 },
  { date: '06-02', highRisk: 18, mediumRisk: 28, lowRisk: 177, totalStock: 9200 },
  { date: '06-03', highRisk: 22, mediumRisk: 32, lowRisk: 169, totalStock: 8500 },
  { date: '06-04', highRisk: 26, mediumRisk: 35, lowRisk: 162, totalStock: 7800 },
];

export const getSupplierById = (id: string | null) => 
  suppliers.find(s => s.id === id) || null;

export const getWarehouseById = (id: string) => 
  warehouses.find(w => w.id === id) || null;
