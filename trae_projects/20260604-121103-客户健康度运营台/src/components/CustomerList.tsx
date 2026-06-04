import { useState, useMemo } from 'react';
import { Search, Building2, User, Calendar, HeartPulse, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { EmptyState } from './EmptyState';
import { cn } from '../lib/utils';
import type { Customer } from '../types';

const healthLevelConfig = {
  healthy: {
    label: '健康',
    className: 'bg-healthy-100 text-healthy-700 border-healthy-200',
    icon: HeartPulse,
  },
  warning: {
    label: '预警',
    className: 'bg-warning-100 text-warning-700 border-warning-200',
    icon: AlertTriangle,
  },
  risk: {
    label: '高风险',
    className: 'bg-risk-100 text-risk-700 border-risk-200',
    icon: ShieldAlert,
  },
};

function CustomerCard({ customer, isSelected, onClick }: {
  customer: Customer;
  isSelected: boolean;
  onClick: () => void;
}) {
  const config = healthLevelConfig[customer.healthLevel];
  const StatusIcon = config.icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 rounded-lg border cursor-pointer panel-transition group',
        isSelected
          ? 'border-navy-800 bg-navy-50 shadow-card-hover -translate-y-0.5'
          : 'border-navy-200 bg-white hover:border-navy-300 hover:shadow-card hover:-translate-y-0.5'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building2 className={cn('w-5 h-5', isSelected ? 'text-navy-700' : 'text-navy-500')} />
          <h3 className={cn(
            'font-display font-semibold text-sm truncate max-w-[140px]',
            isSelected ? 'text-navy-900' : 'text-navy-800'
          )}>
            {customer.name}
          </h3>
        </div>
        <span className={cn(
          'px-2 py-0.5 text-xs font-medium rounded-full border flex items-center gap-1',
          config.className
        )}>
          <StatusIcon className="w-3 h-3" />
          {config.label}
        </span>
      </div>
      <div className="space-y-1.5 text-xs text-navy-500">
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5" />
          <span>{customer.contactName}</span>
          <span className="text-navy-400">·</span>
          <span>{customer.contactPhone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>{customer.industry}</span>
          <span className="text-navy-400">·</span>
          <span>入驻 {customer.signupDate}</span>
        </div>
      </div>
    </div>
  );
}

export function CustomerList() {
  const [searchTerm, setSearchTerm] = useState('');
  const { customers, selectedCustomerId, selectCustomer } = useAppStore();

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers;
    const term = searchTerm.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.industry.toLowerCase().includes(term) ||
        c.contactName.toLowerCase().includes(term)
    );
  }, [customers, searchTerm]);

  if (customers.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-navy-200">
          <h2 className="font-display font-semibold text-navy-900">客户列表</h2>
        </div>
        <div className="flex-1 p-4">
          <EmptyState type="no-customer" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-navy-200">
      <div className="p-4 border-b border-navy-200">
        <h2 className="font-display font-semibold text-navy-900 mb-3">客户列表</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="搜索客户名称、行业、联系人..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-400 transition-all bg-navy-50/50"
          />
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-navy-500">
          <span>共 {filteredCustomers.length} 个客户</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-healthy-500" />
              健康 {customers.filter(c => c.healthLevel === 'healthy').length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-warning-500" />
              预警 {customers.filter(c => c.healthLevel === 'warning').length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-risk-500" />
              风险 {customers.filter(c => c.healthLevel === 'risk').length}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredCustomers.length === 0 ? (
          <EmptyState type="no-data" />
        ) : (
          filteredCustomers.map((customer, index) => (
            <div key={customer.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <CustomerCard
                customer={customer}
                isSelected={selectedCustomerId === customer.id}
                onClick={() => selectCustomer(customer.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
