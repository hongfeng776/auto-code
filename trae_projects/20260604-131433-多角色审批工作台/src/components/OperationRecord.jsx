const ACTION_STYLE = {
  '提交申请': 'action-submit',
  '审批通过': 'action-approve',
  '审批驳回': 'action-reject',
  '完成打款': 'action-complete',
  '转交': 'action-transfer',
}

function OperationRecord({ records }) {
  if (!records || records.length === 0) {
    return (
      <div className="panel operation-record">
        <div className="panel-header">
          <h2>操作记录</h2>
        </div>
        <div className="panel-body empty-hint">
          <p>请从左侧选择一条申请查看操作记录</p>
        </div>
      </div>
    )
  }

  return (
    <div className="panel operation-record">
      <div className="panel-header">
        <h2>操作记录</h2>
        <span className="badge">{records.length}</span>
      </div>
      <div className="panel-body">
        <div className="record-timeline">
          {records.map((record, index) => (
            <div key={record.id} className="record-item">
              <div className="record-dot-column">
                <div className={`record-dot ${ACTION_STYLE[record.action] || ''}`}></div>
                {index < records.length - 1 && <div className="record-line"></div>}
              </div>
              <div className="record-content">
                <div className="record-header">
                  <span className="record-operator">{record.operator}</span>
                  <span className={`record-action ${ACTION_STYLE[record.action] || ''}`}>
                    {record.action}
                  </span>
                </div>
                <div className="record-detail">{record.detail}</div>
                <div className="record-time">{record.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OperationRecord
