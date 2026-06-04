import { ClipboardList, Calendar, User, Flag, Circle, CircleDot, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { EmptyState } from './EmptyState';
import { cn } from '../lib/utils';
import type { FollowUpTask } from '../types';

const priorityConfig = {
  high: { label: '高', className: 'bg-risk-100 text-risk-700 border-risk-200', dotColor: 'bg-risk-500' },
  medium: { label: '中', className: 'bg-warning-100 text-warning-700 border-warning-200', dotColor: 'bg-warning-500' },
  low: { label: '低', className: 'bg-healthy-100 text-healthy-700 border-healthy-200', dotColor: 'bg-healthy-500' },
};

const statusConfig = {
  pending: { label: '待处理', icon: Circle, className: 'text-navy-500' },
  in_progress: { label: '进行中', icon: CircleDot, className: 'text-blue-500' },
  completed: { label: '已完成', icon: CheckCircle2, className: 'text-healthy-500' },
};

function TaskCard({ task, index }: { task: FollowUpTask; index: number }) {
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div
      className="p-4 rounded-lg border border-navy-200 bg-white hover:border-navy-300 hover:shadow-card panel-transition animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <StatusIcon className={cn('w-4 h-4 flex-shrink-0', status.className)} />
          <h4 className="font-medium text-sm text-navy-800 truncate">{task.title}</h4>
        </div>
        <span className={cn(
          'px-2 py-0.5 text-xs font-medium rounded-full border flex items-center gap-1 flex-shrink-0 ml-2',
          priority.className
        )}>
          <span className={cn('w-1.5 h-1.5 rounded-full', priority.dotColor)} />
          {priority.label}
        </span>
      </div>
      <p className="text-xs text-navy-500 mb-3 line-clamp-2">{task.description}</p>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-navy-500">
            <Calendar className="w-3.5 h-3.5" />
            <span className={cn(isOverdue && 'text-risk-500 font-medium')}>
              截止 {task.dueDate}
            </span>
          </div>
          <div className="flex items-center gap-1 text-navy-500">
            <User className="w-3.5 h-3.5" />
            <span>{task.assignee}</span>
          </div>
        </div>
        <span className={cn('text-xs', status.className)}>
          {status.label}
        </span>
      </div>
    </div>
  );
}

export function FollowUpTasks() {
  const { selectedCustomerId, getCurrentTasks } = useAppStore();
  const tasks = getCurrentTasks();

  if (!selectedCustomerId) {
    return (
      <div className="h-full flex flex-col bg-white rounded-xl shadow-card border border-navy-100">
        <div className="p-4 border-b border-navy-100">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-navy-600" />
            <h2 className="font-display font-semibold text-navy-900">跟进任务</h2>
          </div>
        </div>
        <div className="flex-1 p-4">
          <EmptyState type="no-selection" />
        </div>
      </div>
    );
  }

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div
      key={selectedCustomerId}
      className="h-full flex flex-col bg-white rounded-xl shadow-card border border-navy-100 animate-fade-in"
    >
      <div className="p-4 border-b border-navy-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-navy-600" />
            <h2 className="font-display font-semibold text-navy-900">跟进任务</h2>
          </div>
          <span className="text-xs text-navy-500">共 {tasks.length} 项</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Circle className="w-3.5 h-3.5 text-navy-500" />
            <span className="text-navy-500">待处理 {pendingCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <CircleDot className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-navy-500">进行中 {inProgressCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-healthy-500" />
            <span className="text-navy-500">已完成 {completedCount}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tasks.length === 0 ? (
          <EmptyState type="no-tasks" />
        ) : (
          <div className="space-y-3">
            {tasks
              .sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              })
              .map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
