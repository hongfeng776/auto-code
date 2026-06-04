import { create } from 'zustand';
import type { AppState } from '../types';
import { mockCustomers, mockRiskScores, mockTasks, mockRecords } from '../data/mockData';

export const useAppStore = create<AppState>((set, get) => ({
  customers: mockCustomers,
  riskScores: mockRiskScores,
  tasks: mockTasks,
  records: mockRecords,
  selectedCustomerId: null,

  selectCustomer: (id: string | null) => {
    set({ selectedCustomerId: id });
  },

  getSelectedCustomer: () => {
    const { customers, selectedCustomerId } = get();
    return customers.find((c) => c.id === selectedCustomerId);
  },

  getCurrentRiskScore: () => {
    const { riskScores, selectedCustomerId } = get();
    if (!selectedCustomerId) return undefined;
    return riskScores[selectedCustomerId];
  },

  getCurrentTasks: () => {
    const { tasks, selectedCustomerId } = get();
    if (!selectedCustomerId) return [];
    return tasks[selectedCustomerId] || [];
  },

  getCurrentRecords: () => {
    const { records, selectedCustomerId } = get();
    if (!selectedCustomerId) return [];
    return records[selectedCustomerId] || [];
  },
}));
