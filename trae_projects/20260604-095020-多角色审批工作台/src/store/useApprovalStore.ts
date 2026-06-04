import { create } from 'zustand'
import type { Application, ApprovalNode, OperationRecord, Role, User, Exception, ApplicationStatus, Priority, ApprovalNodeStatus, OperationAction } from '@/types'
import { roles as mockRoles, currentUser as mockCurrentUser, users as mockUsers, applications as mockApplications, approvalNodes as mockNodes, operationRecords as mockRecords, exceptions as mockExceptions } from '@/data/mockData'

export interface FilterState {
  status: ApplicationStatus | null
  department: string | null
  priority: Priority | null
  keyword: string
}

const initialFilter: FilterState = {
  status: null,
  department: null,
  priority: null,
  keyword: '',
}

interface ApprovalStore {
  applications: Application[]
  approvalNodes: ApprovalNode[]
  operationRecords: OperationRecord[]
  roles: Role[]
  users: User[]
  currentUser: User
  exceptions: Exception[]
  selectedApplicationId: string | null
  filter: FilterState
  dismissedExceptions: string[]

  getSelectedApplication: () => Application | null
  getSelectedNodes: () => ApprovalNode[]
  getSelectedRecords: () => OperationRecord[]
  getSelectedExceptions: () => Exception[]
  getFilteredApplications: () => Application[]
  getActiveExceptions: () => Exception[]
  getCurrentUserRole: () => Role | undefined
  getNodePermissionInfo: (nodeId: string) => { hasPermission: boolean; roleDisplayName: string; permissionList: string[]; isOverPermission: boolean }

  selectApplication: (id: string | null) => void
  setFilter: (filter: Partial<FilterState>) => void
  resetFilter: () => void
  dismissException: (id: string) => void
  approveNode: (applicationId: string, nodeId: string, comment: string) => void
  rejectNode: (applicationId: string, nodeId: string, comment: string) => void
}

export const useApprovalStore = create<ApprovalStore>((set, get) => ({
  applications: mockApplications,
  approvalNodes: mockNodes,
  operationRecords: mockRecords,
  roles: mockRoles,
  users: mockUsers,
  currentUser: mockCurrentUser,
  exceptions: mockExceptions,
  selectedApplicationId: null,
  filter: initialFilter,
  dismissedExceptions: [],

  getSelectedApplication: () => {
    const { applications, selectedApplicationId } = get()
    return applications.find((a) => a.id === selectedApplicationId) ?? null
  },

  getSelectedNodes: () => {
    const { approvalNodes, selectedApplicationId } = get()
    return approvalNodes
      .filter((n) => n.applicationId === selectedApplicationId)
      .sort((a, b) => a.order - b.order)
  },

  getSelectedRecords: () => {
    const { operationRecords, selectedApplicationId } = get()
    return operationRecords
      .filter((r) => r.applicationId === selectedApplicationId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  },

  getSelectedExceptions: () => {
    const { exceptions, selectedApplicationId, dismissedExceptions } = get()
    return exceptions.filter(
      (e) => e.applicationId === selectedApplicationId && !dismissedExceptions.includes(e.id)
    )
  },

  getFilteredApplications: () => {
    const { applications, filter } = get()
    return applications.filter((app) => {
      if (filter.status && app.status !== filter.status) return false
      if (filter.department && app.department !== filter.department) return false
      if (filter.priority && app.priority !== filter.priority) return false
      if (filter.keyword) {
        const kw = filter.keyword.toLowerCase()
        if (
          !app.title.toLowerCase().includes(kw) &&
          !app.applicantName.toLowerCase().includes(kw) &&
          !app.id.toLowerCase().includes(kw)
        )
          return false
      }
      return true
    })
  },

  getActiveExceptions: () => {
    const { exceptions, dismissedExceptions } = get()
    return exceptions.filter((e) => !dismissedExceptions.includes(e.id))
  },

  getCurrentUserRole: () => {
    const { roles, currentUser } = get()
    return roles.find((r) => r.id === currentUser.roleId)
  },

  getNodePermissionInfo: (nodeId: string) => {
    const { approvalNodes, roles, currentUser } = get()
    const node = approvalNodes.find((n) => n.id === nodeId)
    const currentRole = roles.find((r) => r.id === currentUser.roleId)
    const nodeRole = node ? roles.find((r) => r.key === node.approverRole) : undefined

    const hasPermission = !!node && !!currentRole && node.approverRole === currentRole.key
    const roleDisplayName = nodeRole?.name ?? ''
    const permissionList = nodeRole?.permissions ?? []
    const isOverPermission = node?.isOverPermission ?? false

    return { hasPermission, roleDisplayName, permissionList, isOverPermission }
  },

  selectApplication: (id) => {
    set({ selectedApplicationId: id })
  },

  setFilter: (partial) => {
    set((state) => ({ filter: { ...state.filter, ...partial } }))
  },

  resetFilter: () => {
    set({ filter: initialFilter })
  },

  dismissException: (id) => {
    set((state) => ({
      dismissedExceptions: state.dismissedExceptions.includes(id)
        ? state.dismissedExceptions
        : [...state.dismissedExceptions, id],
    }))
  },

  approveNode: (applicationId, nodeId, comment) => {
    const now = new Date().toISOString()
    set((state) => {
      const updatedNodes = state.approvalNodes.map((n) =>
        n.id === nodeId ? { ...n, status: 'approved' as ApprovalNodeStatus, completedAt: now } : n
      )

      const appNodes = updatedNodes.filter((n) => n.applicationId === applicationId)
      const allApproved = appNodes.every(
        (n) => n.status === 'approved' || n.status === 'skipped'
      )

      const updatedApplications = state.applications.map((a) =>
        a.id === applicationId
          ? { ...a, status: allApproved ? ('approved' as ApplicationStatus) : a.status, updatedAt: now }
          : a
      )

      const newRecord: OperationRecord = {
        id: `record-${Date.now()}`,
        applicationId,
        operator: state.currentUser.name,
        operatorRole: state.currentUser.roleId,
        action: 'approve' as OperationAction,
        comment,
        timestamp: now,
      }

      return {
        approvalNodes: updatedNodes,
        applications: updatedApplications,
        operationRecords: [...state.operationRecords, newRecord],
      }
    })
  },

  rejectNode: (applicationId, nodeId, comment) => {
    const now = new Date().toISOString()
    set((state) => {
      const updatedNodes = state.approvalNodes.map((n) =>
        n.id === nodeId ? { ...n, status: 'rejected' as ApprovalNodeStatus, completedAt: now } : n
      )

      const updatedApplications = state.applications.map((a) =>
        a.id === applicationId ? { ...a, status: 'rejected' as ApplicationStatus, updatedAt: now } : a
      )

      const newRecord: OperationRecord = {
        id: `record-${Date.now()}`,
        applicationId,
        operator: state.currentUser.name,
        operatorRole: state.currentUser.roleId,
        action: 'reject' as OperationAction,
        comment,
        timestamp: now,
      }

      return {
        approvalNodes: updatedNodes,
        applications: updatedApplications,
        operationRecords: [...state.operationRecords, newRecord],
      }
    })
  },
}))
