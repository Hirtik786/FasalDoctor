import React from 'react';

type BadgeVariant =
  | 'healthy'
  | 'moderate'
  | 'high'
  | 'pending'
  | 'assigned'
  | 'progress'
  | 'responded'
  | 'closed'
  | 'info'
  | 'available'
  | 'busy'
  | 'offline';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  healthy: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  available: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  responded: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  moderate: 'bg-amber-50 text-amber-800 border-amber-200',
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  busy: 'bg-amber-50 text-amber-800 border-amber-200',
  high: 'bg-red-50 text-red-700 border-red-200',
  assigned: 'bg-sky-50 text-sky-800 border-sky-200',
  progress: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  closed: 'bg-slate-100 text-slate-700 border-slate-200',
  offline: 'bg-slate-100 text-slate-600 border-slate-200',
  info: 'bg-emerald-50 text-[#166534] border-emerald-200',
};

export function mapStatusToVariant(status: string): BadgeVariant {
  const s = status.toLowerCase();
  if (s === 'healthy' || s === 'low' || s === 'responded' || s === 'available') {
    return 'healthy';
  }
  if (s === 'attention needed' || s === 'moderate' || s === 'medium' || s === 'pending' || s === 'busy') {
    return 'moderate';
  }
  if (s === 'action recommended' || s === 'high') {
    return 'high';
  }
  if (s === 'assigned') return 'assigned';
  if (s === 'in progress') return 'progress';
  if (s === 'closed' || s === 'offline') return 'closed';
  return 'info';
}

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant,
  dot = true,
}) => {
  const resolved = variant ?? mapStatusToVariant(label);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${VARIANT_CLASSES[resolved]}`}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      )}
      {label}
    </span>
  );
};
