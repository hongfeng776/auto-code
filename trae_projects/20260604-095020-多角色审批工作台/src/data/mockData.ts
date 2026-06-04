import type { Role, User, Application, ApprovalNode, OperationRecord, Exception } from '@/types'

export const roles: Role[] = [
  {
    id: 'r1',
    name: '超级管理员',
    key: 'super_admin',
    permissions: ['查看所有申请', '审批流配置', '角色管理', '异常处理', '审批操作', '查看记录', '统计查看']
  },
  {
    id: 'r2',
    name: '部门主管',
    key: 'dept_manager',
    permissions: ['查看本部门申请', '审批本部门申请', '查看本部门记录', '统计查看']
  },
  {
    id: 'r3',
    name: '审批人',
    key: 'approver',
    permissions: ['审批分配节点', '查看相关记录']
  },
  {
    id: 'r4',
    name: '申请人',
    key: 'applicant',
    permissions: ['发起申请', '查看自己申请进度']
  }
]

export const currentUser: User = {
  id: 'u1',
  name: '张明',
  roleId: 'r2',
  department: '技术部',
  avatar: ''
}

export const users: User[] = [
  { id: 'u1', name: '张明', roleId: 'r2', department: '技术部', avatar: '' },
  { id: 'u2', name: '李华', roleId: 'r3', department: '财务部', avatar: '' },
  { id: 'u3', name: '王芳', roleId: 'r3', department: '市场部', avatar: '' },
  { id: 'u4', name: '赵强', roleId: 'r1', department: '管理层', avatar: '' },
  { id: 'u5', name: '陈晓', roleId: 'r4', department: '技术部', avatar: '' },
  { id: 'u6', name: '刘梅', roleId: 'r4', department: '市场部', avatar: '' }
]

export const applications: Application[] = [
  {
    id: 'APP-001',
    title: '服务器采购申请',
    department: '技术部',
    applicantId: 'u5',
    applicantName: '陈晓',
    status: 'in_progress',
    priority: 'high',
    description: '为满足业务增长需求，申请采购5台高性能服务器用于扩容生产环境集群',
    createdAt: '2026-05-20T09:00:00Z',
    updatedAt: '2026-05-22T14:30:00Z'
  },
  {
    id: 'APP-002',
    title: '市场推广预算',
    department: '市场部',
    applicantId: 'u6',
    applicantName: '刘梅',
    status: 'pending',
    priority: 'urgent',
    description: '申请Q3季度市场推广预算，涵盖线上广告投放、线下活动及品牌合作费用',
    createdAt: '2026-05-25T10:00:00Z',
    updatedAt: '2026-05-25T10:00:00Z'
  },
  {
    id: 'APP-003',
    title: '年度财务审计',
    department: '财务部',
    applicantId: 'u2',
    applicantName: '李华',
    status: 'approved',
    priority: 'medium',
    description: '启动2025年度公司财务审计流程，聘请外部审计机构进行全面审计',
    createdAt: '2026-04-01T08:30:00Z',
    updatedAt: '2026-04-10T16:00:00Z'
  },
  {
    id: 'APP-004',
    title: '新员工入职审批',
    department: '技术部',
    applicantId: 'u5',
    applicantName: '陈晓',
    status: 'rejected',
    priority: 'low',
    description: '申请新入职前端开发工程师的入职手续办理及设备配置',
    createdAt: '2026-05-10T11:00:00Z',
    updatedAt: '2026-05-12T09:15:00Z'
  },
  {
    id: 'APP-005',
    title: '办公设备更新',
    department: '技术部',
    applicantId: 'u5',
    applicantName: '陈晓',
    status: 'in_progress',
    priority: 'medium',
    description: '申请更换技术部老化办公设备，包括显示器、键鼠及人体工学椅',
    createdAt: '2026-05-18T13:30:00Z',
    updatedAt: '2026-05-21T11:00:00Z'
  },
  {
    id: 'APP-006',
    title: '客户合同审批',
    department: '市场部',
    applicantId: 'u6',
    applicantName: '刘梅',
    status: 'pending',
    priority: 'high',
    description: '审批与XX公司签订的年度战略合作框架合同，合同金额200万元',
    createdAt: '2026-05-28T09:00:00Z',
    updatedAt: '2026-05-28T09:00:00Z'
  },
  {
    id: 'APP-007',
    title: '差旅费报销',
    department: '财务部',
    applicantId: 'u2',
    applicantName: '李华',
    status: 'withdrawn',
    priority: 'low',
    description: '报销参加上海行业峰会的差旅费用，包含机票、住宿及交通费',
    createdAt: '2026-03-15T14:00:00Z',
    updatedAt: '2026-03-18T10:20:00Z'
  },
  {
    id: 'APP-008',
    title: '系统升级方案',
    department: '技术部',
    applicantId: 'u5',
    applicantName: '陈晓',
    status: 'in_progress',
    priority: 'urgent',
    description: '核心业务系统从v2升级至v3，涉及数据库迁移、微服务架构改造及灰度发布',
    createdAt: '2026-05-15T08:00:00Z',
    updatedAt: '2026-05-24T17:00:00Z'
  }
]

