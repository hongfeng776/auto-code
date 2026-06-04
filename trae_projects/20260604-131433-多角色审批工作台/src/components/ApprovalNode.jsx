const NODE_STATUS_MAP = {
  approved: { label: '已通过', icon: '✓', className: 'node-approved' },
  rejected: { label: '已驳回', icon: '✗', className: 'node-rejected' },
  pending: { label: '待审批', icon: '◎', className: 'node-pending' },
}

function ApprovalNode({ nodes, currentStep }) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="panel approval-node">
        <div className="panel-header">
          <h2>审批节点</h2>
        </div>
        <div className="panel-body empty-hint">
          <p>请从左侧选择一条申请查看审批流程</p>
        </div>
      </div>
    )
  }

  return (
    <div className="panel approval-node">
      <div className="panel-header">
        <h2>审批节点</h2>
        <span className="step-info">进度 {currentStep}/{nodes.length}</span>
      </div>
      <div className="panel-body">
        <div className="node-chain">
          {nodes.map((node, index) => {
            const statusInfo = NODE_STATUS_MAP[node.status] || NODE_STATUS_MAP.pending
            const isMissingApprover = !node.approverName
            const isCurrent = node.step === currentStep && node.status === 'pending'
            return (
              <div key={node.id} className="node-wrapper">
                <div className={`node-card ${statusInfo.className} ${isMissingApprover ? 'missing-approver' : ''} ${isCurrent ? 'current-node' : ''}`}>
                  <div className="node-step">步骤 {node.step}</div>
                  <div className="node-icon">{statusInfo.icon}</div>
                  <div className="node-info">
                    <div className="node-role">{node.roleName}</div>
                    <div className="node-approver">
                      {isMissingApprover ? (
                        <span className="missing-text">⚠ 缺少审批人</span>
                      ) : (
                        node.approverName
                      )}
                    </div>
                    <div className={`node-status ${statusInfo.className}`}>{statusInfo.label}</div>
                    {node.comment && <div className="node-comment">"{node.comment}"</div>}
                    {node.timestamp && <div className="node-time">{node.timestamp}</div>}
                  </div>
                </div>
                {index < nodes.length - 1 && (
                  <div className={`node-connector ${nodes[index + 1].status !== 'pending' ? 'connector-done' : ''}`}>
                    <div className="connector-line"></div>
                    <div className="connector-arrow">▼</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ApprovalNode
