import { CURRENT_USER, TYPE_ROLE_MAPPING } from '../data/mockData'

const STATUS_MAP = {
  pending: { label: '待审批', className: 'status-pending' },
  approved: { label: '已通过', className: 'status-approved' },
  rejected: { label: '已驳回', className: 'status-rejected' },
}

const TYPE_MAP = {
  procurement: '采购类',
  finance: '财务类',
  hr: '人事类',
}

function canApprove(application) {
  const allowedRoles = TYPE_ROLE_MAPPING[application.type] || []
  return allowedRoles.includes(CURRENT_USER.roleId)
}

function ApplicationList({ applications, selectedId, onSelect }) {
  return (
    <div className="panel application-list">
      <div className="panel-header">
        <h2>申请列表</h2>
        <span className="badge">{applications.length}</span>
      </div>
      <div className="panel-body">
        {applications.map((app) => {
          const statusInfo = STATUS_MAP[app.status]
          const authorized = canApprove(app)
          return (
            <div
              key={app.id}
              className={`app-item ${selectedId === app.id ? 'selected' : ''} ${!authorized ? 'unauthorized' : ''}`}
              onClick={() => onSelect(app.id)}
            >
              <div className="app-item-top">
                <span className="app-id">{app.id}</span>
                <span className={`status-tag ${statusInfo.className}`}>
                  {statusInfo.label}
                </span>
              </div>
              <div className="app-item-title">{app.title}</div>
              <div className="app-item-meta">
                <span>{app.applicant} · {app.department}</span>
                <span className="app-type-tag">{TYPE_MAP[app.type]}</span>
              </div>
              {app.amount && (
                <div className="app-item-amount">¥{app.amount.toLocaleString()}</div>
              )}
              {!authorized && (
                <div className="app-item-warn">无审批权限</div>
              )}
              <div className="app-item-time">{app.createdAt}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ApplicationList
