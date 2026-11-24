import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  ClipboardList,
  CloudSun,
  Eye,
  MessageCircle,
  ScanLine,
  Stethoscope,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SkeletonLoader } from '../../components/common/FeedbackStates';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { WeatherCard } from '../../components/common/WeatherCard';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { DISEASE_PROFILES } from '../../data/mockScans';
import { consultationService } from '../../services/consultationService';
import { diseaseService } from '../../services/diseaseService';
import { weatherService } from '../../services/weatherService';
import type { ConsultationRequest, DiseaseScan, WeatherAdvisoryData } from '../../types';
import { formatDate, formatDateTime, getTimeGreeting } from '../../utils/formatters';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { notifications } = useNotifications();

  const [scans, setScans] = useState<DiseaseScan[]>([]);
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [weather, setWeather] = useState<WeatherAdvisoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      setLoading(true);
      try {
        const [scanList, reqList, weatherData] = await Promise.all([
          diseaseService.getScanHistory(user?.id),
          consultationService.getFarmerRequests(user?.id ?? 'farmer-1'),
          weatherService.getWeatherAdvisory(user?.location || 'Multan, Punjab'),
        ]);
        if (!active) return;
        setScans(scanList);
        setRequests(reqList);
        setWeather(weatherData);
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadDashboard();
    return () => {
      active = false;
    };
  }, [user?.id, user?.location]);

  const firstName = user?.name.split(' ')[0] || 'Ahmed';
  const greeting = getTimeGreeting(language);

  const stats = useMemo(() => {
    const healthyCount = scans.filter((s) => s.severity === 'healthy').length;
    const alertCount = scans.filter((s) => s.severity !== 'healthy').length;
    const pendingReq = requests.filter(
      (r) => r.status === 'Pending' || r.status === 'Assigned' || r.status === 'In Progress'
    ).length;
    return {
      totalScans: scans.length,
      healthyCount,
      alertCount,
      pendingReq,
    };
  }, [scans, requests]);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {
      'Healthy Leaf': 0,
      'Powdery Mildew': 0,
      'Downy Mildew': 0,
      Anthracnose: 0,
    };
    scans.forEach((s) => {
      counts[s.disease] = (counts[s.disease] || 0) + 1;
    });
    return [
      { name: 'Healthy', count: counts['Healthy Leaf'], color: '#22C55E' },
      { name: 'Powdery', count: counts['Powdery Mildew'], color: '#F59E0B' },
      { name: 'Downy', count: counts['Downy Mildew'], color: '#166534' },
      { name: 'Anthracnose', count: counts['Anthracnose'], color: '#DC2626' },
    ];
  }, [scans]);

  if (loading) {
    return <SkeletonLoader rows={5} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17251B] sm:text-3xl">
            {greeting}, {firstName}!
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            {language === 'ur'
              ? 'اپنی خربوزے کی فصل کی نگرانی کریں اور ذہین زرعی رہنمائی حاصل کریں۔'
              : 'Monitor your melon crops and get intelligent agricultural assistance.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/farmer/disease-detection"
            className="inline-flex items-center gap-2 rounded-xl bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#14532D] transition-colors"
          >
            <ScanLine className="h-4 w-4" />
            Scan a Leaf
          </Link>
          <Link
            to="/farmer/consultation/new"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#17251B] hover:bg-slate-50 transition-colors"
          >
            <Stethoscope className="h-4 w-4 text-[#166534]" />
            Consult an Expert
          </Link>
        </div>
      </div>

      {/* 4 Stat Widgets */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Scans"
          value={stats.totalScans}
          subtitle="All saved leaf screenings"
          icon={ScanLine}
          tone="green"
        />
        <StatCard
          title="Healthy Results"
          value={stats.healthyCount}
          subtitle="No disease patterns flagged"
          icon={CheckCircle2}
          tone="green"
        />
        <StatCard
          title="Disease Alerts"
          value={stats.alertCount}
          subtitle="Flagged for attention (demo)"
          icon={AlertTriangle}
          tone="amber"
        />
        <StatCard
          title="Pending Expert Requests"
          value={stats.pendingReq}
          subtitle="Active support cases"
          icon={ClipboardList}
          tone="slate"
        />
      </div>

      {/* A. Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Scan a Leaf',
            desc: 'Upload or capture a melon leaf image',
            to: '/farmer/disease-detection',
            icon: ScanLine,
          },
          {
            title: 'Check Weather',
            desc: '7-day forecast & fungal risk advisory',
            to: '/farmer/weather',
            icon: CloudSun,
          },
          {
            title: 'Ask AI Assistant',
            desc: 'English & Urdu voice/text guidance',
            to: '/farmer/assistant',
            icon: MessageCircle,
          },
          {
            title: 'Consult an Expert',
            desc: 'Independent human specialist support',
            to: '/farmer/experts',
            icon: Stethoscope,
          },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              to={action.to}
              className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-[#166534]/50 hover:shadow-md transition-all"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#166534] group-hover:bg-[#166534] group-hover:text-white transition-colors">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#17251B]">{action.title}</p>
                <p className="truncate text-xs text-[#64748B]">{action.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Two-Column Grid: Recent Disease Scans + Weather & Charts */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* B. Recent Disease Scans */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#17251B]">Recent Disease Scans</h2>
              <p className="text-xs text-[#64748B]">
                Latest leaf screening outputs (Demonstration records)
              </p>
            </div>
            <Link
              to="/farmer/scan-history"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#166534] hover:underline"
            >
              View All <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {scans.slice(0, 4).map((scan) => {
              const profile = DISEASE_PROFILES[scan.disease];
              return (
                <div
                  key={scan.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={scan.imageUrl}
                      alt={profile.name[language]}
                      className="h-12 w-12 shrink-0 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#17251B]">
                        {profile.name[language]}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {formatDate(scan.scannedAt, language)} • Confidence:{' '}
                        <span className="font-semibold text-[#17251B]">
                          {scan.confidence.toFixed(1)}%
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <StatusBadge label={scan.status} />
                    <Link
                      to={`/farmer/scan-results/${scan.id}`}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#17251B] hover:border-[#166534] hover:text-[#166534]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* C. Weather Overview */}
        <div className="lg:col-span-5 space-y-4">
          {weather && <WeatherCard weather={weather} compact />}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[#17251B]">3-Day Outlook</h2>
              <Link
                to="/farmer/weather"
                className="text-xs font-semibold text-[#166534] hover:underline"
              >
                7-Day Forecast →
              </Link>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {weather?.forecast.slice(0, 3).map((d) => (
                <div
                  key={d.day}
                  className="rounded-xl bg-[#F7FAF7] p-3 text-center border border-slate-100"
                >
                  <p className="text-xs font-bold text-[#17251B]">{d.day}</p>
                  <p className="mt-1 text-sm font-extrabold text-[#166534]">
                    {d.tempMax}° / {d.tempMin}°
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#64748B]">{d.humidity}% RH</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* D. Crop Health Summary Chart & E. Recent Notifications */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="mb-4">
            <h2 className="text-base font-bold text-[#17251B]">Crop Health Summary</h2>
            <p className="text-xs text-[#64748B]">
              Distribution of recent melon leaf classifications
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-[#166534]" />
              <h2 className="text-base font-bold text-[#17251B]">Recent Notifications</h2>
            </div>
            <Link
              to="/farmer/consultation/requests"
              className="text-xs font-semibold text-[#166534] hover:underline"
            >
              My Requests →
            </Link>
          </div>

          <div className="mt-3 space-y-2.5">
            {notifications.length === 0 ? (
              <p className="py-8 text-center text-xs text-[#64748B]">
                No notifications available.
              </p>
            ) : (
              notifications.slice(0, 4).map((notif) => (
                <Link
                  key={notif.id}
                  to={notif.link}
                  className={`block rounded-xl border p-3 transition-colors hover:bg-emerald-50/50 ${
                    notif.read
                      ? 'border-slate-100 bg-[#F7FAF7]'
                      : 'border-emerald-200 bg-emerald-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-[#17251B]">
                      {notif.title[language]}
                    </p>
                    <span className="text-[10px] text-[#64748B]">
                      {formatDateTime(notif.timestamp, language)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#64748B]">
                    {notif.message[language]}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
