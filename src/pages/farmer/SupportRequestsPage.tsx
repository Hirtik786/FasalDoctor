import React, { useEffect, useMemo, useState } from 'react';
import { Eye, MessageSquarePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
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

export const SupportRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const list = await consultationService.getFarmerRequests(user?.id ?? 'farmer-1');
        if (active) setRequests(list);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const filtered = useMemo(() => {
    return requests.filter((req) => {
      if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          req.id.toLowerCase().includes(q) ||
          req.subject.toLowerCase().includes(q) ||
          (req.expertName ?? '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [requests, statusFilter, query]);

  const columns: Column<ConsultationRequest>[] = [
    {
      key: 'id',
      header: 'Request ID',
      render: (r) => <span className="font-bold text-[#166534]">{r.id}</span>,
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (r) => (
        <div className="max-w-xs">
          <p className="truncate font-semibold text-[#17251B]">{r.subject}</p>
          <p className="truncate text-xs text-[#64748B]">
            Latest: {r.messages[r.messages.length - 1]?.text}
          </p>
        </div>
      ),
    },
    {
      key: 'expert',
      header: 'Expert',
      render: (r) => (
        <span className="text-xs font-medium text-[#17251B]">
          {r.expertName || 'Unassigned'}
        </span>
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
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge label={r.status} />,
    },
    {
      key: 'action',
      header: 'Action',
      render: (r) => (
        <Link
          to={`/farmer/consultation/${r.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#166534] hover:bg-[#166534] hover:text-white transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          View Details
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/farmer/dashboard' },
          { label: 'My Support Requests' },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17251B]">My Support Requests</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Track consultation tickets and review agricultural expert responses
          </p>
        </div>
        <Link
          to="/farmer/consultation/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#14532D]"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Consultation
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by Request ID, subject, or expert..."
          className="flex-1 min-w-[220px]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#17251B]"
        >
          <option value="ALL">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Responded">Responded</option>
          <option value="Closed">Closed</option>
        </select>
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
              title="No consultation requests found"
              description="Submit a consultation request to connect with an agricultural expert."
              action={
                <Link
                  to="/farmer/consultation/new"
                  className="rounded-xl bg-[#166534] px-4 py-2 text-sm font-semibold text-white"
                >
                  Create Request
                </Link>
              }
            />
          }
        />
      )}
    </div>
  );
};
