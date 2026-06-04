import { useApprovalStore } from '@/store/useApprovalStore'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { BarChart3, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: { key: string; label: string; color: string }[] = [
  { key: 'pending', label: '待提交', color: '#64748b' },
  { key: 'in_progress', label: '审批中', color: '#0ea5e9' },
  { key: 'approved', label: '已完成', color: '#10b981' },
  { key: 'rejected', label: '已驳回', color: '#ef4444' },
  { key: 'withdrawn', label: '已撤回', color: '#f59e0b' },
]

const STATUS_LABEL_MAP: Record<string, string> = {
  pending: '待提交',
  in_progress: '审批中',
  approved: '已完成',
  rejected: '已驳回',
  withdrawn: '已撤回',
}

interface CustomTooltipProps {
  active?: boolean
  payload?: { name: string; value: number; payload?: { name: string; value: number } }[]
}

function PieCustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm">
      <p className="text-slate-200">{item.name}: <span className="font-semibold text-white">{item.value}</span></p>
    </div>
  )
}

interface BarTooltipProps {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}

function BarCustomTooltip({ active, payload, label }: BarTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm">
      <p className="text-slate-200 mb-1 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-slate-300">
          {STATUS_LABEL_MAP[entry.name] ?? entry.name}: <span className="font-semibold text-white">{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

function renderPieLabel({ name, percent }: { name: string; percent: number }) {
  return `${name} ${(percent * 100).toFixed(0)}%`
}

export default function StatisticsCharts() {
  const applications = useApprovalStore((s) => s.applications)

  const statusCounts = STATUS_CONFIG.map(({ key, label, color }) => ({
    name: label,
    value: applications.filter((a) => a.status === key).length,
    color,
  }))

  const total = applications.length
  const inProgressCount = applications.filter((a) => a.status === 'in_progress').length
  const approvedCount = applications.filter((a) => a.status === 'approved').length
  const rejectedCount = applications.filter((a) => a.status === 'rejected').length

  const departmentMap = new Map<string, Record<string, number>>()
  for (const app of applications) {
    if (!departmentMap.has(app.department)) {
      departmentMap.set(app.department, { pending: 0, in_progress: 0, approved: 0, rejected: 0, withdrawn: 0 })
    }
    const deptCounts = departmentMap.get(app.department)!
    deptCounts[app.status]++
  }

  const barData = Array.from(departmentMap.entries()).map(([dept, counts]) => ({
    department: dept,
    ...counts,
  }))

  const summaryCards = [
    { label: '总申请数', value: total, icon: FileText, bg: 'bg-slate-700/50', text: 'text-slate-200' },
    { label: '审批中', value: inProgressCount, icon: FileText, bg: 'bg-sky-500/10', text: 'text-sky-400' },
    { label: '已完成', value: approvedCount, icon: FileText, bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    { label: '已驳回', value: rejectedCount, icon: FileText, bg: 'bg-red-500/10', text: 'text-red-400' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-sky-400" />
        <h2 className="text-lg font-semibold text-slate-100">审批统计</h2>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {summaryCards.map((card) => (
          <div key={card.label} className={cn('rounded-xl p-3 border border-slate-700/50', card.bg)}>
            <div className="flex items-center gap-2 mb-1">
              <card.icon className={cn('h-4 w-4', card.text)} />
              <span className="text-xs text-slate-400">{card.label}</span>
            </div>
            <p className={cn('text-2xl font-bold', card.text)}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <h3 className="text-sm font-medium text-slate-300 mb-3">状态分布</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusCounts}
                cx="50%"
                cy="50%"
                outerRadius={70}
                dataKey="value"
                label={renderPieLabel}
                labelLine={false}
              >
                {statusCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieCustomTooltip />} />
              <Legend
                formatter={(value: string) => <span className="text-slate-300 text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <h3 className="text-sm font-medium text-slate-300 mb-3">部门审批统计</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis
                dataKey="department"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#475569' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#475569' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<BarCustomTooltip />} />
              <Legend
                formatter={(value: string) => <span className="text-slate-300 text-xs">{STATUS_LABEL_MAP[value] ?? value}</span>}
              />
              {STATUS_CONFIG.map(({ key, color }) => (
                <Bar key={key} dataKey={key} stackId="a" fill={color} radius={[0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
