import { Shield, ShieldAlert, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useApprovalStore } from '@/store';
import { roleLabels } from '@/data/mockData';
import type { UserRole } from '@/types';

const rolePermissions: Record<UserRole, string> = {
  employee: '可查看自己提交的申请进度，提交新申请',
  manager: '可审批本部门员工提交的申请',
  finance: '可审批涉及财务的申请节点',
  director: '可审批大额及重要申请的最终节点',
};

export function RolePermissionBanner() {
  const { currentUser, setCurrentUserRole, permissionMessage, setPermissionMessage } = useApprovalStore();

  const roles: UserRole[] = ['employee', 'manager', 'finance', 'director'];

  const getBannerStyle = () => {
    if (!permissionMessage) {
      return 'bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] text-white';
    }
    switch (permissionMessage.type) {
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-green-500 text-white';
      case 'error':
        return 'bg-gradient-to-r from-red-600 to-red-500 text-white';
      case 'warning':
        return 'bg-gradient-to-r from-amber-600 to-amber-500 text-white';
      case 'info':
        return 'bg-gradient-to-r from-blue-600 to-blue-500 text-white';
      default:
        return 'bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] text-white';
    }
  };

  const getIcon = () => {
    if (!permissionMessage) return <Shield size={20} />;
    switch (permissionMessage.type) {
      case 'success':
        return <CheckCircle2 size={20} />;
      case 'error':
        return <ShieldAlert size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Shield size={20} />;
    }
  };

  return (
    <div className={`rounded-xl p-5 shadow-sm transition-all duration-300 ${getBannerStyle()}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            {getIcon()}
          </div>
          <div className="flex-1">
            {permissionMessage ? (
              <div>
                <h3 className="font-semibold text-base">{permissionMessage.message}</h3>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-base">
                    当前角色：
                    <span className="text-yellow-300">{roleLabels[currentUser.role]}</span>
                  </h3>
                  <span className="text-sm opacity-80">{currentUser.name}</span>
                </div>
                <p className="text-sm mt-1 opacity-90">{rolePermissions[currentUser.role]}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!permissionMessage && (
            <div className="flex items-center gap-1.5 bg-white/10 rounded-lg p-1">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setCurrentUserRole(role)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    currentUser.role === role
                      ? 'bg-white text-[#1e3a5f] shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {roleLabels[role]}
                </button>
              ))}
            </div>
          )}
          {permissionMessage && (
            <button
              onClick={() => setPermissionMessage(null)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
