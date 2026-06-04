const ROLES = {
  admin: { id: 'admin', name: '系统管理员', permissions: ['approve_all', 'view_all', 'manage_users'] },
  dept_manager: { id: 'dept_manager', name: '部门经理', permissions: ['approve_dept', 'view_dept'] },
  finance: { id: 'finance', name: '财务主管', permissions: ['approve_finance', 'view_finance'] },
  hr: { id: 'hr', name: '人事主管', permissions: ['approve_hr', 'view_hr'] },
  general_manager: { id: 'general_manager', name: '总经理', permissions: ['approve_all', 'view_all'] },
}

const CURRENT_USER = {
  id: 'u_002',
  name: '王建国',
  roleId: 'dept_manager',
  role: ROLES.dept_manager,
}

const APPLICATIONS = [
  {
    id: 'APP-2026-001',
    title: '服务器扩容采购申请',
    applicant: '张三',
    applicantId: 'u_001',
    department: '技术部',
    type: 'procurement',
    status: 'pending',
    currentStep: 2,
    createdAt: '2026-06-01 09:30',
    amount: 85000,
  },
  {
    id: 'APP-2026-002',
    title: '新员工入职审批',
    applicant: '李四',
    applicantId: 'u_003',
    department: '人事部',
    type: 'hr',
    status: 'pending',
    currentStep: 1,
    createdAt: '2026-06-02 14:15',
    amount: null,
  },
  {
    id: 'APP-2026-003',
    title: '市场推广费用报销',
    applicant: '赵六',
    applicantId: 'u_005',
    department: '市场部',
    type: 'finance',
    status: 'approved',
    currentStep: 4,
    createdAt: '2026-05-28 10:00',
    amount: 32000,
  },
  {
    id: 'APP-2026-004',
    title: '办公区域装修申请',
    applicant: '孙七',
    applicantId: 'u_006',
    department: '行政部',
    type: 'procurement',
    status: 'rejected',
    currentStep: 3,
    createdAt: '2026-05-25 16:45',
    amount: 120000,
  },
  {
    id: 'APP-2026-005',
    title: '差旅费用报销',
    applicant: '周八',
    applicantId: 'u_007',
    department: '销售部',
    type: 'finance',
    status: 'pending',
    currentStep: 2,
    createdAt: '2026-06-03 08:20',
    amount: 15600,
  },
  {
    id: 'APP-2026-006',
    title: '年度培训计划审批',
    applicant: '吴九',
    applicantId: 'u_008',
    department: '人事部',
    type: 'hr',
    status: 'pending',
    currentStep: 1,
    createdAt: '2026-06-04 09:00',
    amount: 45000,
  },
]

const APPROVAL_NODES = {
  'APP-2026-001': [
    { id: 'n_001_1', step: 1, roleName: '部门经理', roleId: 'dept_manager', approverName: '王建国', approverId: 'u_002', status: 'approved', comment: '同意，技术部确实需要扩容', timestamp: '2026-06-01 11:20' },
    { id: 'n_001_2', step: 2, roleName: '财务主管', roleId: 'finance', approverName: '刘会计', approverId: 'u_004', status: 'pending', comment: '', timestamp: '' },
    { id: 'n_001_3', step: 3, roleName: '总经理', roleId: 'general_manager', approverName: '陈总', approverId: 'u_010', status: 'pending', comment: '', timestamp: '' },
  ],
  'APP-2026-002': [
    { id: 'n_002_1', step: 1, roleName: '人事主管', roleId: 'hr', approverName: null, approverId: null, status: 'pending', comment: '', timestamp: '' },
    { id: 'n_002_2', step: 2, roleName: '部门经理', roleId: 'dept_manager', approverName: '王建国', approverId: 'u_002', status: 'pending', comment: '', timestamp: '' },
    { id: 'n_002_3', step: 3, roleName: '总经理', roleId: 'general_manager', approverName: '陈总', approverId: 'u_010', status: 'pending', comment: '', timestamp: '' },
  ],
  'APP-2026-003': [
    { id: 'n_003_1', step: 1, roleName: '部门经理', roleId: 'dept_manager', approverName: '王建国', approverId: 'u_002', status: 'approved', comment: '费用合理', timestamp: '2026-05-28 14:30' },
    { id: 'n_003_2', step: 2, roleName: '财务主管', roleId: 'finance', approverName: '刘会计', approverId: 'u_004', status: 'approved', comment: '票据齐全，同意报销', timestamp: '2026-05-29 09:15' },
    { id: 'n_003_3', step: 3, roleName: '总经理', roleId: 'general_manager', approverName: '陈总', approverId: 'u_010', status: 'approved', comment: '同意', timestamp: '2026-05-30 10:00' },
    { id: 'n_003_4', step: 4, roleName: '财务主管', roleId: 'finance', approverName: '刘会计', approverId: 'u_004', status: 'approved', comment: '已打款', timestamp: '2026-05-31 16:00' },
  ],
  'APP-2026-004': [
    { id: 'n_004_1', step: 1, roleName: '部门经理', roleId: 'dept_manager', approverName: '王建国', approverId: 'u_002', status: 'approved', comment: '装修确有必要', timestamp: '2026-05-26 09:00' },
    { id: 'n_004_2', step: 2, roleName: '财务主管', roleId: 'finance', approverName: '刘会计', approverId: 'u_004', status: 'approved', comment: '预算范围内', timestamp: '2026-05-27 11:30' },
    { id: 'n_004_3', step: 3, roleName: '总经理', roleId: 'general_manager', approverName: '陈总', approverId: 'u_010', status: 'rejected', comment: '当前经济形势，暂缓非必要开支', timestamp: '2026-05-28 15:20' },
  ],
  'APP-2026-005': [
    { id: 'n_005_1', step: 1, roleName: '部门经理', roleId: 'dept_manager', approverName: '王建国', approverId: 'u_002', status: 'approved', comment: '出差已确认，同意报销', timestamp: '2026-06-03 10:30' },
    { id: 'n_005_2', step: 2, roleName: '财务主管', roleId: 'finance', approverName: '刘会计', approverId: 'u_004', status: 'pending', comment: '', timestamp: '' },
    { id: 'n_005_3', step: 3, roleName: '总经理', roleId: 'general_manager', approverName: null, approverId: null, status: 'pending', comment: '', timestamp: '' },
  ],
  'APP-2026-006': [
    { id: 'n_006_1', step: 1, roleName: '人事主管', roleId: 'hr', approverName: '李人事', approverId: 'u_009', status: 'pending', comment: '', timestamp: '' },
    { id: 'n_006_2', step: 2, roleName: '财务主管', roleId: 'finance', approverName: '刘会计', approverId: 'u_004', status: 'pending', comment: '', timestamp: '' },
    { id: 'n_006_3', step: 3, roleName: '总经理', roleId: 'general_manager', approverName: '陈总', approverId: 'u_010', status: 'pending', comment: '', timestamp: '' },
  ],
}

