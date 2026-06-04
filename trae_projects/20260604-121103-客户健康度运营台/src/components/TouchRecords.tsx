import { MessageSquare, Phone, Mail, CalendarDays, User, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { EmptyState } from './EmptyState';
import { cn } from '../lib/utils';
import type { TouchRecord } from '../types';

const typeConfig = {
  call: { label: '电话', icon: Phone, className: 'bg-blue-100 text-blue-700 border-blue-200' },
  email: { label: '邮件', icon: Mail, className: 'bg-purple-100 text-purple-700 border-purple-200' },
  meeting: { label: '会议', icon: CalendarDays, className: 'bg-healthy-100 text-healthy-700 border-healthy-200' },
  message: { label: '消息', icon: MessageSquare, className: 'bg-warning-100 text-warning-700 border-warning-200' },
};

function RecordItem({ record, index, isLast }: { record: TouchRecord; index: number; isLast: boolean }) {
  const type = typeConfig[record.type];
  const TypeIcon = type.icon;

  return (
    <div className="relative pl-8 pb-6 animate-slide-up" style={{ animationDelay: `${index * 60}ms` }}>
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-navy-200" />
      )}
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-navy-300 flex items-center justify-center z-10">
        <TypeIcon className="w-3 h-3 text-navy-500" />
      </div>
      <div className="bg-navy-50 rounded-lg p-3 border border-navy-100 hover:border-navy-200 panel-transition">
        <div className="flex items-center justify-between mb-2">
          <span className={cn(
            'px-2 py-0.5 text-xs font-medium rounded-full border flex items-center gap-1',
            type.className
          )}>
            <TypeIcon className="w-3 h-3" />
            {type.label}
          </span>
          <span className="text-xs text-navy-500">{record.timestamp}</span>
        </div>
        <p className="text-sm text-navy-800 mb-2">{record.content}</p>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-navy-500">
            <User className="w-3.5 h-3.5" />
            <span>{record.operator}</span>
          </div>
          <div className="flex items-center gap-1 text-healthy-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{record.outcome}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TouchRecords() {
  const { selectedCustomerId, getCurrentRecords } = useAppStore();
  const records = getCurrentRecords();

  if (!selectedCustomerId) {
    return (
      <div className="h-full flex flex-col bg-white rounded-xl shadow-card border border-navy-100">
        <div className="p-4 border-b border-navy-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-navy-600" />
            <h2 className="font-display font-semibold text-navy-900">触达记录</h2>
          </div>
        </div>
        <div className="flex-1 p-4">
          <EmptyState type="no-selection" />
        </div>
      </div>
    );
  }

  const sortedRecords = [...records].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const callCount = records.filter(r => r.type === 'call').length;
  const meetingCount = records.filter(r => r.type === 'meeting').length;
  const emailCount = records.filter(r => r.type === 'email').length;
  const messageCount = records.filter(r => r.type === 'message').length;

  return (
    <div
      key={selectedCustomerId}
      className="h-full flex flex-col bg-white rounded-xl shadow-card border border-navy-100 animate-fade-in"
    >
      <div className="p-4 border-b border-navy-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-navy-600" />
            <h2 className="font-display font-semibold text-navy-900">触达记录</h2>
          </div>
          <span className="text-xs text-navy-500">共 {records.length} 条</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1 text-navy-500">
            <Phone className="w-3.5 h-3.5 text-blue-500" />
            <span>电话 {callCount}</span>
          </div>
          <div className="flex items-center gap-1 text-navy-500">
            <Mail className="w-3.5 h-3.5 text-purple-500" />
            <span>邮件 {emailCount}</span>
          </div>
          <div className="flex items-center gap-1 text-navy-500">
            <CalendarDays className="w-3.5 h-3.5 text-healthy-500" />
            <span>会议 {meetingCount}</span>
          </div>
          <div className="flex items-center gap-1 text-navy-500">
            <MessageSquare className="w-3.5 h-3.5 text-warning-500" />
            <span>消息 {messageCount}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {sortedRecords.length === 0 ? (
          <EmptyState type="no-records" />
        ) : (
          <div className="relative">
            {sortedRecords.map((record, index) => (
              <RecordItem
                key={record.id}
                record={record}
                index={index}
                isLast={index === sortedRecords.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
