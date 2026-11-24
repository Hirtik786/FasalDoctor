import React from 'react';
import { Award, Clock, Globe2, MapPin, MessageSquarePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import type { ExpertProfile } from '../../types';
import { getInitials } from '../../utils/formatters';
import { StatusBadge } from './StatusBadge';

interface ExpertProfileCardProps {
  expert: ExpertProfile;
}

export const ExpertProfileCard: React.FC<ExpertProfileCardProps> = ({ expert }) => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          {expert.avatarUrl ? (
            <img
              src={expert.avatarUrl}
              alt={expert.name}
              className="h-14 w-14 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#166534] text-base font-bold text-white">
              {getInitials(expert.name)}
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-[#17251B]">{expert.name}</h3>
            <p className="text-xs font-semibold text-[#166534]">
              {expert.specialization}
            </p>
            <p className="mt-0.5 text-[11px] text-[#64748B]">
              {expert.qualifications}
            </p>
          </div>
        </div>
        <StatusBadge label={expert.availability} />
      </div>

      <p className="mt-4 flex-1 text-xs leading-relaxed text-[#64748B]">
        {expert.bio[language]}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-[#F7FAF7] p-3 text-xs">
        <div className="flex items-center gap-1.5 text-[#17251B]">
          <Award className="h-3.5 w-3.5 text-[#166534]" />
          <span>{expert.experienceYears} yrs experience</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#17251B]">
          <MapPin className="h-3.5 w-3.5 text-[#166534]" />
          <span className="truncate">{expert.location}</span>
        </div>
        <div className="col-span-2 flex items-center gap-1.5 text-[#64748B]">
          <Globe2 className="h-3.5 w-3.5 text-[#166534]" />
          <span>{expert.languages.join(', ')}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]">
          <Clock className="h-3.5 w-3.5" />
          {expert.responseTimeLabel}
        </span>
        <Link
          to={`/farmer/consultation/new?expertId=${expert.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#166534] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#14532D] transition-colors"
        >
          <MessageSquarePlus className="h-3.5 w-3.5" />
          Consult
        </Link>
      </div>
    </div>
  );
};
