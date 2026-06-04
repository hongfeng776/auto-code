import { CURRENT_USER, TYPE_ROLE_MAPPING } from '../data/mockData'

function getPermissionHints(application, nodes) {
  const hints = []

  if (!application) return hints

  const allowedRoles = TYPE_ROLE_MAPPING[application.type] || []
  const hasPermission = allowedRoles.includes(CURRENT_USER.roleId)

  if (!hasPermission) {
    const allowedRoleNames = allowedRoles
      .map((rid) => {
        const roleMap = { dept_manager: '部门经理', finance: '财务主管', hr: '人事主管', general_manager: '总经理', admin: '系统管理员' }
        return roleMap[rid] || rid
      })
      .join('、')
    hints.push({
      type: 'unauthorized',
      level: 'error',
      icon: '🚫',
      title: '越权提示',
      message: `当前角色「${CURRENT_USER.role.name}」无权审批「${application.title}」，该类申请需由 ${allowedRoleNames} 审批`,
    })
  }

  if (nodes) {
    const missingNodes = nodes.filter((n) => n.status === 'pending' && !n.approverName)
    if (missingNodes.length > 0) {
      missingNodes.forEach((node) => {
        hints.push({
          type: 'missing_approver',
          level: 'warning',
          icon: '⚠️',
          title: '缺少审批人',
          message: `步骤 ${node.step}（${node.roleName}）尚未指定审批人，流程可能无法继续`,
        })
      })
    }
  }

  const currentNode = nodes?.find((n) => n.status === 'pending')
  if (currentNode && currentNode.approverId === CURRENT_USER.id && hasPermission) {
    hints.push({
      type: 'action_required',
      level: 'info',
      icon: '📋',
      title: '待您审批',
      message: `步骤 ${currentNode.step}（${currentNode.roleName}）正在等待您的审批`,
    })
  }

  if (application.status === 'approved') {
    hints.push({
      type: 'completed',
      level: 'success',
      icon: '✅',
      title: '审批完成',
      message: '该申请已完成全部审批流程',
    })
  }

  if (application.status === 'rejected') {
    hints.push({
      type: 'rejected_info',
      level: 'error',
      icon: '❌',
      title: '审批已驳回',
      message: '该申请已被驳回，流程终止',
    })
  }

  return hints
}

function RolePermissionHint({ application, nodes }) {
  const hints = getPermissionHints(application, nodes)

  return (
    <div className="panel role-permission-hint">
      <div className="panel-header">
        <h2>角色权限提示</h2>
        <span className="current-role">当前角色：{CURRENT_USER.role.name}</span>
      </div>
      <div className="panel-body">
        {hints.length === 0 ? (
          <div className="hint-empty">选择申请后，此处将显示权限与流程提示</div>
        ) : (
          <div className="hint-list">
            {hints.map((hint, index) => (
              <div key={index} className={`hint-item hint-${hint.level}`}>
                <span className="hint-icon">{hint.icon}</span>
                <div className="hint-content">
                  <div className="hint-title">{hint.title}</div>
                  <div className="hint-message">{hint.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RolePermissionHint