export const approvalNodes: ApprovalNode[] = [
  {
    id: 'n-001-1',
    applicationId: 'APP-001',
    name: '提交申请',
    type: 'submit',
    status: 'approved',
    approverRole: 'applicant',
    approverName: '陈晓',
    completedAt: '2026-05-20T09:00:00Z',
    order: 1,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-001-2',
    applicationId: 'APP-001',
    name: '部门主管审批',
    type: 'approval',
    status: 'approved',
    approverRole: 'dept_manager',
    approverName: '张明',
    completedAt: '2026-05-21T10:00:00Z',
    order: 2,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-001-3',
    applicationId: 'APP-001',
    name: '财务审批',
    type: 'approval',
    status: 'active',
    approverRole: 'approver',
    approverName: null,
    completedAt: null,
    order: 3,
    isOverPermission: false,
    isMissingApprover: true
  },
  {
    id: 'n-001-4',
    applicationId: 'APP-001',
    name: 'CEO审批',
    type: 'approval',
    status: 'pending',
    approverRole: 'super_admin',
    approverName: '赵强',
    completedAt: null,
    order: 4,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-002-1',
    applicationId: 'APP-002',
    name: '提交申请',
    type: 'submit',
    status: 'approved',
    approverRole: 'applicant',
    approverName: '刘梅',
    completedAt: '2026-05-25T10:00:00Z',
    order: 1,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-002-2',
    applicationId: 'APP-002',
    name: '部门主管审批',
    type: 'approval',
    status: 'active',
    approverRole: 'dept_manager',
    approverName: '王芳',
    completedAt: null,
    order: 2,
    isOverPermission: true,
    isMissingApprover: false
  },
  {
    id: 'n-002-3',
    applicationId: 'APP-002',
    name: '财务审批',
    type: 'approval',
    status: 'pending',
    approverRole: 'approver',
    approverName: '李华',
    completedAt: null,
    order: 3,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-003-1',
    applicationId: 'APP-003',
    name: '提交申请',
    type: 'submit',
    status: 'approved',
    approverRole: 'applicant',
    approverName: '李华',
    completedAt: '2026-04-01T08:30:00Z',
    order: 1,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-003-2',
    applicationId: 'APP-003',
    name: '部门主管审批',
    type: 'approval',
    status: 'approved',
    approverRole: 'dept_manager',
    approverName: '张明',
    completedAt: '2026-04-03T14:00:00Z',
    order: 2,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-003-3',
    applicationId: 'APP-003',
    name: '财务审批',
    type: 'approval',
    status: 'approved',
    approverRole: 'approver',
    approverName: '李华',
    completedAt: '2026-04-07T11:00:00Z',
    order: 3,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-003-4',
    applicationId: 'APP-003',
    name: 'CEO审批',
    type: 'approval',
    status: 'approved',
    approverRole: 'super_admin',
    approverName: '赵强',
    completedAt: '2026-04-10T16:00:00Z',
    order: 4,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-004-1',
    applicationId: 'APP-004',
    name: '提交申请',
    type: 'submit',
    status: 'approved',
    approverRole: 'applicant',
    approverName: '陈晓',
    completedAt: '2026-05-10T11:00:00Z',
    order: 1,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-004-2',
    applicationId: 'APP-004',
    name: '部门主管审批',
    type: 'approval',
    status: 'rejected',
    approverRole: 'dept_manager',
    approverName: '张明',
    completedAt: '2026-05-12T09:15:00Z',
    order: 2,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-004-3',
    applicationId: 'APP-004',
    name: '人事审批',
    type: 'approval',
    status: 'pending',
    approverRole: 'approver',
    approverName: '王芳',
    completedAt: null,
    order: 3,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-005-1',
    applicationId: 'APP-005',
    name: '提交申请',
    type: 'submit',
    status: 'approved',
    approverRole: 'applicant',
    approverName: '陈晓',
    completedAt: '2026-05-18T13:30:00Z',
    order: 1,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-005-2',
    applicationId: 'APP-005',
    name: '部门主管审批',
    type: 'approval',
    status: 'active',
    approverRole: 'dept_manager',
    approverName: '张明',
    completedAt: null,
    order: 2,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-005-3',
    applicationId: 'APP-005',
    name: '行政审批',
    type: 'approval',
    status: 'pending',
    approverRole: 'approver',
    approverName: '王芳',
    completedAt: null,
    order: 3,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-006-1',
    applicationId: 'APP-006',
    name: '提交申请',
    type: 'submit',
    status: 'pending',
    approverRole: 'applicant',
    approverName: '刘梅',
    completedAt: null,
    order: 1,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-006-2',
    applicationId: 'APP-006',
    name: '部门主管审批',
    type: 'approval',
    status: 'pending',
    approverRole: 'dept_manager',
    approverName: null,
    completedAt: null,
    order: 2,
    isOverPermission: true,
    isMissingApprover: true
  },
  {
    id: 'n-006-3',
    applicationId: 'APP-006',
    name: '法务审批',
    type: 'approval',
    status: 'pending',
    approverRole: 'approver',
    approverName: '李华',
    completedAt: null,
    order: 3,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-007-1',
    applicationId: 'APP-007',
    name: '提交申请',
    type: 'submit',
    status: 'approved',
    approverRole: 'applicant',
    approverName: '李华',
    completedAt: '2026-03-15T14:00:00Z',
    order: 1,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-007-2',
    applicationId: 'APP-007',
    name: '部门主管审批',
    type: 'approval',
    status: 'skipped',
    approverRole: 'dept_manager',
    approverName: '张明',
    completedAt: null,
    order: 2,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-007-3',
    applicationId: 'APP-007',
    name: '财务审批',
    type: 'approval',
    status: 'skipped',
    approverRole: 'approver',
    approverName: '王芳',
    completedAt: null,
    order: 3,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-008-1',
    applicationId: 'APP-008',
    name: '提交申请',
    type: 'submit',
    status: 'approved',
    approverRole: 'applicant',
    approverName: '陈晓',
    completedAt: '2026-05-15T08:00:00Z',
    order: 1,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-008-2',
    applicationId: 'APP-008',
    name: '部门主管审批',
    type: 'approval',
    status: 'approved',
    approverRole: 'dept_manager',
    approverName: '张明',
    completedAt: '2026-05-17T09:30:00Z',
    order: 2,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-008-3',
    applicationId: 'APP-008',
    name: '技术评审',
    type: 'approval',
    status: 'active',
    approverRole: 'approver',
    approverName: '李华',
    completedAt: null,
    order: 3,
    isOverPermission: false,
    isMissingApprover: false
  },
  {
    id: 'n-008-4',
    applicationId: 'APP-008',
    name: '安全评审',
    type: 'approval',
    status: 'pending',
    approverRole: 'approver',
    approverName: null,
    completedAt: null,
    order: 4,
    isOverPermission: false,
    isMissingApprover: true
  },
  {
    id: 'n-008-5',
    applicationId: 'APP-008',
    name: 'CEO审批',
    type: 'approval',
    status: 'pending',
    approverRole: 'super_admin',
    approverName: '赵强',
    completedAt: null,
    order: 5,
    isOverPermission: false,
    isMissingApprover: false
  }
]

