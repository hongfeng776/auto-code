import { useState, useMemo } from 'react';
import { ThumbsUp, ThumbsDown, AlertTriangle, Lock } from 'lucide-react';
import { useApprovalStore } from '@/store';
import { checkPermission } from '@/utils/permission';

export function ApprovalActions() {
  const {
    currentUser,
    applications,
    approvalNodes,
    selectedApplicationId,
    setPermissionMessage,
    approveCurrentNode,
    rejectCurrentNode,
  } = useApprovalStore();

  const [comment, setComment] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const selectedApp = applications.find(a => a.id === selectedApplicationId);

  const permissionResult = useMemo(() => {
    return checkPermission(selectedApp, currentUser, approvalNodes);
  }, [selectedApp, currentUser, approvalNodes]);

  const handleApprove = () => {
    if (!permissionResult.canOperate) {
      const hasMissingApprover = approvalNodes
        .filter(n => n.applicationId === selectedApplicationId)
        .some(n => n.missingApprover && n.status === 'current');

      setPermissionMessage({
        type: hasMissingApprover ? 'warning' : 'error',
        message: permissionResult.reason || '无操作权限',
      });
      return;
    }
    approveCurrentNode(comment || '同意');
    setComment('');
  };

  const handleReject = () => {
    if (!permissionResult.canOperate) {
      const hasMissingApprover = approvalNodes
        .filter(n => n.applicationId === selectedApplicationId)
        .some(n => n.missingApprover && n.status === 'current');

      setPermissionMessage({
        type: hasMissingApprover ? 'warning' : 'error',
        message: permissionResult.reason || '无操作权限',
      });
      return;
    }

    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }

    if (!comment.trim()) {
      setPermissionMessage({
        type: 'warning',
        message: '请填写拒绝原因',
      });
      return;
    }

    rejectCurrentNode(comment);
    setComment('');
    setShowRejectInput(false);
  };

  if (!selectedApplicationId || !selectedApp) {
    return null;
  }

  const hasMissingApprover = approvalNodes
    .filter(n => n.applicationId === selectedApplicationId)
    .some(n => n.missingApprover && n.status === 'current');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">审批操作</h3>

      {!permissionResult.canOperate && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
          hasMissingApprover
            ? 'bg-amber-50 text-amber-700 border border-amber-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {hasMissingApprover ? <AlertTriangle size={16} /> : <Lock size={16} />}
          <span>{permissionResult.reason}</span>
        </div>
      )}

      {showRejectInput && (
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">拒绝原因</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="请输入拒绝原因..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none"
            rows={3}
          />
        </div>
      )}

      {!showRejectInput && permissionResult.canOperate && (
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">审批意见（可选）</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="请输入审批意见..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none"
            rows={2}
          />
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleApprove}
          disabled={!permissionResult.canOperate}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            permissionResult.canOperate
              ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ThumbsUp size={16} />
          通过
        </button>
        <button
          onClick={handleReject}
          disabled={!permissionResult.canOperate}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            permissionResult.canOperate
              ? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ThumbsDown size={16} />
          {showRejectInput ? '确认拒绝' : '拒绝'}
        </button>
        {showRejectInput && (
          <button
            onClick={() => {
              setShowRejectInput(false);
              setComment('');
            }}
            className="px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
          >
            取消
          </button>
        )}
      </div>
    </div>
  );
}
