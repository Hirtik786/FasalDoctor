import React, { useEffect, useState } from 'react';
import { MapPin, Phone, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { SkeletonLoader } from '../../components/common/FeedbackStates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { mockFarmers } from '../../data/mockFarmers';
import { consultationService } from '../../services/consultationService';
import type { ConsultationRequest } from '../../types';
import { formatDate } from '../../utils/formatters';

export const ExpertFarmerHistoryPage: React.FC = () => {
  const { language } = useLanguage();
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void consultationService.getExpertRequests().then((list) => {
      setRequests(list);
      setLoading(false);
    });
  }, []);

  if (loading) return <SkeletonLoader rows={4} />;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Expert Dashboard', to: '/expert/dashboard' },
          { label: 'Farmer History' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-[#17251B]">Farmer Consultation History</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Review past farmer cases and field history for longitudinal context
        </p>
      </div>

      <div className="space-y-5">
        {mockFarmers.map((farmer) => {
          const farmerCases = requests.filter(
            (r) => r.farmerId === farmer.id || r.farmerName === farmer.name
          );
          return (
            <div
              key={farmer.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#166534]">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#17251B]">{farmer.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {farmer.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {farmer.phone}
                      </span>
                      <span>Variety: {farmer.melonVariety}</span>
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-[#F7FAF7] px-3 py-1 text-xs font-semibold text-[#166534]">
                  {farmerCases.length} Recorded Cases
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {farmerCases.map((c) => (
                  <Link
                    key={c.id}
                    to={`/expert/requests/${c.id}`}
                    className="rounded-xl border border-slate-200/80 bg-[#F7FAF7] p-4 hover:border-[#166534] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#166534]">{c.id}</span>
                      <StatusBadge label={c.status} />
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-[#17251B]">
                      {c.subject}
                    </p>
                    <p className="mt-1 text-xs text-[#64748B]">
                      {formatDate(c.createdAt, language)} • {c.category}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