export const operationRecords: OperationRecord[] = [
  {
    id: 'rec-001-1',
    applicationId: 'APP-001',
    operator: '陈晓',
    operatorRole: 'applicant',
    action: 'submit',
    comment: '提交服务器采购申请，详见附件清单',
    timestamp: '2026-05-20T09:00:00Z'
  },
  {
    id: 'rec-001-2',
    applicationId: 'APP-001',
    operator: '张明',
    operatorRole: 'dept_manager',
    action: 'approve',
    comment: '同意采购，请尽快推进后续流程',
    timestamp: '2026-05-21T10:00:00Z'
  },
  {
    id: 'rec-001-3',
    applicationId: 'APP-001',
    operator: '张明',
    operatorRole: 'dept_manager',
    action: 'transfer',
    comment: '财务审批人暂缺，已转交处理',
    timestamp: '2026-05-22T14:30:00Z'
  },
  {
    id: 'rec-002-1',
    applicationId: 'APP-002',
    operator: '刘梅',
    operatorRole: 'applicant',
    action: 'submit',
    comment: '提交Q3市场推广预算申请',
    timestamp: '2026-05-25T10:00:00Z'
  },
  {
    id: 'rec-003-1',
    applicationId: 'APP-003',
    operator: '李华',
    operatorRole: 'applicant',
    action: 'submit',
    comment: '启动年度财务审计流程',
    timestamp: '2026-04-01T08:30:00Z'
  },
  {
    id: 'rec-003-2',
    applicationId: 'APP-003',
    operator: '张明',
    operatorRole: 'dept_manager',
    action: 'approve',
    comment: '同意启动审计',
    timestamp: '2026-04-03T14:00:00Z'
  },
  {
    id: 'rec-003-3',
    applicationId: 'APP-003',
    operator: '李华',
    operatorRole: 'approver',
    action: 'approve',
    comment: '财务方面审核通过',
    timestamp: '2026-04-07T11:00:00Z'
  },
  {
    id: 'rec-003-4',
    applicationId: 'APP-003',
    operator: '赵强',
    operatorRole: 'super_admin',
    action: 'approve',
    comment: '批准执行',
    timestamp: '2026-04-10T16:00:00Z'
  },
  {
    id: 'rec-003-5',
    applicationId: 'APP-003',
    operator: '系统',
    operatorRole: 'super_admin',
    action: 'approve',
    comment: '流程完成，审计已启动',
    timestamp: '2026-04-10T16:01:00Z'
  },
  {
    id: 'rec-004-1',
    applicationId: 'APP-004',
    operator: '陈晓',
    operatorRole: 'applicant',
    action: 'submit',
    comment: '提交新员工入职审批申请',
    timestamp: '2026-05-10T11:00:00Z'
  },
  {
    id: 'rec-004-2',
    applicationId: 'APP-004',
    operator: '张明',
    operatorRole: 'dept_manager',
    action: 'reject',
    comment: '当前编制已满，暂不接受新入职',
    timestamp: '2026-05-12T09:15:00Z'
  },
  {
    id: 'rec-004-3',
    applicationId: 'APP-004',
    operator: '系统',
    operatorRole: 'super_admin',
    action: 'reject',
    comment: '申请已驳回',
    timestamp: '2026-05-12T09:16:00Z'
  },
  {
    id: 'rec-005-1',
    applicationId: 'APP-005',
    operator: '陈晓',
    operatorRole: 'applicant',
    action: 'submit',
    comment: '提交办公设备更新申请',
    timestamp: '2026-05-18T13:30:00Z'
  },
  {
    id: 'rec-005-2',
    applicationId: 'APP-005',
    operator: '张明',
    operatorRole: 'dept_manager',
    action: 'approve',
    comment: '同意更新，请行政配合采购',
    timestamp: '2026-05-21T11:00:00Z'
  },
  {
    id: 'rec-007-1',
    applicationId: 'APP-007',
    operator: '李华',
    operatorRole: 'applicant',
    action: 'submit',
    comment: '提交差旅费报销申请',
    timestamp: '2026-03-15T14:00:00Z'
  },
  {
    id: 'rec-007-2',
    applicationId: 'APP-007',
    operator: '张明',
    operatorRole: 'dept_manager',
    action: 'approve',
    comment: '同意报销',
    timestamp: '2026-03-17T09:00:00Z'
  },
  {
    id: 'rec-007-3',
    applicationId: 'APP-007',
    operator: '李华',
    operatorRole: 'applicant',
    action: 'withdraw',
    comment: '发票信息有误，撤回修改后重新提交',
    timestamp: '2026-03-18T10:20:00Z'
  },
  {
    id: 'rec-008-1',
    applicationId: 'APP-008',
    operator: '陈晓',
    operatorRole: 'applicant',
    action: 'submit',
    comment: '提交系统升级方案审批',
    timestamp: '2026-05-15T08:00:00Z'
  },
  {
    id: 'rec-008-2',
    applicationId: 'APP-008',
    operator: '张明',
    operatorRole: 'dept_manager',
    action: 'approve',
    comment: '方案可行，同意推进',
    timestamp: '2026-05-17T09:30:00Z'
  },
  {
    id: 'rec-008-3',
    applicationId: 'APP-008',
    operator: '李华',
    operatorRole: 'approver',
    action: 'approve',
    comment: '技术评审通过，建议关注安全评审环节',
    timestamp: '2026-05-24T17:00:00Z'
  }
]

