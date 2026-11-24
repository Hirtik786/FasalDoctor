import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  CloudRain,
  Droplets,
  Info,
  Sun,
  Wind,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { SkeletonLoader } from '../../components/common/FeedbackStates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { WeatherCard } from '../../components/common/WeatherCard';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { weatherService } from '../../services/weatherService';
import type { WeatherAdvisoryData } from '../../types';

export const WeatherAdvisoryPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const locations = weatherService.getAvailableLocations();
  const [selectedLocation, setSelectedLocation] = useState(
    locations.includes(user?.location ?? '') ? (user?.location as string) : locations[0]
  );
  const [weather, setWeather] = useState<WeatherAdvisoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const data = await weatherService.getWeatherAdvisory(selectedLocation);
        if (active) setWeather(data);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [selectedLocation]);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/farmer/dashboard' },
          { label: 'Weather Advisory' },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17251B]">
            Weather-Based Crop Advisory
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Monitor temperature, humidity, and rainfall trends alongside indicative fungal risk alerts
          </p>
        </div>

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#17251B] shadow-xs"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {loading || !weather ? (
        <SkeletonLoader rows={4} />
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <WeatherCard weather={weather} />
            </div>

            {/* Disease-Risk Advisory Panel */}
            <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
                  <h2 className="text-base font-bold text-[#17251B]">
                    Crop Disease-Risk Advisory
                  </h2>
                </div>
                <StatusBadge label={weather.advisory.riskLevel} />
              </div>

              <p className="text-sm leading-relaxed text-[#64748B]">
                {weather.advisory.message[language]}
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-[#F7FAF7] p-3.5">
                  <p className="text-xs font-bold text-[#17251B]">
                    Key Environmental Factors
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-[#64748B]">
                    {weather.advisory.environmentalFactors[language].map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-emerald-50/60 p-3.5">
                  <p className="text-xs font-bold text-[#166534]">
                    Suggested Preventive Actions
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-[#17251B]">
                    {weather.advisory.preventiveActions[language].map((a, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#22C55E]" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-[#64748B]">
                <Info className="h-3.5 w-3.5 shrink-0 text-[#166534]" />
                <span>
                  Indicative environmental guidance only — not a confirmed disease diagnosis. Connected via Weather API service layer.
                </span>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Strip */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <h2 className="text-base font-bold text-[#17251B]">7-Day Melon Field Forecast</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {weather.forecast.map((day) => (
                <div
                  key={day.day}
                  className="rounded-2xl border border-slate-200/80 bg-[#F7FAF7] p-3.5 text-center space-y-2"
                >
                  <div>
                    <p className="text-sm font-bold text-[#17251B]">{day.day}</p>
                    <p className="text-[11px] text-[#64748B]">{day.date}</p>
                  </div>
                  <div className="flex justify-center">
                    {day.condition === 'Rain Showers' ? (
                      <CloudRain className="h-6 w-6 text-[#166534]" />
                    ) : day.condition === 'Breezy' ? (
                      <Wind className="h-6 w-6 text-[#166534]" />
                    ) : (
                      <Sun className="h-6 w-6 text-[#F59E0B]" />
                    )}
                  </div>
                  <p className="text-sm font-extrabold text-[#17251B]">
                    {day.tempMax}° <span className="font-normal text-[#64748B]">/ {day.tempMin}°</span>
                  </p>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-[#64748B]">
                    <Droplets className="h-3 w-3 text-[#166534]" />
                    {day.humidity}% • {day.rainfallMm}mm
                  </div>
                  <StatusBadge label={day.riskLevel} dot={false} />
                </div>
              ))}
            </div>
          </div>

          {/* Weather Trend Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <h3 className="text-base font-bold text-[#17251B]">
                Temperature Trend (°C)
              </h3>
              <p className="text-xs text-[#64748B] mb-4">
                Daytime high vs. overnight low temperatures
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weather.forecast} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="tempMax"
                      name="Max °C"
                      stroke="#166534"
                      fill="#22C55E"
                      fillOpacity={0.22}
                    />
                    <Area
                      type="monotone"
                      dataKey="tempMin"
                      name="Min °C"
                      stroke="#84CC16"
                      fill="#84CC16"
                      fillOpacity={0.15}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <h3 className="text-base font-bold text-[#17251B]">
                Humidity (%) & Rainfall (mm)
              </h3>
              <p className="text-xs text-[#64748B] mb-4">
                Key moisture indicators for foliar fungal scouting
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weather.forecast} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                    <Tooltip />
                    <Bar dataKey="humidity" name="Humidity %" fill="#166534" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="rainfallMm" name="Rainfall mm" fill="#84CC16" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
