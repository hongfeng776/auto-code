import type { Warehouse, SkuItem, Supplier, ReplenishmentSuggestion, AlertRecord, TrendDataPoint, SupplierCommunication } from '@/types'

export const warehouses: Warehouse[] = [
  { id: 'wh-01', name: '华东中心仓', location: '上海松江', totalSku: 1280, outOfStockSku: 23, lowStockSku: 67, alertSku: 42, capacity: 50000, utilization: 0.78 },
  { id: 'wh-02', name: '华南配送中心', location: '广州白云', totalSku: 960, outOfStockSku: 15, lowStockSku: 48, alertSku: 31, capacity: 38000, utilization: 0.65 },
  { id: 'wh-03', name: '华北枢纽仓', location: '北京大兴', totalSku: 1120, outOfStockSku: 31, lowStockSku: 82, alertSku: 56, capacity: 45000, utilization: 0.89 },
  { id: 'wh-04', name: '西南区域仓', location: '成都龙泉', totalSku: 740, outOfStockSku: 8, lowStockSku: 35, alertSku: 18, capacity: 28000, utilization: 0.54 },
  { id: 'wh-05', name: '华中集散仓', location: '武汉东西湖', totalSku: 880, outOfStockSku: 19, lowStockSku: 53, alertSku: 38, capacity: 35000, utilization: 0.72 },
]

