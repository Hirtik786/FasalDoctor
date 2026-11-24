import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  tone?: 'green' | 'amber' | 'red' | 'slate';
  trend?: string;
}

const TONE_MAP = {
  green: 'bg-emerald-50 text-[#166534]',
  amber: 'bg-amber-50 text-[#F59E0B]',
  red: 'bg-red-50 text-[#DC2626]',
  slate: 'bg-slate-100 text-slate-700',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = 'green',
  trend,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#17251B] sm:text-3xl">
            {value}
          </p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TONE_MAP[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-[#64748B]">
          <span>{subtitle}</span>
          {trend && (
            <span className="font-semibold text-[#166534]">{trend}</span>
          )}
        </div>
      )}
    </div>
  );
};
