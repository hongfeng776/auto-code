import { useState } from 'react'
import { useApprovalStore } from '@/store/useApprovalStore'
import { AlertTriangle, UserX, FileWarning, X, Bell, BellRing } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ExceptionType, ExceptionSeverity, Exception } from '@/types'

const typeConfig: Record<ExceptionType, { icon: typeof AlertTriangle; text: string; bg: string }> = {
  over_permission: { icon: AlertTriangle, text: 'text-red-400', bg: 'bg-red-500/10' },
  missing_approver: { icon: UserX, text: 'text-amber-400', bg: 'bg-amber-500/10' },
  empty_records: { icon: FileWarning, text: 'text-amber-400', bg: 'bg-amber-500/10' },
}

const severityConfig: Record<ExceptionSeverity, { label: string; text: string; bg: string }> = {
  high: { label: '高危', text: 'text-red-400', bg: 'bg-red-500/10' },
  medium: { label: '中危', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  low: { label: '低危', text: 'text-slate-400', bg: 'bg-slate-500/10' },
}

function ExceptionItem({ exception, onDismiss, onNavigate }: { exception: Exception; onDismiss: (id: string) => void; onNavigate: (appId: string) => void }) {
  const cfg = typeConfig[exception.type]
  const sev = severityConfig[exception.severity]
  const Icon = cfg.icon

  return (
    <div className="flex gap-3 rounded-lg p-3 hover:bg-slate-700/50 transition-colors">
      <div className={cn('flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg', cfg.bg)}>
        <Icon className={cn('w-4 h-4', cfg.text)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn('text-xs px-1.5 py-0.5 rounded', sev.bg, sev.text)}>{sev.label}</span>
        </div>
        <p className="text-sm text-slate-200 leading-snug">{exception.message}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <button
            onClick={() => onNavigate(exception.applicationId)}
            className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
          >
            {exception.applicationId}
          </button>
          <span className="text-xs text-slate-500">{new Date(exception.timestamp).toLocaleString('zh-CN')}</span>
        </div>
      </div>
      <button
        onClick={() => onDismiss(exception.id)}
        className="flex-shrink-0 p-1 rounded hover:bg-slate-600/50 text-slate-500 hover:text-slate-300 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function InlineExceptionItem({ exception, onDismiss }: { exception: Exception; onDismiss: (id: string) => void }) {
  const cfg = typeConfig[exception.type]
  const sev = severityConfig[exception.severity]
  const Icon = cfg.icon

  return (
    <div className={cn('flex items-center gap-2 rounded-lg px-3 py-2', cfg.bg)}>
      <Icon className={cn('w-4 h-4 flex-shrink-0', cfg.text)} />
      <span className={cn('text-xs px-1.5 py-0.5 rounded flex-shrink-0', sev.bg, sev.text)}>{sev.label}</span>
      <p className="text-xs text-slate-200 truncate flex-1">{exception.message}</p>
      <button
        onClick={() => onDismiss(exception.id)}
        className="flex-shrink-0 p-0.5 rounded hover:bg-slate-600/50 text-slate-500 hover:text-slate-300 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}

export default function ExceptionAlerts() {
  const [open, setOpen] = useState(false)
  const getActiveExceptions = useApprovalStore((s) => s.getActiveExceptions)
  const getSelectedExceptions = useApprovalStore((s) => s.getSelectedExceptions)
  const dismissException = useApprovalStore((s) => s.dismissException)
  const selectApplication = useApprovalStore((s) => s.selectApplication)

  const activeExceptions = getActiveExceptions()
  const selectedExceptions = getSelectedExceptions()
  const hasActive = activeExceptions.length > 0

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          {hasActive ? (
            <BellRing className={cn('w-5 h-5 text-amber-400', open ? '' : 'animate-pulse')} />
          ) : (
            <Bell className="w-5 h-5 text-slate-500" />
          )}
          {hasActive && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
              {activeExceptions.length}
            </span>
          )}
        </button>

        <div
          className={cn(
            'absolute top-full right-0 mt-2 w-[360px] bg-slate-800 border border-slate-700 rounded-xl shadow-xl transition-all duration-200 origin-top-right',
            open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          )}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-100">异常提醒</span>
              {hasActive && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
                  {activeExceptions.length}
                </span>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {hasActive ? (
              <div className="p-2 space-y-1">
                {activeExceptions.map((exc) => (
                  <ExceptionItem
                    key={exc.id}
                    exception={exc}
                    onDismiss={dismissException}
                    onNavigate={(appId) => {
                      selectApplication(appId)
                      setOpen(false)
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Bell className="w-8 h-8 text-slate-500" />
                <span className="text-sm text-slate-500">暂无异常</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedExceptions.length > 0 && (
        <div className="space-y-2 mb-4">
          {selectedExceptions.map((exc) => (
            <InlineExceptionItem
              key={exc.id}
              exception={exc}
              onDismiss={dismissException}
            />
          ))}
        </div>
      )}
    </>
  )
}
