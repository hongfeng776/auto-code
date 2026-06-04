import { FileText, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useApprovalStore } from '@/store';
import { applicationTypeLabels, statusLabels } from '@/data/mockData';
import type { ApplicationStatus, ApplicationType } from '@/types';

const statusColors: Record<ApplicationStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const typeIcons: Record<ApplicationType, typeof FileText> = {
  leave: Clock,
  expense: FileText,
  purchase: FileText,
  contract: FileText,
};

export function ApplicationList() {
  const { applications, selectedApplicationId, selectApplication } = useApprovalStore();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
          申请列表
        </h2>
        <p className="text-sm text-gray-500 mt-1">共 {applications.length} 条申请</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {applications.map((app) => {
          const TypeIcon = typeIcons[app.type];
          const isSelected = selectedApplicationId === app.id;

          return (
            <div
              key={app.id}
              onClick={() => selectApplication(isSelected ? null : app.id)}
              className={`px-5 py-4 border-b border-gray-50 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-slate-50 border-l-4 border-l-[#1e3a5f]'
                  : 'hover:bg-gray-50 border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <TypeIcon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-gray-900 truncate">{app.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[app.status]} shrink-0`}>
                      {statusLabels[app.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <span>{applicationTypeLabels[app.type]}</span>
                    <span className="text-gray-300">·</span>
                    <span>{app.applicantName}</span>
                    <span className="text-gray-300">·</span>
                    <span>{app.department}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{app.createdAt}</span>
                    {app.amount > 0 && (
                      <span className="text-sm font-semibold text-[#1e3a5f]">
                        ¥{app.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
