import type { Application, ApprovalNode, User, PermissionCheckResult } from '@/types';

export function checkPermission(
  application: Application | undefined,
  currentUser: User,
  nodes: ApprovalNode[]
): PermissionCheckResult {
  if (!application) {
    return { canOperate: false, reason: '请先选择一条申请' };
  }

  if (application.status === 'approved' || application.status === 'rejected') {
    return { canOperate: false, reason: '该申请已完成审批，不可再操作' };
  }

  const appNodes = nodes.filter(n => n.applicationId === application.id).sort((a, b) => a.orderIndex - b.orderIndex);

  if (appNodes.length === 0) {
    return { canOperate: false, reason: '该申请无审批节点' };
  }

  const currentNode = appNodes.find(n => n.status === 'current');

  if (!currentNode) {
    return { canOperate: false, reason: '该申请当前无待审批节点' };
  }

  if (currentNode.missingApprover) {
    return {
      canOperate: false,
      reason: `当前节点「${currentNode.nodeName}」尚未指派审批人，请先联系管理员`,
      currentNodeId: currentNode.id,
    };
  }

  if (currentNode.roleRequired !== currentUser.role) {
    return {
      canOperate: false,
      reason: `越权操作：当前节点「${currentNode.nodeName}」需要「${roleToLabel(currentNode.roleRequired)}」角色审批，您的角色是「${roleToLabel(currentUser.role)}」`,
      currentNodeId: currentNode.id,
    };
  }

  if (currentNode.assigneeId && currentNode.assigneeId !== currentUser.id) {
    return {
      canOperate: false,
      reason: `该节点已指派给「${currentNode.assigneeName}」审批，您无权限操作`,
      currentNodeId: currentNode.id,
    };
  }

  return { canOperate: true, currentNodeId: currentNode.id };
}

function roleToLabel(role: string): string {
  const map: Record<string, string> = {
    employee: '普通员工',
    manager: '部门主管',
    finance: '财务专员',
    director: '总经理',
  };
  return map[role] || role;
}
