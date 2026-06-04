export interface Role {
  id: string
  name: string
  key: string
  permissions: string[]
}

export interface User {
  id: string
  name: string
  roleId: string
  department: string
  avatar: string
}

export type ApplicationStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'withdrawn'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Application {
  id: string
  title: string
  department: string
  applicantId: string
  applicantName: string
  status: ApplicationStatus
  priority: Priority
  description: string
  createdAt: string
  updatedAt: string
}

export type ApprovalNodeType = 'submit' | 'approval' | 'cc'
export type ApprovalNodeStatus = 'pending' | 'active' | 'approved' | 'rejected' | 'skipped'

export interface ApprovalNode {
  id: string
  applicationId: string
  name: string
  type: ApprovalNodeType
  status: ApprovalNodeStatus
  approverRole: string
  approverName: string | null
  completedAt: string | null
  order: number
  isOverPermission: boolean
  isMissingApprover: boolean
}

export type OperationAction = 'submit' | 'approve' | 'reject' | 'transfer' | 'withdraw'

export interface OperationRecord {
  id: string
  applicationId: string
  operator: string
  operatorRole: string
  action: OperationAction
  comment: string
  timestamp: string
}

export type ExceptionSeverity = 'low' | 'medium' | 'high'
export type ExceptionType = 'over_permission' | 'missing_approver' | 'empty_records'

export interface Exception {
  id: string
  type: ExceptionType
  applicationId: string
  message: string
  severity: ExceptionSeverity
  timestamp: string
}
