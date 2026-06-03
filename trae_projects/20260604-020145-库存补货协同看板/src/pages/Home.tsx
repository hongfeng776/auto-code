import { Header } from '../components/Header';
import { WarehouseList } from '../components/WarehouseList';
import { SkuRisk } from '../components/SkuRisk';
import { Replenishment } from '../components/Replenishment';
import { SupplierCollab } from '../components/SupplierCollab';
import { TrendOverview } from '../components/TrendOverview';
import { SimulationAlert } from '../components/SimulationAlert';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-glow">
      <Header />
      
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-5">
            <WarehouseList />
          </div>
          
          <div className="col-span-12 lg:col-span-7">
            <SkuRisk />
          </div>

          <div className="col-span-12 lg:col-span-7">
            <Replenishment />
          </div>
          
          <div className="col-span-12 lg:col-span-5">
            <SupplierCollab />
          </div>

          <div className="col-span-12 lg:col-span-7">
            <TrendOverview />
          </div>
          
          <div className="col-span-12 lg:col-span-5">
            <SimulationAlert />
          </div>
        </div>
      </main>

      <footer className="max-w-[1600px] mx-auto px-6 py-6 border-t border-dark-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>© 2026 库存补货协同看板 · 供应链智能决策平台</span>
          <div className="flex items-center gap-4">
            <span>版本 v1.0.0</span>
            <span>|</span>
            <span>技术支持：供应链运营团队</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
