import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import Home from '@/pages/Home'
import SkuRisk from '@/pages/SkuRisk'
import Replenishment from '@/pages/Replenishment'
import Supplier from '@/pages/Supplier'
import Trends from '@/pages/Trends'
import Simulation from '@/pages/Simulation'

function Layout() {
  return (
    <div className="flex min-h-screen bg-dark-900 bg-grid">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sku-risk" element={<SkuRisk />} />
          <Route path="/replenishment" element={<Replenishment />} />
          <Route path="/supplier" element={<Supplier />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/simulation" element={<Simulation />} />
        </Route>
      </Routes>
    </Router>
  )
}
