import { useMemo } from 'react'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Clock,
  Package,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts'
import { useInventoryStore } from '@/store/useInventoryStore'
import type { TrendDataPoint } from '@/types'

const tooltipStyle = {
  backgroundColor: '#1e1e35',
  border: '1px solid #2a2a4a',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#e8e8f0',
}

const labelStyle = { color: '#9898b0' }

interface KpiCardProps {
  label: string
  value: number
  icon: React.ReactNode
  trend: 'up' | 'down' | 'flat'
  invertColor?: boolean
}

function KpiCard({ label, value, icon, trend, invertColor }: KpiCardProps) {
  const isPositive = invertColor ? trend === 'down' : trend === 'up'
  const trendColor = trend === 'flat'
    ? 'text-gray-400'
    : isPositive
      ? 'text-emerald-400'
      : 'text-red-400'

  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : TrendingUp

  return (
    <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-dark-500/50 flex items-center justify-center">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="w-3.5 h-3.5" />
          {trend === 'flat' ? '—' : trend === 'up' ? '上升' : '下降'}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-100">{value.toLocaleString()}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  )
}

function getTrend(current: number, previous: number): 'up' | 'down' | 'flat' {
  if (current > previous) return 'up'
  if (current < previous) return 'down'
  return 'flat'
}

function OutOfStockDot(props: { payload?: TrendDataPoint; cx?: number; cy?: number }) {
  const { payload, cx = 0, cy = 0 } = props
  if (payload && payload.outOfStockCount > 10) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="#ef4444"
        stroke="#ef4444"
        strokeWidth={2}
        strokeOpacity={0.4}
      />
    )
  }
  return <circle cx={cx} cy={cy} r={3} fill="#ef4444" stroke="none" />
}

export default function Trends() {
  const trendData = useInventoryStore((s) => s.trendData)

  const { latest, previous, chartData } = useMemo(() => {
    const sorted = [...trendData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
    const latestPoint = sorted[sorted.length - 1]
    const previousPoint = sorted[sorted.length - 2]

    const formatted = sorted.map((d) => ({
      ...d,
      dateLabel: d.date.slice(5),
    }))

    return { latest: latestPoint, previous: previousPoint, chartData: formatted }
  }, [trendData])

  const kpis = [
    {
      label: '总库存量',
      value: latest.totalStock,
      icon: <Package className="w-5 h-5 text-blue-400" />,
      trend: getTrend(latest.totalStock, previous.totalStock),
      invertColor: false,
    },
    {
      label: '预警总数',
      value: latest.alertCount,
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      trend: getTrend(latest.alertCount, previous.alertCount),
      invertColor: true,
    },
    {
      label: '补货完成数',
      value: latest.replenishmentCount,
      icon: <Clock className="w-5 h-5 text-emerald-400" />,
      trend: getTrend(latest.replenishmentCount, previous.replenishmentCount),
      invertColor: false,
    },
    {
      label: '断货SKU数',
      value: latest.outOfStockCount,
      icon: <BarChart3 className="w-5 h-5 text-red-400" />,
      trend: getTrend(latest.outOfStockCount, previous.outOfStockCount),
      invertColor: true,
    },
  ]

  return (
    <div className="min-h-screen bg-dark-900 p-6 space-y-6 fade-in">
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-1">
          <TrendingUp className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl font-display font-bold text-gray-100">趋势概览</h1>
        </div>
        <p className="text-sm text-gray-500 ml-9">库存关键指标趋势与异常监控</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2 mb-4">
          <Package className="w-4 h-4 text-blue-400" />
          库存总量趋势
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
              <defs>
                <linearGradient id="totalStockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#2a2a4a" strokeDasharray="3 3" />
              <XAxis
                dataKey="dateLabel"
                tick={{ fill: '#686880', fontSize: 10 }}
                axisLine={{ stroke: '#2a2a4a' }}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fill: '#686880', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
              <Legend
                wrapperStyle={{ fontSize: '12px', color: '#9898b0' }}
              />
              <Area
                type="monotone"
                dataKey="totalStock"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#totalStockGradient)"
                name="总库存"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            预警数趋势
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                <CartesianGrid stroke="#2a2a4a" strokeDasharray="3 3" />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fill: '#686880', fontSize: 10 }}
                  axisLine={{ stroke: '#2a2a4a' }}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tick={{ fill: '#686880', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#9898b0' }} />
                <Line
                  type="monotone"
                  dataKey="alertCount"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#f59e0b' }}
                  activeDot={{ r: 5 }}
                  name="预警数"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-blue-400" />
            补货趋势
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                <CartesianGrid stroke="#2a2a4a" strokeDasharray="3 3" />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fill: '#686880', fontSize: 10 }}
                  axisLine={{ stroke: '#2a2a4a' }}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tick={{ fill: '#686880', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#9898b0' }} />
                <Bar
                  dataKey="replenishmentCount"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="补货完成数"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            断货SKU趋势
          </h3>
          <span className="text-xs text-gray-500 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
            圆点放大 = 超过10个断货SKU
          </span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
              <defs>
                <linearGradient id="outOfStockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#2a2a4a" strokeDasharray="3 3" />
              <XAxis
                dataKey="dateLabel"
                tick={{ fill: '#686880', fontSize: 10 }}
                axisLine={{ stroke: '#2a2a4a' }}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fill: '#686880', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#9898b0' }} />
              <Area
                type="monotone"
                dataKey="outOfStockCount"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#outOfStockGradient)"
                name="断货SKU数"
                dot={<OutOfStockDot />}
                activeDot={{ r: 5, fill: '#ef4444' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
