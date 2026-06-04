import { useState, useMemo } from 'react'
import { useApprovalStore } from '@/store/useApprovalStore'
import { Search, Filter, X, Clock, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ApplicationStatus, Priority } from '@/types'

const statusLabels: Record<ApplicationStatus, string> = {
  pending: '待审批',
  in_progress: '审批中',
  approved: '已通过',
  rejected: '已驳回',
  withdrawn: '已撤回',
}

const priorityLabels: Record<Priority, string> = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '紧急',
}

const statusBorderColors: Record<ApplicationStatus, string> = {
  pending: 'border-l-slate-400',
  in_progress: 'border-l-blue-500',
  approved: 'border-l-green-500',
  rejected: 'border-l-red-500',
  withdrawn: 'border-l-amber-500',
}

const statusBadgeColors: Record<ApplicationStatus, string> = {
  pending: 'bg-slate-500/20 text-slate-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  approved: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
  withdrawn: 'bg-amber-500/20 text-amber-400',
}

const priorityColors: Record<Priority, string> = {
  low: 'text-slate-500',
  medium: 'text-blue-400',
  high: 'text-amber-400',
  urgent: 'text-red-400',
}

export default function ApplicationList() {
  const [showFilters, setShowFilters] = useState(false)
  const {
    currentUser,
    filter,
    selectedApplicationId,
    applications,
    getFilteredApplications,
    selectApplication,
    setFilter,
  } = useApprovalStore()

  const departments = useMemo(() => {
    const depts = [...new Set(applications.map((a) => a.department))]
    depts.sort()
    return depts
  }, [applications])

  const filteredApps = getFilteredApplications()

  const allStatuses: ApplicationStatus[] = ['pending', 'in_progress', 'approved', 'rejected', 'withdrawn']
  const allPriorities: Priority[] = ['low', 'medium', 'high', 'urgent']

  return (
    <div className="w-[380px] flex-shrink-0 bg-slate-900 border-r border-slate-700/50 flex flex-col h-full">
      <div className="px-4 py-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-100">审批工作台</h1>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              <User className="w-3.5 h-3.5" />
              <span>{currentUser.name}</span>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              showFilters
                ? 'bg-sky-500/20 text-sky-400'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-slate-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={filter.keyword}
            onChange={(e) => setFilter({ keyword: e.target.value })}
            placeholder="搜索申请..."
            className="w-full bg-slate-800 border border-slate-700/50 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/50"
          />
          {filter.keyword && (
            <button
              onClick={() => setFilter({ keyword: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="px-4 py-3 border-b border-slate-700/50 space-y-2">
          <select
            value={filter.status ?? ''}
            onChange={(e) =>
              setFilter({
                status: (e.target.value as ApplicationStatus) || null,
              })
            }
            className="w-full bg-slate-800 text-slate-300 rounded-md px-2.5 py-1.5 text-xs border border-slate-700/50 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
          >
            <option value="">全部状态</option>
            {allStatuses.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>

          <select
            value={filter.department ?? ''}
            onChange={(e) =>
              setFilter({ department: e.target.value || null })
            }
            className="w-full bg-slate-800 text-slate-300 rounded-md px-2.5 py-1.5 text-xs border border-slate-700/50 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
          >
            <option value="">全部部门</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={filter.priority ?? ''}
            onChange={(e) =>
              setFilter({
                priority: (e.target.value as Priority) || null,
              })
            }
            className="w-full bg-slate-800 text-slate-300 rounded-md px-2.5 py-1.5 text-xs border border-slate-700/50 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
          >
            <option value="">全部优先级</option>
            {allPriorities.map((p) => (
              <option key={p} value={p}>
                {priorityLabels[p]}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {filteredApps.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            无匹配的申请
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredApps.map((app) => {
              const isSelected = selectedApplicationId === app.id
              return (
                <div
                  key={app.id}
                  onClick={() => selectApplication(app.id)}
                  className={cn(
                    'rounded-lg border-l-[3px] bg-slate-800/50 px-3 py-3 cursor-pointer transition-colors',
                    statusBorderColors[app.status],
                    isSelected
                      ? 'border-l-sky-500 bg-slate-700/50'
                      : 'hover:bg-slate-700/30'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-slate-100 leading-tight">
                      {app.title}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono mt-0.5 block">
                    {app.id}
                  </span>
                  <div className="text-xs text-slate-400 mt-1.5">
                    {app.department} · {app.applicantName}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                          statusBadgeColors[app.status]
                        )}
                      >
                        {statusLabels[app.status]}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-medium',
                          priorityColors[app.priority],
                          app.priority === 'urgent' && 'animate-pulse'
                        )}
                      >
                        {priorityLabels[app.priority]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(app.createdAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
