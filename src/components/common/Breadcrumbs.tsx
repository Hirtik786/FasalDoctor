import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#64748B]" aria-label="Breadcrumb">
    <Link to="/" className="inline-flex items-center gap-1 hover:text-[#166534]">
      <Home className="h-3.5 w-3.5" />
    </Link>
    {items.map((item, idx) => (
      <React.Fragment key={idx}>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 rtl:rotate-180" />
        {item.to && idx < items.length - 1 ? (
          <Link to={item.to} className="hover:text-[#166534]">
            {item.label}
          </Link>
        ) : (
          <span className="font-semibold text-[#17251B]">{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);