export const exceptions: Exception[] = [
  {
    id: 'exc-1',
    type: 'over_permission',
    applicationId: 'APP-002',
    message: 'APP-002 部门主管审批节点存在越权操作风险，审批人权限超出规定范围',
    severity: 'high',
    timestamp: '2026-05-25T10:05:00Z'
  },
  {
    id: 'exc-2',
    type: 'missing_approver',
    applicationId: 'APP-001',
    message: 'APP-001 财务审批节点缺少审批人，流程无法继续推进',
    severity: 'medium',
    timestamp: '2026-05-22T14:30:00Z'
  },
  {
    id: 'exc-3',
    type: 'missing_approver',
    applicationId: 'APP-006',
    message: 'APP-006 部门主管审批节点缺少审批人，且存在越权风险',
    severity: 'high',
    timestamp: '2026-05-28T09:05:00Z'
  },
  {
    id: 'exc-4',
    type: 'empty_records',
    applicationId: 'APP-006',
    message: 'APP-006 无任何操作记录，请核实申请流程是否正常启动',
    severity: 'medium',
    timestamp: '2026-05-28T09:10:00Z'
  },
  {
    id: 'exc-5',
    type: 'missing_approver',
    applicationId: 'APP-008',
    message: 'APP-008 安全评审节点缺少审批人，存在安全隐患',
    severity: 'high',
    timestamp: '2026-05-24T17:05:00Z'
  }
]
