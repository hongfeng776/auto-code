import { AlertTriangle, Users, ClipboardList, Phone, Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface EmptyStateProps {
  type: 'no-customer' | 'no-selection' | 'rule-missing' | 'no-tasks' | 'no-records' | 'no-data';
  className?: string;
}

const configs = {
  'no-customer': {
    icon: Users,
    title: '暂无客户数据',
    description: '当前系统中还没有客户信息，请先导入或添加客户',
    iconColor: 'text-navy-400',
    bgColor: 'bg-navy-50',
  },
  'no-selection': {
    icon: Search,
    title: '请选择一个客户',
    description: '从左侧客户列表中点击选择一个客户，查看详细信息',
    iconColor: 'text-navy-400',
    bgColor: 'bg-navy-50',
  },
  'rule-missing': {
    icon: AlertTriangle,
    title: '评分规则配置缺失',
    description: '该客户的健康评分规则尚未配置，请联系管理员完善',
    iconColor: 'text-warning-500',
    bgColor: 'bg-warning-50',
  },
  'no-tasks': {
    icon: ClipboardList,
    title: '暂无跟进任务',
    description: '该客户目前没有待处理的跟进任务',
    iconColor: 'text-navy-400',
    bgColor: 'bg-navy-50',
  },
  'no-records': {
    icon: Phone,
    title: '暂无触达记录',
    description: '该客户还没有历史触达记录',
    iconColor: 'text-navy-400',
    bgColor: 'bg-navy-50',
  },
  'no-data': {
    icon: Search,
    title: '数据加载中',
    description: '正在获取数据，请稍候...',
    iconColor: 'text-navy-400',
    bgColor: 'bg-navy-50',
  },
};

export function EmptyState({ type, className }: EmptyStateProps) {
  const config = configs[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 rounded-lg animate-fade-in',
        config.bgColor,
        className
      )}
    >
      <div className={cn('p-4 rounded-full mb-4 animate-breathe', config.bgColor)}>
        <Icon className={cn('w-10 h-10', config.iconColor)} />
      </div>
      <h3 className="text-base font-semibold text-navy-800 font-display mb-2">
        {config.title}
      </h3>
      <p className="text-sm text-navy-500 text-center max-w-xs">
        {config.description}
      </p>
    </div>
  );
}
