import { useState } from 'react'
import { APPLICATIONS, APPROVAL_NODES, OPERATION_RECORDS, CURRENT_USER } from './data/mockData'
import ApplicationList from './components/ApplicationList'
import ApprovalNode from './components/ApprovalNode'
import RolePermissionHint from './components/RolePermissionHint'
import OperationRecord from './components/OperationRecord'
import './App.css'

function App() {
  const [selectedAppId, setSelectedAppId] = useState(null)

  const selectedApp = APPLICATIONS.find((a) => a.id === selectedAppId) || null
  const selectedNodes = selectedAppId ? (APPROVAL_NODES[selectedAppId] || []) : []
  const selectedRecords = selectedAppId ? (OPERATION_RECORDS[selectedAppId] || []) : []

  return (
    <div className="workbench">
      <header className="workbench-header">
        <div className="header-left">
          <h1 className="header-title">多角色审批工作台</h1>
          <span className="header-version">v1.0</span>
        </div>
        <div className="header-right">
          <span className="user-info">
            <span className="user-avatar">{CURRENT_USER.name.charAt(0)}</span>
            <span className="user-name">{CURRENT_USER.name}</span>
            <span className="user-role">{CURRENT_USER.role.name}</span>
          </span>
        </div>
      </header>

      <main className="workbench-body">
        <section className="area-left">
          <ApplicationList
            applications={APPLICATIONS}
            selectedId={selectedAppId}
            onSelect={setSelectedAppId}
          />
        </section>

        <section className="area-right">
          <div className="area-right-top">
            <ApprovalNode
              nodes={selectedNodes}
              currentStep={selectedApp?.currentStep || 0}
            />
          </div>
          <div className="area-right-bottom">
            <RolePermissionHint
              application={selectedApp}
              nodes={selectedNodes}
            />
            <OperationRecord records={selectedRecords} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