export const skuItems: SkuItem[] = [
  { id: 'sku-001', skuCode: 'ELC-A1001', name: '蓝牙耳机 Pro Max', warehouseId: 'wh-01', currentStock: 0, safetyStock: 200, avgDailyConsumption: 35, daysOfSupply: 0, riskLevel: 'out_of_stock', supplierIds: ['sup-01'], lastReplenished: '2026-05-10', category: '电子产品' },
  { id: 'sku-002', skuCode: 'ELC-A1002', name: '无线充电板 Q3', warehouseId: 'wh-01', currentStock: 45, safetyStock: 150, avgDailyConsumption: 22, daysOfSupply: 2, riskLevel: 'low', supplierIds: ['sup-01', 'sup-02'], lastReplenished: '2026-05-28', category: '电子产品' },
  { id: 'sku-003', skuCode: 'HOM-B2001', name: '智能台灯 S1', warehouseId: 'wh-01', currentStock: 320, safetyStock: 100, avgDailyConsumption: 15, daysOfSupply: 21, riskLevel: 'normal', supplierIds: ['sup-03'], lastReplenished: '2026-05-25', category: '家居用品' },
  { id: 'sku-004', skuCode: 'FOD-C3001', name: '有机坚果礼盒', warehouseId: 'wh-02', currentStock: 0, safetyStock: 500, avgDailyConsumption: 80, daysOfSupply: 0, riskLevel: 'out_of_stock', supplierIds: [], lastReplenished: '2026-04-20', category: '食品饮料' },
  { id: 'sku-005', skuCode: 'FOD-C3002', name: '进口橄榄油 500ml', warehouseId: 'wh-02', currentStock: 120, safetyStock: 200, avgDailyConsumption: 25, daysOfSupply: 5, riskLevel: 'low', supplierIds: ['sup-04'], lastReplenished: '2026-05-22', category: '食品饮料' },
  { id: 'sku-006', skuCode: 'SPT-D4001', name: '瑜伽垫加厚款', warehouseId: 'wh-03', currentStock: 0, safetyStock: 300, avgDailyConsumption: 45, daysOfSupply: 0, riskLevel: 'out_of_stock', supplierIds: ['sup-05'], lastReplenished: '2026-05-05', category: '运动户外' },
  { id: 'sku-007', skuCode: 'SPT-D4002', name: '跑步速干T恤', warehouseId: 'wh-03', currentStock: 88, safetyStock: 250, avgDailyConsumption: 40, daysOfSupply: 2, riskLevel: 'low', supplierIds: ['sup-05', 'sup-06'], lastReplenished: '2026-05-30', category: '运动户外' },
  { id: 'sku-008', skuCode: 'ELC-A1003', name: 'Type-C 数据线 1.5m', warehouseId: 'wh-03', currentStock: 1500, safetyStock: 400, avgDailyConsumption: 60, daysOfSupply: 25, riskLevel: 'normal', supplierIds: ['sup-01'], lastReplenished: '2026-06-01', category: '电子产品' },
  { id: 'sku-009', skuCode: 'HOM-B2002', name: '空气加湿器', warehouseId: 'wh-04', currentStock: 0, safetyStock: 100, avgDailyConsumption: 12, daysOfSupply: 0, riskLevel: 'out_of_stock', supplierIds: [], lastReplenished: '2026-04-15', category: '家居用品' },
  { id: 'sku-010', skuCode: 'BEA-E5001', name: '玻尿酸面膜 10片装', warehouseId: 'wh-04', currentStock: 60, safetyStock: 300, avgDailyConsumption: 55, daysOfSupply: 1, riskLevel: 'low', supplierIds: ['sup-07'], lastReplenished: '2026-05-29', category: '美妆个护' },
  { id: 'sku-011', skuCode: 'BEA-E5002', name: '氨基酸洁面乳', warehouseId: 'wh-05', currentStock: 180, safetyStock: 200, avgDailyConsumption: 30, daysOfSupply: 6, riskLevel: 'low', supplierIds: ['sup-07', 'sup-08'], lastReplenished: '2026-05-27', category: '美妆个护' },
  { id: 'sku-012', skuCode: 'FOD-C3003', name: '冻干咖啡 30杯装', warehouseId: 'wh-05', currentStock: 0, safetyStock: 400, avgDailyConsumption: 70, daysOfSupply: 0, riskLevel: 'out_of_stock', supplierIds: ['sup-04'], lastReplenished: '2026-05-01', category: '食品饮料' },
  { id: 'sku-013', skuCode: 'ELC-A1004', name: '机械键盘 青轴', warehouseId: 'wh-01', currentStock: 210, safetyStock: 80, avgDailyConsumption: 10, daysOfSupply: 21, riskLevel: 'normal', supplierIds: ['sup-02'], lastReplenished: '2026-05-20', category: '电子产品' },
  { id: 'sku-014', skuCode: 'HOM-B2003', name: '真空保温杯 500ml', warehouseId: 'wh-03', currentStock: 55, safetyStock: 180, avgDailyConsumption: 28, daysOfSupply: 2, riskLevel: 'low', supplierIds: ['sup-03'], lastReplenished: '2026-05-18', category: '家居用品' },
  { id: 'sku-015', skuCode: 'SPT-D4003', name: '弹力阻力带套装', warehouseId: 'wh-02', currentStock: 400, safetyStock: 150, avgDailyConsumption: 20, daysOfSupply: 20, riskLevel: 'normal', supplierIds: ['sup-06'], lastReplenished: '2026-05-31', category: '运动户外' },
  { id: 'sku-016', skuCode: 'BEA-E5003', name: '防晒霜 SPF50+', warehouseId: 'wh-04', currentStock: 0, safetyStock: 250, avgDailyConsumption: 48, daysOfSupply: 0, riskLevel: 'out_of_stock', supplierIds: ['sup-08'], lastReplenished: '2026-04-28', category: '美妆个护' },
  { id: 'sku-017', skuCode: 'ELC-A1005', name: '手机支架车载款', warehouseId: 'wh-05', currentStock: 70, safetyStock: 120, avgDailyConsumption: 18, daysOfSupply: 4, riskLevel: 'low', supplierIds: ['sup-01', 'sup-02'], lastReplenished: '2026-05-26', category: '电子产品' },
  { id: 'sku-018', skuCode: 'FOD-C3004', name: '全麦面包粉 1kg', warehouseId: 'wh-01', currentStock: 280, safetyStock: 100, avgDailyConsumption: 14, daysOfSupply: 20, riskLevel: 'normal', supplierIds: ['sup-04'], lastReplenished: '2026-06-02', category: '食品饮料' },
]

