import React from 'react';
import { Calendar, Eye, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DISEASE_PROFILES } from '../../data/mockScans';
import { useLanguage } from '../../context/LanguageContext';
import type { DiseaseScan } from '../../types';
import { formatDate } from '../../utils/formatters';
import { StatusBadge } from './StatusBadge';

interface DiseaseResultCardProps {
  scan: DiseaseScan;
}

export const DiseaseResultCard: React.FC<DiseaseResultCardProps> = ({ scan }) => {
  const { language, t } = useLanguage();
  const profile = DISEASE_PROFILES[scan.disease];

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all hover:shadow-md flex flex-col">
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        <img
          src={scan.imageUrl}
          alt={profile.name[language]}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 start-3">
          <StatusBadge label={scan.status} />
        </div>
        {scan.isMockPrediction && (
          <span className="absolute bottom-2.5 end-2.5 rounded-lg bg-slate-900/75 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
            Demo Output
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-[#17251B]">
            {profile.name[language]}
          </h3>
          <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-bold text-[#166534]">
            {scan.confidence.toFixed(1)}%
          </span>
        </div>

        <div className="mt-2.5 space-y-1 text-xs text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(scan.scannedAt, language)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{scan.location}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-medium text-[#64748B]">ID: {scan.id}</span>
          <Link
            to={`/farmer/scan-results/${scan.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#166534] hover:bg-[#166534] hover:text-white transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            {t('viewDetails')}
          </Link>
        </div>
      </div>
    </div>
  );
};
