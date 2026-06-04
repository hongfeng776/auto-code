import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Circle, AlertTriangle, User, ChevronRight } from 'lucide-react';
import { useApprovalStore } from '@/store';
import { roleLabels, statusLabels } from '@/data/mockData';
import type { NodeStatus } from '@/types';

const nodeStatusConfig: Record<NodeStatus, { color: string; bgColor: string; icon: typeof Circle }> = {
  approved: { color: 'text-green-500', bgColor: 'bg-green-500', icon: CheckCircle2 },
  rejected: { color: 'text-red-500', bgColor: 'bg-red-500', icon: XCircle },
  current: { color: 'text-[#1e3a5f]', bgColor: 'bg-[#1e3a5f]', icon: Circle },
  pending: { color: 'text-gray-400', bgColor: 'bg-gray-300', icon: Circle },
  skipped: { color: 'text-gray-400', bgColor: 'bg-gray-300', icon: Circle },
};

export function ApprovalFlow() {
  const { approvalNodes, selectedApplicationId, applications } = useApprovalStore();
  const [localNodes, setLocalNodes] = useState(approvalNodes);

  useEffect(() => {
    if (selectedApplicationId) {
      const filtered = approvalNodes
        .filter(n => n.applicationId === selectedApplicationId)
        .sort((a, b) => a.orderIndex - b.orderIndex);
      setLocalNodes(filtered);
    } else {
      setLocalNodes([]);
    }
  }, [selectedApplicationId, approvalNodes]);

  const selectedApp = applications.find(a => a.id === selectedApplicationId);

  if (!selectedApplicationId || !selectedApp) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            审批节点
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Circle size={48} className="mx-auto mb-3 opacity-50" />
            <p>请从左侧选择一条申请</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
          审批节点
        </h2>
        <div className="mt-2">
          <p className="text-sm text-gray-600 font-medium">{selectedApp.title}</p>
          <p className="text-xs text-gray-400 mt-1">
            {selectedApp.applicantName} · {selectedApp.department}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {localNodes.length === 0 ? (
          <div className="text-center text-gray-400 py-8">该申请暂无审批节点</div>
        ) : (
          <div className="relative">
          {localNodes.map((node, index) => {
            const config = nodeStatusConfig[node.status];
            const StatusIcon = config.icon;
            const isLast = index === localNodes.length - 1;

            return (
              <div key={node.id} className="relative flex gap-4 pb-6 last:pb-0">
                {!isLast && (
                  <div className="absolute left-[15px] top-[36px] w-0.5 h-[calc(100%-24px)] bg-gray-200" />
                )}

                <div className="relative z-10 shrink-0">
                  <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center text-white shadow-sm`}>
                    {node.status === 'current' ? (
                      <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                    ) : (
                      <StatusIcon size={18} />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${config.color}`}>{node.nodeName}</h3>
                        {node.missingApprover && (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                            <AlertTriangle size={12} />
                            待指派
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <User size={14} />
                        <span>
                          {node.assigneeName || '未指派'}
                        </span>
                        <ChevronRight size={12} className="text-gray-300" />
                        <span className="text-gray-400">
                          {roleLabels[node.roleRequired]}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      node.status === 'approved' ? 'bg-green-100 text-green-700' :
                      node.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      node.status === 'current' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {statusLabels[node.status]}
                    </span>
                  </div>

                  {node.comment && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100">
                      {node.comment}
                    </div>
                  )}

                  {node.approvedAt && (
                    <p className="mt-2 text-xs text-gray-400">
                      {node.approvedAt}
                    </p>
                  )}
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