export const suppliers: Supplier[] = [
  { id: 'sup-01', name: '深圳鑫达电子科技', contactPerson: '张明', phone: '138-0001-1111', status: 'active', avgLeadTime: 5, onTimeRate: 0.92, coveredSkuIds: ['sku-001', 'sku-002', 'sku-008', 'sku-017'], lastOrderDate: '2026-05-28' },
  { id: 'sup-02', name: '东莞优联电子', contactPerson: '李强', phone: '139-0002-2222', status: 'active', avgLeadTime: 7, onTimeRate: 0.85, coveredSkuIds: ['sku-002', 'sku-013', 'sku-017'], lastOrderDate: '2026-05-25' },
  { id: 'sup-03', name: '佛山恒光照明', contactPerson: '王芳', phone: '137-0003-3333', status: 'active', avgLeadTime: 4, onTimeRate: 0.95, coveredSkuIds: ['sku-003', 'sku-014'], lastOrderDate: '2026-05-30' },
  { id: 'sup-04', name: '青岛海之源食品', contactPerson: '赵磊', phone: '136-0004-4444', status: 'active', avgLeadTime: 6, onTimeRate: 0.88, coveredSkuIds: ['sku-005', 'sku-012', 'sku-018'], lastOrderDate: '2026-05-20' },
  { id: 'sup-05', name: '晋江飞跃体育', contactPerson: '陈华', phone: '135-0005-5555', status: 'inactive', avgLeadTime: 10, onTimeRate: 0.70, coveredSkuIds: ['sku-006', 'sku-007'], lastOrderDate: '2026-04-15' },
  { id: 'sup-06', name: '厦门力健运动', contactPerson: '刘洋', phone: '134-0006-6666', status: 'active', avgLeadTime: 6, onTimeRate: 0.90, coveredSkuIds: ['sku-007', 'sku-015'], lastOrderDate: '2026-05-29' },
  { id: 'sup-07', name: '广州美肌生物', contactPerson: '黄丽', phone: '133-0007-7777', status: 'active', avgLeadTime: 5, onTimeRate: 0.91, coveredSkuIds: ['sku-010', 'sku-011'], lastOrderDate: '2026-05-27' },
  { id: 'sup-08', name: '杭州自然美学', contactPerson: '周婷', phone: '132-0008-8888', status: 'blacklisted', avgLeadTime: 15, onTimeRate: 0.45, coveredSkuIds: ['sku-011', 'sku-016'], lastOrderDate: '2026-03-10' },
]

export const replenishmentSuggestions: ReplenishmentSuggestion[] = [
  { id: 'req-001', skuId: 'sku-001', warehouseId: 'wh-01', suggestedQty: 700, priority: 'urgent', reason: '当前库存为0，日均消耗35件，需紧急补货', supplierId: 'sup-01', supplierAvailable: true, estimatedArrival: '2026-06-08', status: 'pending' },
  { id: 'req-002', skuId: 'sku-002', warehouseId: 'wh-01', suggestedQty: 400, priority: 'high', reason: '库存仅剩2天供应量，低于安全库存', supplierId: 'sup-01', supplierAvailable: true, estimatedArrival: '2026-06-07', status: 'pending' },
  { id: 'req-003', skuId: 'sku-004', warehouseId: 'wh-02', suggestedQty: 1500, priority: 'urgent', reason: '当前库存为0，且无可用供应商，需紧急寻源', supplierId: null, supplierAvailable: false, estimatedArrival: null, status: 'pending' },
  { id: 'req-004', skuId: 'sku-005', warehouseId: 'wh-02', suggestedQty: 500, priority: 'medium', reason: '库存低于安全线，需补充', supplierId: 'sup-04', supplierAvailable: true, estimatedArrival: '2026-06-09', status: 'pending' },
  { id: 'req-005', skuId: 'sku-006', warehouseId: 'wh-03', suggestedQty: 900, priority: 'urgent', reason: '当前库存为0，供应商状态异常，需确认供货能力', supplierId: 'sup-05', supplierAvailable: false, estimatedArrival: null, status: 'pending' },
  { id: 'req-006', skuId: 'sku-007', warehouseId: 'wh-03', suggestedQty: 600, priority: 'high', reason: '库存仅剩2天供应量', supplierId: 'sup-06', supplierAvailable: true, estimatedArrival: '2026-06-09', status: 'approved' },
  { id: 'req-007', skuId: 'sku-009', warehouseId: 'wh-04', suggestedQty: 300, priority: 'urgent', reason: '当前库存为0，且无可用供应商，需紧急寻源', supplierId: null, supplierAvailable: false, estimatedArrival: null, status: 'pending' },
  { id: 'req-008', skuId: 'sku-010', warehouseId: 'wh-04', suggestedQty: 1200, priority: 'high', reason: '库存仅剩1天供应量，需立即补货', supplierId: 'sup-07', supplierAvailable: true, estimatedArrival: '2026-06-08', status: 'pending' },
  { id: 'req-009', skuId: 'sku-011', warehouseId: 'wh-05', suggestedQty: 500, priority: 'medium', reason: '库存低于安全线', supplierId: 'sup-07', supplierAvailable: true, estimatedArrival: '2026-06-08', status: 'ordered' },
  { id: 'req-010', skuId: 'sku-012', warehouseId: 'wh-05', suggestedQty: 2000, priority: 'urgent', reason: '当前库存为0，日均消耗70件，需紧急补货', supplierId: 'sup-04', supplierAvailable: true, estimatedArrival: '2026-06-09', status: 'pending' },
  { id: 'req-011', skuId: 'sku-014', warehouseId: 'wh-03', suggestedQty: 450, priority: 'high', reason: '库存仅剩2天供应量', supplierId: 'sup-03', supplierAvailable: true, estimatedArrival: '2026-06-07', status: 'pending' },
  { id: 'req-012', skuId: 'sku-016', warehouseId: 'wh-04', suggestedQty: 750, priority: 'urgent', reason: '当前库存为0，原供应商已被列入黑名单，需寻源', supplierId: 'sup-08', supplierAvailable: false, estimatedArrival: null, status: 'pending' },
  { id: 'req-013', skuId: 'sku-017', warehouseId: 'wh-05', suggestedQty: 300, priority: 'medium', reason: '库存低于安全线', supplierId: 'sup-01', supplierAvailable: true, estimatedArrival: '2026-06-08', status: 'approved' },
]

