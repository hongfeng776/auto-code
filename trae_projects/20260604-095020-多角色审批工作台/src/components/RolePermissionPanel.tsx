import { useApprovalStore } from '@/store/useApprovalStore'
import { Shield, ShieldAlert, ShieldCheck, ShieldX, User, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function RolePermissionPanel() {
  const selectedApp = useApprovalStore((s) => s.getSelectedApplication())
  const currentUser = useApprovalStore((s) => s.currentUser)
  const nodes = useApprovalStore((s) => s.getSelectedNodes())
  const getNodePermissionInfo = useApprovalStore((s) => s.getNodePermissionInfo)
  const getCurrentUserRole = useApprovalStore((s) => s.getCurrentUserRole)

  const currentRole = getCurrentUserRole()

  if (!selectedApp) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-20">
        <Shield className="w-12 h-12 text-slate-600" />
        <p className="text-slate-500 text-sm">请选择申请查看权限</p>
      </div>
    )
  }

  const overPermissionNodes = nodes.filter((n) => n.isOverPermission)

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-sky-400" />
        <h3 className="text-base font-semibold text-slate-100">角色权限</h3>
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-slate-800/50 border border-slate-700/50 p-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 text-sm font-bold shrink-0">
          {currentUser.name.charAt(0)}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-200 truncate">{currentUser.name}</span>
            <span className="inline-flex items-center rounded-full bg-sky-500/15 px-2 py-0.5 text-[11px] font-medium text-sky-400">
              {currentRole?.name ?? ''}
            </span>
          </div>
          <span className="text-xs text-slate-500 truncate">{currentUser.department}</span>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/60">
              <th className="text-left px-3 py-2 text-xs font-medium text-slate-400">节点</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-slate-400">要求角色</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-slate-400">当前权限</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-slate-400">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {nodes.map((node) => {
              const permInfo = getNodePermissionInfo(node.id)
              const isOver = node.isOverPermission
              const isMissing = node.isMissingApprover
              const isMatching = permInfo.hasPermission

              return (
                <tr
                  key={node.id}
                  className={cn(
                    'transition-colors',
                    isOver && 'bg-red-500/5 border-l-2 border-red-500',
                    !isOver && isMissing && 'bg-amber-500/5 border-l-2 border-amber-500',
                    !isOver && !isMissing && isMatching && 'bg-sky-500/5 border-l-2 border-sky-500',
                    !isOver && !isMissing && !isMatching && 'border-l-2 border-transparent'
                  )}
                >
                  <td className="px-3 py-2.5 text-slate-300">{node.name}</td>
                  <td className="px-3 py-2.5 text-slate-400">{permInfo.roleDisplayName}</td>
                  <td className="px-3 py-2.5">
                    {permInfo.hasPermission ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        有权限
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <Lock className="w-3.5 h-3.5" />
                        无权限
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    {isOver ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
                        <ShieldAlert className="w-3 h-3" />
                        越权
                      </span>
                    ) : isMissing ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
                        <ShieldX className="w-3 h-3" />
                        缺审批人
                      </span>
                    ) : permInfo.hasPermission ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        <ShieldCheck className="w-3 h-3" />
                        正常
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {overPermissionNodes.length > 0 && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <span className="text-sm font-semibold text-red-400">越权风险提示</span>
          </div>
          <ul className="flex flex-col gap-1 mb-2">
            {overPermissionNodes.map((node) => (
              <li key={node.id} className="text-xs text-red-300/80 pl-7">
                {node.name}
              </li>
            ))}
          </ul>
          <p className="text-xs text-red-300/60 pl-7">
            当前用户角色权限超出该节点规定范围，请确认操作是否合规
          </p>
        </div>
      )}
    </div>
  )
}
