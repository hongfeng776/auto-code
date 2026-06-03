import { useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, AlertTriangle, Package, Users, TrendingUp, FlaskConical, Warehouse } from 'lucide-react'
import { useInventoryStore } from '@/store/useInventoryStore'

const navItems = [
  { path: '/', label: '看板总览', icon: LayoutDashboard },
  { path: '/sku-risk', label: 'SKU风险', icon: AlertTriangle },
  { path: '/replenishment', label: '补货建议', icon: Package },
  { path: '/supplier', label: '供应商协同', icon: Users },
  { path: '/trends', label: '趋势概览', icon: TrendingUp },
  { path: '/simulation', label: '模拟预警', icon: FlaskConical },
]

export default function Sidebar() {
  const location = useLocation()
  const criticalCount = useInventoryStore((s) => s.getCriticalAlerts().length)

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-dark-800 flex flex-col border-r border-gray-800">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <Warehouse className="w-6 h-6 text-amber-500" />
        <h1 className="text-lg font-bold text-white">库存补货协同</h1>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path

          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 border-l-[3px] border-amber-500'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border-l-[3px] border-transparent'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{label}</span>
              {path === '/' && criticalCount > 0 && (
                <span className="ml-auto bg-amber-500 text-dark-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {criticalCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