export const alertRecords: AlertRecord[] = [
  { id: 'alt-001', type: 'out_of_stock', skuId: 'sku-001', warehouseId: 'wh-01', severity: 'critical', message: '蓝牙耳机 Pro Max 库存为0，已断货', timestamp: '2026-06-03T08:15:00', resolved: false, actionSuggestion: '立即联系深圳鑫达电子科技紧急发货' },
  { id: 'alt-002', type: 'out_of_stock', skuId: 'sku-004', warehouseId: 'wh-02', severity: 'critical', message: '有机坚果礼盒 库存为0，无可用供应商', timestamp: '2026-06-03T08:20:00', resolved: false, actionSuggestion: '启动紧急寻源流程，联系备选供应商' },
  { id: 'alt-003', type: 'supplier_missing', skuId: 'sku-009', warehouseId: 'wh-04', severity: 'critical', message: '空气加湿器 库存为0且无绑定供应商', timestamp: '2026-06-03T07:45:00', resolved: false, actionSuggestion: '进入寻源流程，评估新供应商' },
  { id: 'alt-004', type: 'low_stock', skuId: 'sku-002', warehouseId: 'wh-01', severity: 'warning', message: '无线充电板 Q3 仅剩2天库存', timestamp: '2026-06-03T09:00:00', resolved: false, actionSuggestion: '确认补货订单，预计6月7日到货' },
  { id: 'alt-005', type: 'low_stock', skuId: 'sku-010', warehouseId: 'wh-04', severity: 'warning', message: '玻尿酸面膜仅剩1天库存', timestamp: '2026-06-03T09:10:00', resolved: false, actionSuggestion: '催促广州美肌生物加快发货' },
  { id: 'alt-006', type: 'supplier_missing', skuId: 'sku-004', warehouseId: 'wh-02', severity: 'critical', message: '有机坚果礼盒 无绑定供应商', timestamp: '2026-06-02T14:00:00', resolved: false, actionSuggestion: '联系3家潜在供应商获取报价' },
  { id: 'alt-007', type: 'lead_time_overdue', skuId: 'sku-006', warehouseId: 'wh-03', severity: 'warning', message: '瑜伽垫供应商(晋江飞跃体育)状态异常', timestamp: '2026-06-02T16:30:00', resolved: false, actionSuggestion: '确认供应商恢复供货能力或启动替换' },
  { id: 'alt-008', type: 'out_of_stock', skuId: 'sku-012', warehouseId: 'wh-05', severity: 'critical', message: '冻干咖啡 30杯装 库存为0', timestamp: '2026-06-03T06:00:00', resolved: false, actionSuggestion: '联系青岛海之源食品紧急补货' },
  { id: 'alt-009', type: 'supplier_missing', skuId: 'sku-016', warehouseId: 'wh-04', severity: 'critical', message: '防晒霜供应商(杭州自然美学)已被拉黑', timestamp: '2026-06-01T10:00:00', resolved: false, actionSuggestion: '紧急寻找替代供应商' },
  { id: 'alt-010', type: 'low_stock', skuId: 'sku-007', warehouseId: 'wh-03', severity: 'warning', message: '跑步速干T恤仅剩2天库存', timestamp: '2026-06-03T08:30:00', resolved: false, actionSuggestion: '已下单厦门力健运动，预计6月9日到货' },
  { id: 'alt-011', type: 'low_stock', skuId: 'sku-014', warehouseId: 'wh-03', severity: 'warning', message: '真空保温杯仅剩2天库存', timestamp: '2026-06-03T09:30:00', resolved: false, actionSuggestion: '联系佛山恒光照明加速发货' },
  { id: 'alt-012', type: 'lead_time_overdue', skuId: 'sku-016', warehouseId: 'wh-04', severity: 'warning', message: '防晒霜交期严重超期', timestamp: '2026-05-30T08:00:00', resolved: false, actionSuggestion: '供应商已拉黑，需重新寻源' },
]

