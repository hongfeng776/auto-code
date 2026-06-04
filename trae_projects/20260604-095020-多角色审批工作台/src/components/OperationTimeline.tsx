import { useApprovalStore } from '@/store/useApprovalStore'
import { FileText, CheckCircle2, XCircle, ArrowRightLeft, Undo2, Send, Clock, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OperationAction } from '@/types'

const actionConfig: Record<OperationAction, { icon: React.ElementType; label: string; iconClass: string }> = {
  submit: { icon: Send, label: '提交申请', iconClass: 'bg-blue-500/20 text-blue-400' },
  approve: { icon: CheckCircle2, label: '审批通过', iconClass: 'bg-emerald-500/20 text-emerald-400' },
  reject: { icon: XCircle, label: '审批驳回', iconClass: 'bg-red-500/20 text-red-400' },
  transfer: { icon: ArrowRightLeft, label: '转交处理', iconClass: 'bg-amber-500/20 text-amber-400' },
  withdraw: { icon: Undo2, label: '撤回申请', iconClass: 'bg-slate-500/20 text-slate-400' },
}

const roleLabels: Record<string, string> = {
  super_admin: '超级管理员',
  dept_manager: '部门主管',
  approver: '审批人',
  applicant: '申请人',
}

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function OperationTimeline() {
  const selectedApplicationId = useApprovalStore((s) => s.selectedApplicationId)
  const getSelectedRecords = useApprovalStore((s) => s.getSelectedRecords)

  if (!selectedApplicationId) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <FileText className="mb-3 h-10 w-10" />
        <span>请选择申请查看记录</span>
      </div>
    )
  }

  const records = getSelectedRecords()

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <FileText className="h-4 w-4 text-slate-400" />
        <h3 className="text-sm font-medium text-slate-200">操作记录</h3>
        <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300">
          {records.length}
        </span>
      </div>

      {records.length === 0 ? (
        <div className="relative rounded-lg border border-amber-500/30 bg-amber-500/5 p-8">
          <span className="absolute right-3 top-3 rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
            ⚠ 记录为空
          </span>
          <div className="flex flex-col items-center text-center">
            <FileText className="mb-3 h-12 w-12 text-slate-700" />
            <p className="mb-1 text-sm text-slate-400">暂无操作记录</p>
            <p className="text-xs text-slate-500">该申请尚未产生任何操作记录，请核实流程是否正常启动</p>
          </div>
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto">
          <div className="relative ml-4 border-l-2 border-slate-700 pl-6">
            {records.map((record) => {
              const config = actionConfig[record.action]
              const Icon = config.icon

              return (
                <div key={record.id} className="relative pb-6 last:pb-0">
                  <div
                    className={cn(
                      'absolute -left-[31px] flex h-7 w-7 items-center justify-center rounded-full',
                      config.iconClass
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-200">{record.operator}</span>
                      <span className="rounded bg-slate-700/60 px-1.5 py-0.5 text-xs text-slate-400">
                        {roleLabels[record.operatorRole] ?? record.operatorRole}
                      </span>
                      <span className={cn('text-xs font-medium', {
                        'text-blue-400': record.action === 'submit',
                        'text-emerald-400': record.action === 'approve',
                        'text-red-400': record.action === 'reject',
                        'text-amber-400': record.action === 'transfer',
                        'text-slate-400': record.action === 'withdraw',
                      })}>
                        {config.label}
                      </span>
                    </div>

                    {record.comment && (
                      <div className="mb-2 flex items-start gap-1.5">
                        <MessageSquare className="mt-0.5 h-3 w-3 shrink-0 text-slate-500" />
                        <span className="text-sm text-slate-300">{record.comment}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(record.timestamp)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
