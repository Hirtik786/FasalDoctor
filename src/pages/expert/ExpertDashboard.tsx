import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BriefcaseMedical,
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SkeletonLoader } from '../../components/common/FeedbackStates';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { consultationService } from '../../services/consultationService';
import type { ConsultationRequest } from '../../types';
import { formatDate, formatDateTime, getTimeGreeting } from '../../utils/formatters';

export const ExpertDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);

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

  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === 'Pending').length;
    const active = requests.filter(
      (r) => r.status === 'Assigned' || r.status === 'In Progress'
    ).length;
    const completed = requests.filter(
      (r) => r.status === 'Responded' || r.status === 'Closed'
    ).length;
    return {
      total: requests.length,
      pending,
      active,
      completed,
    };
  }, [requests]);

  const activityData = [
    { day: 'Mon', responses: 4, incoming: 5 },
    { day: 'Tue', responses: 6, incoming: 5 },
    { day: 'Wed', responses: 5, incoming: 7 },
    { day: 'Thu', responses: 7, incoming: 6 },
    { day: 'Fri', responses: 5, incoming: 4 },
    { day: 'Sat', responses: 3, incoming: 3 },
    { day: 'Sun', responses: 4, incoming: 2 },
  ];

  if (loading) return <SkeletonLoader rows={5} />;

  const incoming = requests.filter(
    (r) => r.status === 'Pending' || r.status === 'Assigned' || r.status === 'In Progress'
  );
  const assignedToMe = requests.filter(
    (r) => r.expertId === user?.id || r.expertName === user?.name
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#17251B] sm:text-3xl">
            {getTimeGreeting(language)}, {user?.name || 'Dr. Ahmed Khan'}
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Review farmer consultation requests, field photographs, and send bilingual crop guidance.
          </p>
        </div>
        <Link
          to="/expert/requests"
          className="inline-flex items-center gap-2 rounded-xl bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#14532D]"
        >
          <ClipboardList className="h-4 w-4" />
          Review All Requests
        </Link>
      </div>

      {/* 4 Widgets */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Requests"
          value={stats.total}
          subtitle="All farmer consultation cases"
          icon={ClipboardList}
          tone="green"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pending}
          subtitle="Awaiting initial triage"
          icon={Clock}
          tone="amber"
        />
        <StatCard
          title="Active Consultations"
          value={stats.active}
          subtitle="Assigned or in progress"
          icon={BriefcaseMedical}
          tone="slate"
        />
        <StatCard
          title="Completed Responses"
          value={stats.completed}
          subtitle="Responded or resolved"
          icon={CheckCircle2}
          tone="green"
        />
      </div>

      {/* Recent Incoming + Assigned Cases */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-[#17251B]">
                Recent Incoming Requests
              </h2>
              <p className="text-xs text-[#64748B]">
                Cases needing specialist review or follow-up
              </p>
            </div>
            <Link
              to="/expert/requests"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#166534] hover:underline"
            >
              View Queue <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {(incoming.length ? incoming : requests).slice(0, 4).map((req) => (
              <div
                key={req.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#166534]">{req.id}</span>
                    <StatusBadge label={req.priority} />
                  </div>
                  <p className="mt-1 truncate text-sm font-semibold text-[#17251B]">
                    {req.subject}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {req.farmerName} • {req.farmerLocation} •{' '}
                    {formatDate(req.createdAt, language)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge label={req.status} />
                  <Link
                    to={`/expert/requests/${req.id}`}
                    className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#166534] hover:bg-[#166534] hover:text-white transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-[#17251B]">My Assigned Cases</h2>
            <Link
              to="/expert/assigned"
              className="text-xs font-semibold text-[#166534] hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {(assignedToMe.length ? assignedToMe : requests.slice(0, 3)).map((c) => (
              <Link
                key={c.id}
                to={`/expert/requests/${c.id}`}
                className="block rounded-xl border border-slate-200/80 bg-[#F7FAF7] p-3.5 hover:border-[#166534]/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#166534]">{c.id}</span>
                  <StatusBadge label={c.status} />
                </div>
                <p className="mt-1 truncate text-sm font-semibold text-[#17251B]">
                  {c.subject}
                </p>
                <p className="mt-0.5 text-xs text-[#64748B]">
                  Farmer: {c.farmerName} ({c.cropType})
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Response Activity Chart & Recent Conversations */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <h2 className="text-base font-bold text-[#17251B]">
            Weekly Consultation Activity (Demo)
          </h2>
          <p className="text-xs text-[#64748B] mb-4">
            Incoming farmer requests vs. expert responses completed
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip />
                <Bar dataKey="incoming" name="Incoming" fill="#84CC16" radius={[6, 6, 0, 0]} />
                <Bar dataKey="responses" name="Responded" fill="#166534" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <MessageSquare className="h-4.5 w-4.5 text-[#166534]" />
            <h2 className="text-base font-bold text-[#17251B]">
              Recent Farmer Conversations
            </h2>
          </div>
          <div className="mt-3 space-y-3">
            {requests.slice(0, 4).map((req) => {
              const lastMsg = req.messages[req.messages.length - 1];
              return (
                <Link
                  key={req.id}
                  to={`/expert/requests/${req.id}`}
                  className="block rounded-xl border border-slate-100 bg-[#F7FAF7] p-3 hover:bg-emerald-50/40"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#17251B]">
                      {req.farmerName} ({req.id})
                    </span>
                    <span className="text-[#64748B]">
                      {lastMsg ? formatDateTime(lastMsg.timestamp, language) : ''}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-[#64748B]">
                    {lastMsg?.text}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