function generateTrendData(): TrendDataPoint[] {
  const data: TrendDataPoint[] = []
  const baseDate = new Date('2026-05-01')
  for (let i = 0; i < 34; i++) {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    data.push({
      date: dateStr,
      totalStock: 28000 + Math.floor(Math.random() * 8000 - 3000 + i * 50),
      alertCount: Math.max(5, Math.floor(30 + Math.random() * 25 - i * 0.3)),
      replenishmentCount: Math.floor(10 + Math.random() * 15),
      outOfStockCount: Math.max(2, Math.floor(8 + Math.random() * 10 - i * 0.1)),
    })
  }
  return data
}

export const trendData: TrendDataPoint[] = generateTrendData()

export const supplierCommunications: SupplierCommunication[] = [
  { id: 'comm-001', supplierId: 'sup-01', skuId: 'sku-001', type: 'delivery_update', status: 'in_progress', title: '蓝牙耳机紧急补货跟进', content: '已确认订单700件蓝牙耳机，生产中', contactPerson: '张明', timestamp: '2026-06-02T10:30:00', lastFollowUp: '2026-06-03T09:15:00', nextFollowUp: '2026-06-05T10:00:00', expectedDeliveryDate: '2026-06-08', priority: 'urgent', assignedTo: '采购专员-李', relatedOrderId: 'PO-20260602-001' },
  { id: 'comm-002', supplierId: 'sup-01', skuId: 'sku-002', type: 'order_confirm', status: 'resolved', title: '无线充电板订单确认', content: '400件Q3充电板订单已确认，正常排产', contactPerson: '张明', timestamp: '2026-06-01T14:20:00', lastFollowUp: '2026-06-02T16:00:00', nextFollowUp: null, expectedDeliveryDate: '2026-06-07', priority: 'high', assignedTo: '采购专员-李', relatedOrderId: 'PO-20260601-003' },
  { id: 'comm-003', supplierId: 'sup-01', skuId: null, type: 'price_adjust', status: 'pending', title: 'Q3季度价格谈判', content: '已提交新价格调整申请，等待供应商确认', contactPerson: '张明', timestamp: '2026-06-02T11:00:00', lastFollowUp: '2026-06-02T11:00:00', nextFollowUp: '2026-06-06T10:00:00', expectedDeliveryDate: null, priority: 'medium', assignedTo: '采购主管-王', relatedOrderId: null },
  { id: 'comm-004', supplierId: 'sup-03', skuId: 'sku-014', type: 'delivery_update', status: 'in_progress', title: '真空保温杯加急配送', content: '450件保温杯生产完成，已安排物流', contactPerson: '王芳', timestamp: '2026-06-03T08:45:00', lastFollowUp: '2026-06-03T08:45:00', nextFollowUp: '2026-06-06T09:00:00', expectedDeliveryDate: '2026-06-07', priority: 'high', assignedTo: '采购专员-张', relatedOrderId: 'PO-20260601-007' },
  { id: 'comm-005', supplierId: 'sup-04', skuId: 'sku-012', type: 'delay_notice', status: 'escalated', title: '冻干咖啡延迟交货', content: '原计划6月5日交货，因原料供应问题延迟至6月9日', contactPerson: '赵磊', timestamp: '2026-06-01T16:30:00', lastFollowUp: '2026-06-03T10:00:00', nextFollowUp: '2026-06-04T15:00:00', expectedDeliveryDate: '2026-06-09', priority: 'urgent', assignedTo: '采购主管-王', relatedOrderId: 'PO-20260528-012' },
  { id: 'comm-006', supplierId: 'sup-04', skuId: 'sku-005', type: 'order_confirm', status: 'pending', title: '橄榄油订单确认', content: '500件橄榄油订单已发送，待确认', contactPerson: '赵磊', timestamp: '2026-06-03T09:00:00', lastFollowUp: '2026-06-03T09:00:00', nextFollowUp: '2026-06-04T10:00:00', expectedDeliveryDate: '2026-06-09', priority: 'medium', assignedTo: '采购专员-李', relatedOrderId: 'PO-20260603-015' },
  { id: 'comm-007', supplierId: 'sup-05', skuId: 'sku-006', type: 'general', status: 'pending', title: '恢复合作洽谈', content: '联系供应商确认恢复合作可能性', contactPerson: '陈华', timestamp: '2026-06-02T14:00:00', lastFollowUp: '2026-06-02T14:00:00', nextFollowUp: '2026-06-05T11:00:00', expectedDeliveryDate: null, priority: 'high', assignedTo: '采购主管-王', relatedOrderId: null },
  { id: 'comm-008', supplierId: 'sup-06', skuId: 'sku-007', type: 'quality_issue', status: 'resolved', title: '速干T恤品质确认', content: '600件T恤品质检查完成，品质达标', contactPerson: '刘洋', timestamp: '2026-05-30T10:30:00', lastFollowUp: '2026-06-01T15:00:00', nextFollowUp: null, expectedDeliveryDate: '2026-06-09', priority: 'medium', assignedTo: 'QC-刘', relatedOrderId: 'PO-20260529-018' },
  { id: 'comm-009', supplierId: 'sup-07', skuId: 'sku-010', type: 'delivery_update', status: 'in_progress', title: '面膜紧急补货', content: '1200件面膜已发货，物流追踪中', contactPerson: '黄丽', timestamp: '2026-06-02T15:00:00', lastFollowUp: '2026-06-03T14:30:00', nextFollowUp: '2026-06-06T10:00:00', expectedDeliveryDate: '2026-06-08', priority: 'urgent', assignedTo: '采购专员-张', relatedOrderId: 'PO-20260601-021' },
  { id: 'comm-010', supplierId: 'sup-07', skuId: 'sku-011', type: 'order_confirm', status: 'pending', title: '洁面乳已下单', content: '500件洁面乳已下单，等待供应商确认', contactPerson: '黄丽', timestamp: '2026-06-01T11:00:00', lastFollowUp: '2026-06-02T09:00:00', nextFollowUp: '2026-06-04T10:00:00', expectedDeliveryDate: '2026-06-08', priority: 'medium', assignedTo: '采购专员-李', relatedOrderId: 'PO-20260601-022' },
  { id: 'comm-011', supplierId: 'sup-08', skuId: 'sku-016', type: 'general', status: 'escalated', title: '防晒霜供应商问题处理', content: '原供应商已拉黑，需重新寻源', contactPerson: '周婷', timestamp: '2026-05-20T09:00:00', lastFollowUp: '2026-06-01T10:00:00', nextFollowUp: null, expectedDeliveryDate: null, priority: 'urgent', assignedTo: '采购主管-王', relatedOrderId: null },
  { id: 'comm-012', supplierId: 'sup-06', skuId: 'sku-015', type: 'order_confirm', status: 'resolved', title: '阻力带已到货', content: '阻力带套装已到货并质检完成', contactPerson: '刘洋', timestamp: '2026-05-31T14:00:00', lastFollowUp: '2026-06-01T16:00:00', nextFollowUp: null, expectedDeliveryDate: '2026-06-06', priority: 'low', assignedTo: '采购专员-张', relatedOrderId: 'PO-20260525-025' },
]
