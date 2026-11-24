import React, { useEffect, useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { DataTable, type Column } from '../../components/common/DataTable';
import { EmptyState, SkeletonLoader } from '../../components/common/FeedbackStates';
import { SearchBar } from '../../components/common/SearchBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { consultationService } from '../../services/consultationService';
import type { ConsultationRequest } from '../../types';
import { formatDate } from '../../utils/formatters';

interface ExpertRequestsPageProps {
  mode?: 'all' | 'assigned' | 'respond';
}

export const ExpertRequestsPage: React.FC<ExpertRequestsPageProps> = ({
  mode = 'all',
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();

  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [customStatusFilter, setCustomStatusFilter] = useState<string | null>(null);
  const statusFilter = customStatusFilter ?? (mode === 'respond' ? 'Pending' : 'ALL');
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const list = await consultationService.getExpertRequests();
        if (active) setRequests(list);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return requests.filter((req) => {
      if (mode === 'assigned') {
        const matchesExpert =
          req.expertId === user?.id || req.expertName === user?.name;
        if (!matchesExpert) return false;
      }
      if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          req.id.toLowerCase().includes(q) ||
          req.farmerName.toLowerCase().includes(q) ||
          req.subject.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [requests, mode, user?.id, user?.name, statusFilter, query]);

  const title =
    mode === 'assigned'
      ? 'My Assigned Cases'
      : mode === 'respond'
      ? 'Respond to Farmers'
      : 'Consultation Requests';

  const columns: Column<ConsultationRequest>[] = [
    {
      key: 'id',
      header: 'Request ID',
      render: (r) => <span className="font-bold text-[#166534]">{r.id}</span>,
    },
    {
      key: 'farmer',
      header: 'Farmer',
      render: (r) => (
        <div>
          <p className="font-semibold text-[#17251B]">{r.farmerName}</p>
          <p className="text-xs text-[#64748B]">{r.farmerLocation}</p>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Problem Subject',
      render: (r) => (
        <div className="max-w-xs">
          <p className="truncate font-medium text-[#17251B]">{r.subject}</p>
          <p className="text-xs text-[#64748B]">{r.category}</p>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Submitted',
      render: (r) => (
        <span className="text-xs text-[#64748B]">
          {formatDate(r.createdAt, language)}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (r) => <StatusBadge label={r.priority} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge label={r.status} />,
    },
    {
      key: 'action',
      header: 'Action',
      render: (r) => (
        <Link
          to={`/expert/requests/${r.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#166534] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#14532D] transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          Open Case
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Expert Dashboard', to: '/expert/dashboard' },
          { label: title },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-[#17251B]">{title}</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Triage incoming farmer inquiries, review leaf photos, and send actionable guidance
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by Request ID, farmer name, or subject..."
          className="flex-1 min-w-[220px]"
        />
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'Pending', 'Assigned', 'In Progress', 'Responded', 'Closed'].map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setCustomStatusFilter(st)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-[#166534] text-white'
                    : 'border border-slate-200 bg-[#F7FAF7] text-[#64748B] hover:text-[#166534]'
                }`}
              >
                {st === 'ALL' ? 'All' : st}
              </button>
            )
          )}
        </div>
      </div>

      {loading ? (
        <SkeletonLoader rows={4} />
      ) : (
        <DataTable
          data={filtered}
          columns={columns}
          keyExtractor={(r) => r.id}
          emptyState={
            <EmptyState
              title="No consultation requests match this filter"
              description="Try switching status tabs or clearing your search query."
            />
          }
        />
      )}
    </div>
  );
};