const OPERATION_RECORDS = {
  'APP-2026-001': [
    { id: 'r_001_1', operator: '张三', action: '提交申请', detail: '提交服务器扩容采购申请，金额 ¥85,000', timestamp: '2026-06-01 09:30' },
    { id: 'r_001_2', operator: '王建国', action: '审批通过', detail: '部门经理审批通过：同意，技术部确实需要扩容', timestamp: '2026-06-01 11:20' },
  ],
  'APP-2026-002': [
    { id: 'r_002_1', operator: '李四', action: '提交申请', detail: '提交新员工入职审批', timestamp: '2026-06-02 14:15' },
  ],
  'APP-2026-003': [
    { id: 'r_003_1', operator: '赵六', action: '提交申请', detail: '提交市场推广费用报销，金额 ¥32,000', timestamp: '2026-05-28 10:00' },
    { id: 'r_003_2', operator: '王建国', action: '审批通过', detail: '部门经理审批通过：费用合理', timestamp: '2026-05-28 14:30' },
    { id: 'r_003_3', operator: '刘会计', action: '审批通过', detail: '财务主管审批通过：票据齐全，同意报销', timestamp: '2026-05-29 09:15' },
    { id: 'r_003_4', operator: '陈总', action: '审批通过', detail: '总经理审批通过：同意', timestamp: '2026-05-30 10:00' },
    { id: 'r_003_5', operator: '刘会计', action: '完成打款', detail: '财务主管完成打款：已打款', timestamp: '2026-05-31 16:00' },
  ],
  'APP-2026-004': [
    { id: 'r_004_1', operator: '孙七', action: '提交申请', detail: '提交办公区域装修申请，金额 ¥120,000', timestamp: '2026-05-25 16:45' },
    { id: 'r_004_2', operator: '王建国', action: '审批通过', detail: '部门经理审批通过：装修确有必要', timestamp: '2026-05-26 09:00' },
    { id: 'r_004_3', operator: '刘会计', action: '审批通过', detail: '财务主管审批通过：预算范围内', timestamp: '2026-05-27 11:30' },
    { id: 'r_004_4', operator: '陈总', action: '审批驳回', detail: '总经理审批驳回：当前经济形势，暂缓非必要开支', timestamp: '2026-05-28 15:20' },
  ],
  'APP-2026-005': [
    { id: 'r_005_1', operator: '周八', action: '提交申请', detail: '提交差旅费用报销，金额 ¥15,600', timestamp: '2026-06-03 08:20' },
    { id: 'r_005_2', operator: '王建国', action: '审批通过', detail: '部门经理审批通过：出差已确认，同意报销', timestamp: '2026-06-03 10:30' },
  ],
  'APP-2026-006': [
    { id: 'r_006_1', operator: '吴九', action: '提交申请', detail: '提交年度培训计划审批，金额 ¥45,000', timestamp: '2026-06-04 09:00' },
  ],
}

const TYPE_ROLE_MAPPING = {
  procurement: ['dept_manager', 'finance', 'general_manager'],
  finance: ['dept_manager', 'finance', 'general_manager'],
  hr: ['hr', 'dept_manager', 'general_manager'],
}

export { ROLES, CURRENT_USER, APPLICATIONS, APPROVAL_NODES, OPERATION_RECORDS, TYPE_ROLE_MAPPING }
