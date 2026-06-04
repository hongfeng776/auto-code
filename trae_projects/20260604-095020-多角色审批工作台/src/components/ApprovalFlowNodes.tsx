import { useApprovalStore } from '@/store/useApprovalStore'
import { Check, X, Clock, AlertTriangle, UserX, ArrowRight, SkipForward, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'approved':
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500">
          <Check className="w-5 h-5 text-white" />
        </div>
      )
    case 'active':
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500 animate-pulse">
          <Check className="w-5 h-5 text-white" />
        </div>
      )
    case 'rejected':
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500">
          <X className="w-5 h-5 text-white" />
        </div>
      )
    case 'pending':
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-600">
          <Clock className="w-5 h-5 text-white" />
        </div>
      )
    case 'skipped':
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-700">
          <SkipForward className="w-5 h-5 text-slate-300" />
        </div>
      )
    default:
      return null
  }
}

function FlowNode({ node }: { node: import('@/types').ApprovalNode }) {
  return (
    <div
      className={cn(
        'flex-shrink-0 w-[180px] flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-800/60 border',
        node.isOverPermission
          ? 'border-red-500/50 shadow-lg shadow-red-500/20'
          : node.isMissingApprover
            ? 'border-amber-500/50 border-dashed'
            : 'border-slate-700/50'
      )}
    >
      <div className={cn(node.status === 'active' && 'ring-2 ring-sky-400/50 ring-offset-2 ring-offset-slate-900 rounded-full')}>
        <StatusIcon status={node.status} />
      </div>

      <span className="text-sm font-medium text-slate-200 text-center">{node.name}</span>

      {node.approverName ? (
        <div className="flex items-center gap-1">
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className="text-xs text-slate-400">{node.approverName}</span>
        </div>
      ) : node.isMissingApprover ? (
        <div className="flex items-center gap-1 border border-amber-500/30 bg-amber-500/10 rounded px-1.5 py-0.5">
          <UserX className="w-3 h-3 text-amber-400" />
          <span className="text-xs text-amber-400">审批人缺失</span>
        </div>
      ) : null}

      {node.completedAt && (
        <span className="text-xs text-slate-500">
          {new Date(node.completedAt).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </span>
      )}

      {node.isOverPermission && (
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-red-400" />
          <span className="text-xs text-red-400 bg-red-500/10 rounded px-1">越权风险</span>
        </div>
      )}
    </div>
  )
}

export default function ApprovalFlowNodes() {
  const selectedApp = useApprovalStore((s) => s.getSelectedApplication())
  const nodes = useApprovalStore((s) => s.getSelectedNodes())

  if (!selectedApp) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Clock className="w-10 h-10 mb-3" />
        <span>请从左侧选择一条申请</span>
      </div>
    )
  }

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-100">审批流程</h3>
        <p className="text-sm text-slate-400">{selectedApp.title}</p>
      </div>

      <div className="overflow-x-auto">
        <div className="flex items-center gap-0 min-w-max pb-2">
          {nodes.map((node, index) => (
            <div key={node.id} className="flex items-center">
              <FlowNode node={node} />
              {index < nodes.length - 1 && (
                <ChevronRight className="w-5 h-5 text-slate-600 flex-shrink-0 mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
