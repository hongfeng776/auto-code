export type UserRole = 'employee' | 'manager' | 'finance' | 'director';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  avatar: string;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'processing';
export type ApplicationType = 'leave' | 'expense' | 'purchase' | 'contract';

export interface Application {
  id: string;
  title: string;
  type: ApplicationType;
  applicantId: string;
  applicantName: string;
  department: string;
  amount: number;
  status: ApplicationStatus;
  description: string;
  createdAt: string;
}

export type NodeStatus = 'pending' | 'approved' | 'rejected' | 'current' | 'skipped';

export interface ApprovalNode {
  id: string;
  applicationId: string;
  nodeName: string;
  roleRequired: UserRole;
  assigneeId: string | null;
  assigneeName: string | null;
  status: NodeStatus;
  comment: string | null;
  approvedAt: string | null;
  orderIndex: number;
  missingApprover: boolean;
}

export type LogAction = 'submit' | 'approve' | 'reject' | 'delegate' | 'comment';

export interface OperationLog {
  id: string;
  applicationId: string;
  operatorId: string;
  operatorName: string;
  action: LogAction;
  comment: string | null;
  timestamp: string;
}

export interface PermissionCheckResult {
  canOperate: boolean;
  reason?: string;
  currentNodeId?: string;
}
