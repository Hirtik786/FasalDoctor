import React from 'react';
import { AlertCircle, FolderOpen, Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ label?: string; className?: string }> = ({
  label = 'Loading...',
  className = '',
}) => (
  <div className={`flex flex-col items-center justify-center gap-3 py-10 ${className}`}>
    <Loader2 className="h-8 w-8 animate-spin text-[#166534]" />
    <p className="text-sm font-medium text-[#64748B]">{label}</p>
  </div>
);

export const SkeletonLoader: React.FC<{ rows?: number; className?: string }> = ({
  rows = 3,
  className = '',
}) => (
  <div className={`animate-pulse space-y-3 ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-16 rounded-2xl bg-slate-200/70" />
    ))}
  </div>
);

export const EmptyState: React.FC<{
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#166534]">
      <FolderOpen className="h-6 w-6" />
    </div>
    <h3 className="mt-4 text-base font-semibold text-[#17251B]">{title}</h3>
    <p className="mt-1.5 max-w-md text-sm text-[#64748B]">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const ErrorState: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
}> = ({ title = 'Something went wrong', message, onRetry }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 px-6 py-10 text-center">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-[#DC2626]">
      <AlertCircle className="h-6 w-6" />
    </div>
    <h3 className="mt-3 text-base font-semibold text-[#17251B]">{title}</h3>
    <p className="mt-1 max-w-md text-sm text-[#64748B]">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-xl bg-[#166534] px-4 py-2 text-sm font-semibold text-white hover:bg-[#14532D]"
      >
        Try Again
      </button>
    )}
  </div>
);
