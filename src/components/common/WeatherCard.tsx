import React from 'react';
import { CloudRain, Droplets, MapPin, Thermometer, Wind } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { WeatherAdvisoryData } from '../../types';
import { StatusBadge } from './StatusBadge';

interface WeatherCardProps {
  weather: WeatherAdvisoryData;
  compact?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, compact = false }) => {
  const { language } = useLanguage();

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
            <MapPin className="h-3.5 w-3.5 text-[#166534]" />
            <span>{weather.location}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold tracking-tight text-[#17251B]">
              {weather.current.temperature}°C
            </span>
            <span className="text-sm font-medium text-[#64748B]">
              {weather.current.condition}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge label={`${weather.advisory.riskLevel} Risk`} variant={
            weather.advisory.riskLevel === 'High'
              ? 'high'
              : weather.advisory.riskLevel === 'Moderate'
              ? 'moderate'
              : 'healthy'
          } />
          <span className="text-[10px] font-medium text-[#64748B]">
            Indicative Weather Advisory
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-[#F7FAF7] p-3">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Droplets className="h-3.5 w-3.5 text-[#166534]" />
            Humidity
          </div>
          <p className="mt-1 text-base font-bold text-[#17251B]">
            {weather.current.humidity}%
          </p>
        </div>
        <div className="rounded-xl bg-[#F7FAF7] p-3">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <CloudRain className="h-3.5 w-3.5 text-[#166534]" />
            Rainfall
          </div>
          <p className="mt-1 text-base font-bold text-[#17251B]">
            {weather.current.rainfallMm} mm
          </p>
        </div>
        <div className="rounded-xl bg-[#F7FAF7] p-3">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Wind className="h-3.5 w-3.5 text-[#166534]" />
            Wind
          </div>
          <p className="mt-1 text-base font-bold text-[#17251B]">
            {weather.current.windSpeedKmh} km/h
          </p>
        </div>
        <div className="rounded-xl bg-[#F7FAF7] p-3">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Thermometer className="h-3.5 w-3.5 text-[#166534]" />
            Feels Like
          </div>
          <p className="mt-1 text-base font-bold text-[#17251B]">
            {weather.current.feelsLike}°C
          </p>
        </div>
      </div>

      {!compact && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900">
          <p className="font-semibold">{weather.advisory.headline[language]}</p>
          <p className="mt-1 leading-relaxed">{weather.advisory.message[language]}</p>
        </div>
      )}
    </div>
  );
};
