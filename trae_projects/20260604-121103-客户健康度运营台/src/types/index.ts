export interface Customer {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  contactPhone: string;
  signupDate: string;
  healthLevel: 'healthy' | 'warning' | 'risk';
}

export interface ScoreDimension {
  name: string;
  score: number;
  weight: number;
}

export interface RiskScore {
  customerId: string;
  totalScore: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  dimensions: ScoreDimension[];
  lastUpdated: string;
  ruleMissing?: boolean;
}

export interface FollowUpTask {
  id: string;
  customerId: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  assignee: string;
  createdAt: string;
}

export interface TouchRecord {
  id: string;
  customerId: string;
  type: 'call' | 'email' | 'meeting' | 'message';
  content: string;
  operator: string;
  timestamp: string;
  outcome: string;
}

export interface AppState {
  customers: Customer[];
  riskScores: Record<string, RiskScore>;
  tasks: Record<string, FollowUpTask[]>;
  records: Record<string, TouchRecord[]>;
  selectedCustomerId: string | null;
  selectCustomer: (id: string | null) => void;
  getSelectedCustomer: () => Customer | undefined;
  getCurrentRiskScore: () => RiskScore | undefined;
  getCurrentTasks: () => FollowUpTask[];
  getCurrentRecords: () => TouchRecord[];
}
