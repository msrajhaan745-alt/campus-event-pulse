import React from 'react';
import { CalendarX, Search, FolderOpen, Inbox } from 'lucide-react';
import { Button } from './Button';

const ICONS = {
  events: CalendarX,
  search: Search,
  folder: FolderOpen,
  default: Inbox,
};

export function EmptyState({
  title = 'Nothing here yet',
  description = '',
  actionLabel = '',
  onAction = null,
  icon = 'default',
  className = '',
}) {
  const Icon = ICONS[icon] || ICONS.default;

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-[#eef2ff] flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-[#4f46e5]" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-bold text-[#0f1117] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[#6b7280] max-w-sm leading-relaxed mb-6">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
