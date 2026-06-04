import { useEffect, useState } from 'react';
import { History, Send, CheckCircle2, XCircle, UserPlus, MessageSquare, Clock } from 'lucide-react';
import { useApprovalStore } from '@/store';
import { actionLabels } from '@/data/mockData';
import type { LogAction } from '@/types';

const actionConfig: Record<LogAction, { color: string; bgColor: string; icon: typeof Send }> = {
  submit: { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Send },
  approve: { color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle2 },
  reject: { color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle },
  delegate: { color: 'text-purple-600', bgColor: 'bg-purple-100', icon: UserPlus },
  comment: { color: 'text-gray-600', bgColor: 'bg-gray-100', icon: MessageSquare },
};

export function OperationLogs() {
  const { operationLogs, selectedApplicationId } = useApprovalStore();
  const [localLogs, setLocalLogs] = useState(operationLogs);

  useEffect(() => {
    if (selectedApplicationId) {
      const filtered = operationLogs
        .filter(l => l.applicationId === selectedApplicationId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLocalLogs(filtered);
    } else {
      setLocalLogs([]);
    }
  }, [selectedApplicationId, operationLogs]);

  if (!selectedApplicationId) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            操作记录
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <History size={48} className="mx-auto mb-3 opacity-50" />
            <p>请从左侧选择一条申请</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            操作记录
          </h2>
          <span className="text-xs text-gray-400">共 {localLogs.length} 条</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {localLogs.length === 0 ? (
          <div className="text-center text-gray-400 py-8">暂无操作记录</div>
        ) : (
          <div className="space-y-4">
            {localLogs.map((log) => {
              const config = actionConfig[log.action];
              const ActionIcon = config.icon;

              return (
                <div key={log.id} className="relative flex gap-4 pl-4">
                  <div className="absolute left-0 top-2 w-0.5 h-full bg-gray-100" />
                  
                  <div className="relative z-10 shrink-0">
                    <div className={`w-8 h-8 rounded-full ${config.bgColor} ${config.color} flex items-center justify-center`}>
                      <ActionIcon size={16} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${config.color}`}>
                            {actionLabels[log.action]}
                          </span>
                          <span className="text-sm text-gray-700">{log.operatorName}</span>
                        </div>
                        {log.comment && (
                          <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            {log.comment}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                        <Clock size={12} />
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
