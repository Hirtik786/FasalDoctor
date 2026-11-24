import React, { useMemo, useState } from 'react';
import { Info, MessageSquarePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { ExpertProfileCard } from '../../components/common/ExpertProfileCard';
import { EmptyState } from '../../components/common/FeedbackStates';
import { SearchBar } from '../../components/common/SearchBar';
import { mockExperts } from '../../data/mockExperts';

export const ExpertsPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');

  const filtered = useMemo(() => {
    return mockExperts.filter((exp) => {
      if (availabilityFilter !== 'ALL' && exp.availability !== availabilityFilter) {
        return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          exp.name.toLowerCase().includes(q) ||
          exp.specialization.toLowerCase().includes(q) ||
          exp.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, availabilityFilter]);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/farmer/dashboard' },
          { label: 'Expert Consultation' },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17251B]">
            Agricultural Expert Consultation
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Independent human specialist support — submit crop photos and questions anytime without an AI scan
          </p>
        </div>

        <Link
          to="/farmer/consultation/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#14532D]"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Consultation Request
        </Link>
      </div>

      <div className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-[#64748B]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#166534]" />
        <p>
          These are <span className="font-semibold text-[#17251B]">fictional demonstration expert profiles</span> created to illustrate the FasalDoctor human consultation workflow. Do not treat demo profiles as licensed external practitioners.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search expert by name, specialization, or city..."
          className="flex-1 min-w-[220px]"
        />
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#17251B]"
        >
          <option value="ALL">All Availability</option>
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No experts match your search"
          description="Try clearing the availability filter or searching with another term."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((expert) => (
            <ExpertProfileCard key={expert.id} expert={expert} />
          ))}
        </div>
      )}
    </div>
  );
};
