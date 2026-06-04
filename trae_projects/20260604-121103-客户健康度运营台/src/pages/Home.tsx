import { HeartPulse, Settings, Bell } from 'lucide-react';
import { CustomerList } from '../components/CustomerList';
import { RiskScore } from '../components/RiskScore';
import { FollowUpTasks } from '../components/FollowUpTasks';
import { TouchRecords } from '../components/TouchRecords';

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-navy-50 to-navy-100">
      <header className="flex-shrink-0 h-16 bg-white border-b border-navy-200 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center shadow-lg">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-navy-900 tracking-tight">
              客户健康度运营台
            </h1>
            <p className="text-xs text-navy-500">Customer Health Operations Center</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-navy-100 transition-colors">
            <Bell className="w-5 h-5 text-navy-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-navy-100 transition-colors">
            <Settings className="w-5 h-5 text-navy-600" />
          </button>
          <div className="w-px h-8 bg-navy-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-healthy-500 to-healthy-700 flex items-center justify-center text-white text-xs font-semibold">
              运
            </div>
            <div>
              <p className="text-sm font-medium text-navy-800">运营经理</p>
              <p className="text-xs text-navy-500">管理员</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-[320px] flex-shrink-0">
          <CustomerList />
        </aside>

        <main className="flex-1 p-4 overflow-hidden">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:row-span-2 min-h-0">
              <RiskScore />
            </div>
            <div className="min-h-0">
              <FollowUpTasks />
            </div>
            <div className="min-h-0">
              <TouchRecords />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
