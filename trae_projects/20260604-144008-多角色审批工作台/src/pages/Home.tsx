import { LayoutDashboard } from 'lucide-react';
import { RolePermissionBanner } from '@/components/RolePermissionBanner';
import { ApplicationList } from '@/components/ApplicationList';
import { ApprovalFlow } from '@/components/ApprovalFlow';
import { OperationLogs } from '@/components/OperationLogs';
import { ApprovalActions } from '@/components/ApprovalActions';

export default function Home() {
  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#1e3a5f] text-white rounded-lg">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-gray-800"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                多角色审批工作台
              </h1>
              <p className="text-sm text-gray-500">Multi-role Approval Workbench</p>
            </div>
          </div>
        </header>

        <div className="mb-6">
          <RolePermissionBanner />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-[calc(100vh-280px)] min-h-[500px]">
            <ApplicationList />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[calc(100vh-280px)] min-h-[500px]">
                <ApprovalFlow />
              </div>
              <div className="h-[calc(100vh-280px)] min-h-[500px]">
                <OperationLogs />
              </div>
            </div>
            <ApprovalActions />
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-gray-400">
          <p>© 2026 多角色审批工作台 · 首版演示</p>
        </footer>
      </div>
    </div>
  );
}