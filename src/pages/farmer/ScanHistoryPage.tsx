import React, { useEffect, useMemo, useState } from 'react';
import { Eye, LayoutGrid, List, ScanLine } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { DiseaseResultCard } from '../../components/common/DiseaseResultCard';
import { EmptyState, SkeletonLoader } from '../../components/common/FeedbackStates';
import { Pagination } from '../../components/common/Pagination';
import { SearchBar } from '../../components/common/SearchBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DISEASE_PROFILES } from '../../data/mockScans';
import { diseaseService } from '../../services/diseaseService';
import type { DiseaseScan } from '../../types';
import { formatDate } from '../../utils/formatters';

const PAGE_SIZE = 6;

export const ScanHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();

  const [scans, setScans] = useState<DiseaseScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [diseaseFilter, setDiseaseFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const list = await diseaseService.getScanHistory(user?.id);
        if (active) setScans(list);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const [referenceTime] = useState(() => Date.now());

  const filtered = useMemo(() => {
    return scans
      .filter((s) => {
        if (diseaseFilter !== 'ALL' && s.disease !== diseaseFilter) return false;
        if (dateFilter === '7D') {
          if (referenceTime - new Date(s.scannedAt).getTime() > 7 * 86400 * 1000) return false;
        } else if (dateFilter === '30D') {
          if (referenceTime - new Date(s.scannedAt).getTime() > 30 * 86400 * 1000) return false;
        }
        if (query.trim()) {
          const q = query.toLowerCase();
          return (
            s.disease.toLowerCase().includes(q) ||
            s.location.toLowerCase().includes(q) ||
            s.id.toLowerCase().includes(q) ||
            (s.notes ?? '').toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const da = new Date(a.scannedAt).getTime();
        const db = new Date(b.scannedAt).getTime();
        return sortOrder === 'newest' ? db - da : da - db;
      });
  }, [scans, diseaseFilter, dateFilter, query, sortOrder, referenceTime]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/farmer/dashboard' },
          { label: 'My Scan History' },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17251B]">My Scan History</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Review past melon leaf screenings, confidence scores, and block notes
          </p>
        </div>
        <Link
          to="/farmer/disease-detection"
          className="inline-flex items-center gap-2 rounded-xl bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#14532D]"
        >
          <ScanLine className="h-4 w-4" />
          New Leaf Scan
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search disease, block, or scan ID..."
          className="flex-1 min-w-[210px]"
        />

        <select
          value={diseaseFilter}
          onChange={(e) => setDiseaseFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-[#17251B]"
        >
          <option value="ALL">All Classifications</option>
          <option value="Healthy Leaf">Healthy Leaf</option>
          <option value="Powdery Mildew">Powdery Mildew</option>
          <option value="Downy Mildew">Downy Mildew</option>
          <option value="Anthracnose">Anthracnose</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-[#17251B]"
        >
          <option value="ALL">All Dates</option>
          <option value="7D">Last 7 Days</option>
          <option value="30D">Last 30 Days</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-[#17251B]"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <div className="inline-flex rounded-xl border border-slate-200 p-0.5">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`rounded-lg p-2 ${
              viewMode === 'grid'
                ? 'bg-[#166534] text-white'
                : 'text-[#64748B] hover:text-[#17251B]'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`rounded-lg p-2 ${
              viewMode === 'list'
                ? 'bg-[#166534] text-white'
                : 'text-[#64748B] hover:text-[#17251B]'
            }`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader rows={4} />
      ) : paginated.length === 0 ? (
        <EmptyState
          title="No matching scan records"
          description="Try clearing your filters or run a new melon leaf disease scan."
          action={
            <Link
              to="/farmer/disease-detection"
              className="rounded-xl bg-[#166534] px-4 py-2 text-sm font-semibold text-white"
            >
              Scan a Leaf
            </Link>
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((scan) => (
            <DiseaseResultCard key={scan.id} scan={scan} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="divide-y divide-slate-100">
            {paginated.map((scan) => {
              const profile = DISEASE_PROFILES[scan.disease];
              return (
                <div
                  key={scan.id}
                  className="flex flex-wrap items-center justify-between gap-4 p-4 hover:bg-[#F7FAF7]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={scan.imageUrl}
                      alt={profile.name[language]}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#17251B]">
                        {profile.name[language]}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {formatDate(scan.scannedAt, language)} • {scan.location} • Confidence:{' '}
                        <span className="font-semibold text-[#17251B]">
                          {scan.confidence.toFixed(1)}%
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge label={scan.status} />
                    <Link
                      to={`/farmer/scan-results/${scan.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#166534] hover:bg-[#166534] hover:text-white transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};
