import { create } from 'zustand';
import type { User, Application, ApprovalNode, OperationLog, UserRole } from '@/types';
import { mockUsers, mockApplications, mockApprovalNodes, mockOperationLogs } from '@/data/mockData';

interface ApprovalStore {
  currentUser: User;
  applications: Application[];
  approvalNodes: ApprovalNode[];
  operationLogs: OperationLog[];
  selectedApplicationId: string | null;
  permissionMessage: { type: 'success' | 'error' | 'warning' | 'info'; message: string } | null;

  setCurrentUserRole: (role: UserRole) => void;
  selectApplication: (id: string | null) => void;
  setPermissionMessage: (msg: { type: 'success' | 'error' | 'warning' | 'info'; message: string } | null) => void;
  approveCurrentNode: (comment: string) => void;
  rejectCurrentNode: (comment: string) => void;
}

export const useApprovalStore = create<ApprovalStore>((set, get) => ({
  currentUser: mockUsers[2],
  applications: mockApplications,
  approvalNodes: mockApprovalNodes,
  operationLogs: mockOperationLogs,
  selectedApplicationId: null,
  permissionMessage: null,

  setCurrentUserRole: (role: UserRole) => {
    const user = mockUsers.find(u => u.role === role) || mockUsers[0];
    set({ currentUser: user, permissionMessage: null });
  },

  selectApplication: (id: string | null) => {
    set({ selectedApplicationId: id, permissionMessage: null });
  },

  setPermissionMessage: (msg) => {
    set({ permissionMessage: msg });
  },

  approveCurrentNode: (comment: string) => {
    const state = get();
    const { selectedApplicationId, currentUser, approvalNodes, operationLogs } = state;

    if (!selectedApplicationId) return;

    const appNodes = approvalNodes
      .filter(n => n.applicationId === selectedApplicationId)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    const currentNode = appNodes.find(n => n.status === 'current');
    if (!currentNode) return;

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const updatedNodes = approvalNodes.map(n => {
      if (n.id === currentNode.id) {
        return { ...n, status: 'approved' as const, comment, approvedAt: now };
      }
      return n;
    });

    const nextNode = appNodes.find(n => n.orderIndex === currentNode.orderIndex + 1);
    let finalNodes = updatedNodes;
    let allApproved = false;

    if (nextNode && !nextNode.missingApprover) {
      finalNodes = finalNodes.map(n => {
        if (n.id === nextNode.id) {
          return { ...n, status: 'current' as const };
        }
        return n;
      });
    } else if (!nextNode) {
      allApproved = true;
    }

    const newLog: OperationLog = {
      id: `log${Date.now()}`,
      applicationId: selectedApplicationId,
      operatorId: currentUser.id,
      operatorName: currentUser.name,
      action: 'approve',
      comment,
      timestamp: now,
    };

    const updatedApplications = state.applications.map(app => {
      if (app.id === selectedApplicationId && allApproved) {
        return { ...app, status: 'approved' as const };
      }
      return app;
    });

    set({
      approvalNodes: finalNodes,
      operationLogs: [...operationLogs, newLog],
      applications: updatedApplications,
      permissionMessage: { type: 'success', message: '审批通过成功' },
    });
  },

  rejectCurrentNode: (comment: string) => {
    const state = get();
    const { selectedApplicationId, currentUser, approvalNodes, operationLogs } = state;

    if (!selectedApplicationId) return;

    const appNodes = approvalNodes
      .filter(n => n.applicationId === selectedApplicationId)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    const currentNode = appNodes.find(n => n.status === 'current');
    if (!currentNode) return;

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const finalNodes = approvalNodes.map(n => {
      if (n.id === currentNode.id) {
        return { ...n, status: 'rejected' as const, comment, approvedAt: now };
      }
      return n;
    });

    const newLog: OperationLog = {
      id: `log${Date.now()}`,
      applicationId: selectedApplicationId,
      operatorId: currentUser.id,
      operatorName: currentUser.name,
      action: 'reject',
      comment,
      timestamp: now,
    };

    const updatedApplications = state.applications.map(app => {
      if (app.id === selectedApplicationId) {
        return { ...app, status: 'rejected' as const };
      }
      return app;
    });

    set({
      approvalNodes: finalNodes,
      operationLogs: [...operationLogs, newLog],
      applications: updatedApplications,
      permissionMessage: { type: 'error', message: '已拒绝该申请' },
    });
  },
}));
