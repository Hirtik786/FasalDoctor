import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BookmarkCheck,
  CheckCircle2,
  Download,
  ScanLine,
  ShieldAlert,
  Stethoscope,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { EmptyState, LoadingSpinner } from '../../components/common/FeedbackStates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { DISEASE_PROFILES } from '../../data/mockScans';
import { diseaseService } from '../../services/diseaseService';
import type { DiseaseScan } from '../../types';
import { formatDateTime } from '../../utils/formatters';

export const ScanResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const { showToast } = useToast();

  const [scan, setScan] = useState<DiseaseScan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        if (!id) return;
        const found = await diseaseService.getScanById(id);
        if (active) setScan(found ?? null);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <LoadingSpinner label="Loading scan report..." />;
  }

  if (!scan) {
    return (
      <EmptyState
        title="Scan record not found"
        description="The requested leaf scan ID could not be located in your local scan history."
        action={
          <Link
            to="/farmer/disease-detection"
            className="rounded-xl bg-[#166534] px-4 py-2 text-sm font-semibold text-white"
          >
            Run a New Leaf Scan
          </Link>
        }
      />
    );
  }

  const profile = DISEASE_PROFILES[scan.disease];

  const handleSaveToHistory = async () => {
    const updated = await diseaseService.saveScanToHistory(scan.id);
    if (updated) setScan(updated);
    showToast({
      type: 'success',
      title: 'Saved to Scan History',
      message: `Scan ${scan.id} is stored in your history.`,
    });
  };

  const handleDownloadReport = () => {
    const lines = [
      'FASALDOCTOR — MELON LEAF SCREENING REPORT (DEMO)',
      '================================================',
      `Scan ID: ${scan.id}`,
      `Date: ${formatDateTime(scan.scannedAt, 'en')}`,
      `Location: ${scan.location}`,
      `Possible Classification: ${profile.name.en} (${profile.name.ur})`,
      `Demo Confidence: ${scan.confidence.toFixed(1)}%`,
      `Status: ${scan.status}`,
      '',
      'IMPORTANT NOTICE:',
      'This result is a possible screening prediction for educational/demonstration purposes, not a confirmed agricultural or medical diagnosis. Verify all treatment steps with a qualified agronomist.',
      '',
      'SYMPTOMS:',
      ...profile.symptoms.en.map((s) => `- ${s}`),
      '',
      'PREVENTION MEASURES:',
      ...profile.prevention.en.map((p) => `- ${p}`),
      '',
      'TREATMENT GUIDANCE (Verify Before Use):',
      ...profile.treatment.en.map((tr) => `- ${tr}`),
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FasalDoctor-${scan.id}-Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast({ type: 'info', title: 'Report downloaded' });
  };

  const barColor =
    scan.severity === 'healthy'
      ? 'bg-[#22C55E]'
      : scan.severity === 'moderate'
      ? 'bg-[#F59E0B]'
      : 'bg-[#DC2626]';

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/farmer/dashboard' },
          { label: 'Scan History', to: '/farmer/scan-history' },
          { label: `Result ${scan.id}` },
        ]}
      />

      {/* Non-diagnostic Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs sm:text-sm text-amber-950">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#F59E0B]" />
        <div>
          <p className="font-bold">
            Possible Prediction (Demonstration Output) — Not a Guaranteed Diagnosis
          </p>
          <p className="mt-0.5 leading-relaxed text-amber-900">
            Treatment recommendations below are general guidance requiring verification from local agricultural extension officers or qualified agronomists before applying products to your crop.
          </p>
        </div>
      </div>

      {/* Top Result Summary */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="bg-slate-950">
            <img
              src={scan.imageUrl}
              alt={profile.name[language]}
              className="h-72 sm:h-80 w-full object-contain"
            />
          </div>
          <div className="p-4 text-xs text-[#64748B] space-y-1">
            <p>
              <span className="font-semibold text-[#17251B]">Scan ID:</span> {scan.id}
            </p>
            <p>
              <span className="font-semibold text-[#17251B]">Captured:</span>{' '}
              {formatDateTime(scan.scannedAt, language)}
            </p>
            <p>
              <span className="font-semibold text-[#17251B]">Location:</span> {scan.location}
            </p>
            {scan.notes && (
              <p>
                <span className="font-semibold text-[#17251B]">Notes:</span> {scan.notes}
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Possible Classification
              </span>
              <StatusBadge label={scan.status} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-[#17251B] sm:text-3xl">
                {profile.name[language]}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                {profile.description[language]}
              </p>
            </div>

            {/* Confidence Visualization */}
            <div className="rounded-xl bg-[#F7FAF7] p-4 border border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#17251B]">
                  Model Confidence Score (Demo Screening)
                </span>
                <span className="text-sm font-extrabold text-[#166534]">
                  {scan.confidence.toFixed(1)}%
                </span>
              </div>
              <div className="mt-2.5 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${Math.min(100, scan.confidence)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-2 rounded-xl bg-[#166534] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#14532D] transition-colors"
            >
              <Download className="h-4 w-4" />
              {t('downloadReport')}
            </button>
            <button
              type="button"
              onClick={handleSaveToHistory}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#17251B] hover:bg-slate-50"
            >
              <BookmarkCheck className="h-4 w-4 text-[#166534]" />
              {scan.savedToHistory ? 'Saved in History' : t('saveToHistory')}
            </button>
            <Link
              to="/farmer/disease-detection"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#17251B] hover:bg-slate-50"
            >
              <ScanLine className="h-4 w-4 text-[#166534]" />
              {t('scanAnotherLeaf')}
            </Link>
            <Link
              to={`/farmer/consultation/new?scanId=${scan.id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#166534] hover:bg-emerald-100"
            >
              <Stethoscope className="h-4 w-4" />
              {t('askAnExpert')}
            </Link>
          </div>
        </div>
      </div>

      {/* Guidance Sections */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-[#17251B]">Common Symptoms</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#64748B]">
            {profile.symptoms[language].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-[#17251B]">Prevention Measures</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#64748B]">
            {profile.prevention[language].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#22C55E]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-[#17251B]">
            Treatment Guidance (Verify With Expert)
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[#64748B]">
            {profile.treatment[language].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#166534]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-[#17251B]">Recommended Next Steps</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#64748B]">
            {profile.nextSteps[language].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#166534]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
