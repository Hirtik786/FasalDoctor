import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  CloudSun,
  Loader2,
  MapPin,
  Phone,
  ScanLine,
  Send,
  User as UserIcon,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { EmptyState, LoadingSpinner } from '../../components/common/FeedbackStates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';
import { consultationService } from '../../services/consultationService';
import type { ConsultationRequest, ConsultationStatus, Language } from '../../types';
import { formatDateTime } from '../../utils/formatters';

export const ExpertRequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();

  const [request, setRequest] = useState<ConsultationRequest | null>(null);
  const [loading, setLoading] = useState(true);

  const [recommendation, setRecommendation] = useState('');
  const [preventiveText, setPreventiveText] = useState('');
  const [treatmentText, setTreatmentText] = useState('');
  const [responseLang, setResponseLang] = useState<Language>('en');
  const [nextStatus, setNextStatus] = useState<ConsultationStatus>('Responded');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        if (!id) return;
        const found = await consultationService.getRequestById(id);
        if (active && found) {
          setRequest(found);
          setResponseLang(found.preferredLanguage);
          setNextStatus(found.status === 'Pending' ? 'Responded' : found.status);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [id]);

  const handleStatusChange = async (status: ConsultationStatus) => {
    if (!request) return;
    const updated = await consultationService.updateStatus(
      request.id,
      status,
      user?.id ?? 'expert-1',
      user?.name ?? 'Dr. Ahmed Khan'
    );
    setRequest(updated);
    setNextStatus(status);
    showToast({ type: 'info', title: `Case status updated to ${status}` });
  };

  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || !recommendation.trim()) return;
    setSubmitting(true);
    try {
      const preventiveList = preventiveText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const treatmentList = treatmentText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const updated = await consultationService.sendMessage({
        requestId: request.id,
        senderId: user?.id ?? 'expert-1',
        senderName: user?.name ?? 'Dr. Ahmed Khan',
        senderRole: 'expert',
        language: responseLang,
        text: recommendation,
        preventiveSuggestions: preventiveList.length ? preventiveList : undefined,
        treatmentGuidance: treatmentList.length ? treatmentList : undefined,
        newStatus: nextStatus,
        assignExpertId: user?.id ?? 'expert-1',
        assignExpertName: user?.name ?? 'Dr. Ahmed Khan',
      });

      setRequest(updated);
      setRecommendation('');
      setPreventiveText('');
      setTreatmentText('');

      addNotification({
        userId: request.farmerId,
        role: 'farmer',
        type: 'expert',
        title: {
          en: `Expert responded to ${request.id}`,
          ur: `ماہر نے ${request.id} کا جواب ارسال کیا`,
        },
        message: {
          en: `${user?.name ?? 'Dr. Ahmed Khan'} sent recommendations for your melon crop.`,
          ur: `${user?.name ?? 'ڈاکٹر احمد خان'} نے آپ کی فصل کے لیے مشورہ ارسال کیا ہے۔`,
        },
        link: `/farmer/consultation/${request.id}`,
      });

      showToast({
        type: 'success',
        title: 'Expert Response Sent',
        message: `Farmer ${request.farmerName} has been notified.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading farmer consultation case..." />;

  if (!request) {
    return (
      <EmptyState
        title="Consultation case not found"
        description="The requested consultation ID was not found."
        action={
          <Link
            to="/expert/requests"
            className="rounded-xl bg-[#166534] px-4 py-2 text-sm font-semibold text-white"
          >
            Back to Requests
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Expert Dashboard', to: '/expert/dashboard' },
          { label: 'Requests', to: '/expert/requests' },
          { label: request.id },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Farmer Details, Images, Environmental & Scan Context */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#166534]">{request.id}</span>
              <div className="flex items-center gap-2">
                <StatusBadge label={request.priority} />
                <StatusBadge label={request.status} />
              </div>
            </div>

            <h1 className="text-lg font-bold text-[#17251B]">{request.subject}</h1>
            <p className="text-sm leading-relaxed text-[#64748B]">
              {request.description}
            </p>

            {/* Farmer Information */}
            <div className="rounded-xl bg-[#F7FAF7] p-4 space-y-2 text-xs">
              <p className="font-bold uppercase tracking-wide text-[#64748B]">
                Farmer Information
              </p>
              <div className="flex items-center gap-2 text-[#17251B] font-semibold">
                <UserIcon className="h-3.5 w-3.5 text-[#166534]" />
                {request.farmerName}
              </div>
              <div className="flex items-center gap-2 text-[#64748B]">
                <MapPin className="h-3.5 w-3.5 text-[#166534]" />
                {request.farmerLocation}
              </div>
              <div className="flex items-center gap-2 text-[#64748B]">
                <Phone className="h-3.5 w-3.5 text-[#166534]" />
                {request.farmerPhone}
              </div>
              <p className="text-[#64748B]">
                Preferred Language:{' '}
                <span className="font-semibold text-[#17251B]">
                  {request.preferredLanguage === 'ur' ? 'Urdu (اردو)' : 'English'}
                </span>
              </p>
            </div>

            {/* Optional Shared AI Scan & Environmental Context */}
            {request.linkedScanSummary && (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs">
                <ScanLine className="mt-0.5 h-4 w-4 shrink-0 text-[#166534]" />
                <div>
                  <p className="font-bold text-[#166534]">
                    Shared AI Screening ({request.linkedScanId})
                  </p>
                  <p className="text-[#17251B]">{request.linkedScanSummary}</p>
                </div>
              </div>
            )}

            {request.weatherContext && (
              <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                <CloudSun className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]" />
                <div>
                  <p className="font-bold text-[#17251B]">Field Environmental Context</p>
                  <p className="text-[#64748B]">{request.weatherContext}</p>
                </div>
              </div>
            )}

            {/* Crop Images */}
            {request.images.length > 0 && (
              <div>
                <p className="text-xs font-bold text-[#17251B] mb-2">
                  Submitted Crop Images
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {request.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Farmer crop ${i + 1}`}
                      className="h-32 w-full rounded-xl border border-slate-200 object-cover bg-slate-900"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quick Status Control */}
            <div className="border-t border-slate-100 pt-3">
              <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
                Update Case Status
              </label>
              <select
                value={request.status}
                onChange={(e) =>
                  void handleStatusChange(e.target.value as ConsultationStatus)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#17251B]"
              >
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Responded">Responded</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Conversation History + Expert Response Composer */}
        <div className="lg:col-span-7 space-y-5">
          {/* Conversation History */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#17251B]">
              Consultation History ({request.messages.length})
            </h2>
            <div className="space-y-3 max-h-80 overflow-y-auto pe-1">
              {request.messages.map((msg) => {
                const isExpert = msg.senderRole === 'expert';
                const isUrdu = msg.language === 'ur' || /[\u0600-\u06FF]/.test(msg.text);
                return (
                  <div
                    key={msg.id}
                    dir={isUrdu ? 'rtl' : 'ltr'}
                    className={`rounded-2xl p-4 ${
                      isExpert
                        ? 'border border-emerald-200 bg-emerald-50/40'
                        : 'border border-slate-200 bg-[#F7FAF7]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-[#166534]">{msg.senderName}</span>
                      <span className="text-[#64748B]">
                        {formatDateTime(msg.timestamp, language)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-[#17251B]">{msg.text}</p>
                    {msg.preventiveSuggestions && (
                      <ul className="mt-2 space-y-1 text-xs text-[#166534]">
                        {msg.preventiveSuggestions.map((p, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expert Response Form */}
          <form
            onSubmit={handleSendResponse}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-bold text-[#17251B]">
                Write Expert Response
              </h2>
              <div className="inline-flex rounded-xl border border-slate-200 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setResponseLang('en')}
                  className={`rounded-lg px-3 py-1 font-semibold ${
                    responseLang === 'en'
                      ? 'bg-[#166534] text-white'
                      : 'text-[#64748B]'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setResponseLang('ur')}
                  className={`rounded-lg px-3 py-1 font-semibold ${
                    responseLang === 'ur'
                      ? 'bg-[#166534] text-white'
                      : 'text-[#64748B]'
                  }`}
                >
                  اردو
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
                Expert Recommendation *
              </label>
              <textarea
                rows={4}
                required
                dir={responseLang === 'ur' ? 'rtl' : 'ltr'}
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                placeholder={
                  responseLang === 'ur'
                    ? 'کاشتکار کے لیے واضح زرعی مشورہ لکھیں...'
                    : 'Write clear, practical agricultural assessment and recommendation...'
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
                  Preventive Suggestions (1 per line)
                </label>
                <textarea
                  rows={3}
                  dir={responseLang === 'ur' ? 'rtl' : 'ltr'}
                  value={preventiveText}
                  onChange={(e) => setPreventiveText(e.target.value)}
                  placeholder="Irrigate before 9:00 AM&#10;Remove heavily infected lower leaves"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-[#166534] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
                  Treatment Guidance (1 per line)
                </label>
                <textarea
                  rows={3}
                  dir={responseLang === 'ur' ? 'rtl' : 'ltr'}
                  value={treatmentText}
                  onChange={(e) => setTreatmentText(e.target.value)}
                  placeholder="Verify registered protectant locally&#10;Avoid spraying in peak heat"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-[#166534] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-[#64748B]">Set status to:</span>
                <select
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value as ConsultationStatus)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-semibold text-[#17251B]"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Responded">Responded</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting || !recommendation.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#14532D] disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send Response
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
