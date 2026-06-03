import { create } from 'zustand';
import { Warehouse, Sku, Supplier, ReplenishmentSuggestion, AlertConfig, SimulationResult } from '../types';
import { warehouses, skus, suppliers, generateReplenishmentSuggestions } from '../data/mockData';

interface InventoryState {
  warehouses: Warehouse[];
  skus: Sku[];
  suppliers: Supplier[];
  suggestions: ReplenishmentSuggestion[];
  selectedWarehouseId: string | null;
  selectedSkuId: string | null;
  alertConfig: AlertConfig;
  simulationResults: SimulationResult[];
  batchMode: boolean;
  selectedSuggestions: string[];
  selectWarehouse: (id: string | null) => void;
  selectSku: (id: string | null) => void;
  getFilteredSkus: () => Sku[];
  toggleBatchMode: () => void;
  toggleSuggestion: (id: string) => void;
  selectAllSuggestions: () => void;
  clearSelectedSuggestions: () => void;
  updateAlertConfig: (config: Partial<AlertConfig>) => void;
  runSimulation: (simulationDays: number, consumptionMultiplier: number) => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  warehouses,
  skus,
  suppliers,
  suggestions: generateReplenishmentSuggestions(),
  selectedWarehouseId: null,
  selectedSkuId: null,
  alertConfig: {
    highStockThreshold: 3,
    mediumStockThreshold: 7,
    supplierMissingAlert: true,
    maxAlertsBeforeBatch: 10,
  },
  simulationResults: [],
  batchMode: false,
  selectedSuggestions: [],

  selectWarehouse: (id) => set({ selectedWarehouseId: id }),

  selectSku: (id) => set({ selectedSkuId: id }),

  getFilteredSkus: () => {
    const { skus, selectedWarehouseId } = get();
    if (!selectedWarehouseId) return skus;
    return skus.filter(s => s.warehouseId === selectedWarehouseId);
  },

  toggleBatchMode: () => set(state => ({ 
    batchMode: !state.batchMode,
    selectedSuggestions: !state.batchMode ? [] : state.selectedSuggestions 
  })),

  toggleSuggestion: (id) => set(state => ({
    selectedSuggestions: state.selectedSuggestions.includes(id)
      ? state.selectedSuggestions.filter(s => s !== id)
      : [...state.selectedSuggestions, id]
  })),

  selectAllSuggestions: () => set(state => ({
    selectedSuggestions: state.suggestions.map(s => s.id)
  })),

  clearSelectedSuggestions: () => set({ selectedSuggestions: [] }),

  updateAlertConfig: (config) => set(state => ({
    alertConfig: { ...state.alertConfig, ...config }
  })),

  runSimulation: (simulationDays, consumptionMultiplier) => {
    const { skus, alertConfig } = get();
    const results: SimulationResult[] = [];

    for (let day = 1; day <= simulationDays; day++) {
      let criticalCount = 0;
      let warningCount = 0;

      skus.forEach(sku => {
        const simulatedConsumption = sku.avgDailyConsumption * consumptionMultiplier * day;
        const simulatedStock = Math.max(0, sku.currentStock - simulatedConsumption);

        if (simulatedStock === 0) {
          criticalCount++;
        } else if (simulatedStock <= sku.safetyStock * alertConfig.highStockThreshold / 7) {
          criticalCount++;
        } else if (simulatedStock <= sku.safetyStock * alertConfig.mediumStockThreshold / 7) {
          warningCount++;
        }
      });

      let alertLevel: 'normal' | 'warning' | 'critical' = 'normal';
      let message = '库存状态正常';

      if (criticalCount >= 5) {
        alertLevel = 'critical';
        message = `严重预警：${criticalCount} 个 SKU 即将断货！`;
      } else if (warningCount >= 8 || criticalCount >= 2) {
        alertLevel = 'warning';
        message = `注意：${warningCount} 个 SKU 库存偏低，${criticalCount} 个 SKU 即将断货`;
      } else if (warningCount >= 3) {
        alertLevel = 'warning';
        message = `关注：${warningCount} 个 SKU 库存偏低`;
      }

      results.push({
        days: day,
        simulatedStock: skus.reduce((acc, sku) => {
          const simulatedConsumption = sku.avgDailyConsumption * consumptionMultiplier * day;
          return acc + Math.max(0, sku.currentStock - simulatedConsumption);
        }, 0),
        alertLevel,
        message,
      });
    }

    set({ simulationResults: results });
  },
}));
