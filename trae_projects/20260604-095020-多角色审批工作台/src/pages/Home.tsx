import ApplicationList from '@/components/ApplicationList'
import ApprovalFlowNodes from '@/components/ApprovalFlowNodes'
import RolePermissionPanel from '@/components/RolePermissionPanel'
import OperationTimeline from '@/components/OperationTimeline'
import StatisticsCharts from '@/components/StatisticsCharts'
import ExceptionAlerts from '@/components/ExceptionAlerts'
import { useApprovalStore } from '@/store/useApprovalStore'
import { LayoutDashboard, GitBranch, Shield, FileText, BarChart3 } from 'lucide-react'

export default function Home() {
  const selectedApp = useApprovalStore((s) => s.getSelectedApplication())

  return (
    <div className="h-screen flex bg-slate-950 text-slate-100 overflow-hidden">
      <ApplicationList />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-sky-400" />
            <h1 className="text-lg font-semibold text-slate-100">审批详情</h1>
            {selectedApp && (
              <span className="text-sm text-slate-400 font-mono">#{selectedApp.id}</span>
            )}
          </div>
          <ExceptionAlerts />
        </div>

        {selectedApp ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="rounded-xl bg-slate-900/50 border border-slate-700/50 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-100">{selectedApp.title}</h2>
                    <p className="text-sm text-slate-400 mt-1">
                      {selectedApp.department} · {selectedApp.applicantName} · {selectedApp.description}
                    </p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    selectedApp.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400' :
                    selectedApp.status === 'rejected' ? 'bg-red-500/15 text-red-400' :
                    selectedApp.status === 'in_progress' ? 'bg-sky-500/15 text-sky-400' :
                    selectedApp.status === 'withdrawn' ? 'bg-amber-500/15 text-amber-400' :
                    'bg-slate-500/15 text-slate-400'
                  }`}>
                    {selectedApp.status === 'approved' ? '已通过' :
                     selectedApp.status === 'rejected' ? '已驳回' :
                     selectedApp.status === 'in_progress' ? '审批中' :
                     selectedApp.status === 'withdrawn' ? '已撤回' : '待审批'}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <GitBranch className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">审批流程</h3>
                </div>
                <ApprovalFlowNodes />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-sky-400" />
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">角色权限</h3>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <RolePermissionPanel />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-sky-400" />
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">操作记录</h3>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4">
                    <OperationTimeline />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">审批统计</h3>
                </div>
                <StatisticsCharts />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-500">
            <LayoutDashboard className="w-16 h-16 text-slate-700" />
            <div className="text-center">
              <p className="text-lg font-medium text-slate-400">选择一条申请开始</p>
              <p className="text-sm text-slate-500 mt-1">从左侧列表中选择申请，查看审批流程、权限和记录</p>
            </div>
            <StatisticsCharts />
          </div>
        )}
      </div>
    </div>
  )
}
