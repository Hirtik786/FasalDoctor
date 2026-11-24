import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Send, Stethoscope } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { EmptyState, LoadingSpinner } from '../../components/common/FeedbackStates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { consultationService } from '../../services/consultationService';
import type { ConsultationRequest } from '../../types';
import { formatDateTime } from '../../utils/formatters';

export const ConsultationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { showToast } = useToast();

  const [request, setRequest] = useState<ConsultationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [followUp, setFollowUp] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        if (!id) return;
        const found = await consultationService.getRequestById(id);
        if (active) setRequest(found ?? null);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [id]);

  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || !followUp.trim()) return;
    setSending(true);
    try {
      const updated = await consultationService.sendMessage({
        requestId: request.id,
        senderId: user?.id ?? 'farmer-1',
        senderName: user?.name ?? 'Ahmed Raza',
        senderRole: 'farmer',
        language,
        text: followUp,
      });
      setRequest(updated);
      setFollowUp('');
      showToast({ type: 'success', title: 'Follow-up message sent' });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading consultation thread..." />;

  if (!request) {
    return (
      <EmptyState
        title="Consultation request not found"
        description="We could not locate this support request."
        action={
          <Link
            to="/farmer/consultation/requests"
            className="rounded-xl bg-[#166534] px-4 py-2 text-sm font-semibold text-white"
          >
            Back to My Requests
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/farmer/dashboard' },
          { label: 'Support Requests', to: '/farmer/consultation/requests' },
          { label: request.id },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Summary & Photos */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#166534]">{request.id}</span>
              <StatusBadge label={request.status} />
            </div>
            <h1 className="text-lg font-bold text-[#17251B]">{request.subject}</h1>
            <p className="text-sm leading-relaxed text-[#64748B]">
              {request.description}
            </p>

            <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-[#F7FAF7] p-3.5 text-xs">
              <div>
                <p className="text-[#64748B]">Crop Type</p>
                <p className="font-semibold text-[#17251B]">{request.cropType}</p>
              </div>
              <div>
                <p className="text-[#64748B]">Category</p>
                <p className="font-semibold text-[#17251B]">{request.category}</p>
              </div>
              <div>
                <p className="text-[#64748B]">Assigned Expert</p>
                <p className="font-semibold text-[#166534]">
                  {request.expertName || 'Pending Assignment'}
                </p>
              </div>
              <div>
                <p className="text-[#64748B]">Submitted</p>
                <p className="font-semibold text-[#17251B]">
                  {formatDateTime(request.createdAt, language)}
                </p>
              </div>
            </div>

            {request.images.length > 0 && (
              <div>
                <p className="text-xs font-bold text-[#17251B] mb-2">
                  Submitted Crop Images
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {request.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Submitted crop ${idx + 1}`}
                      className="h-32 w-full rounded-xl object-cover border border-slate-200 bg-slate-900"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conversation History */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4.5 w-4.5 text-[#166534]" />
              <h2 className="text-base font-bold text-[#17251B]">
                Consultation Conversation
              </h2>
            </div>
            <span className="text-xs text-[#64748B]">
              {request.messages.length} messages
            </span>
          </div>

          <div className="flex-1 space-y-4 p-5 bg-[#F7FAF7]/50 max-h-[520px] overflow-y-auto">
            {request.messages.map((msg) => {
              const isExpert = msg.senderRole === 'expert';
              const isUrdu = msg.language === 'ur' || /[\u0600-\u06FF]/.test(msg.text);
              return (
                <div
                  key={msg.id}
                  dir={isUrdu ? 'rtl' : 'ltr'}
                  className={`rounded-2xl p-4 shadow-xs ${
                    isExpert
                      ? 'border border-emerald-200 bg-white'
                      : 'border border-slate-200 bg-emerald-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#166534]">
                      {msg.senderName} ({isExpert ? 'Agricultural Expert' : 'Farmer'})
                    </span>
                    <span className="text-[#64748B]">
                      {formatDateTime(msg.timestamp, language)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-[#17251B]">{msg.text}</p>

                  {msg.preventiveSuggestions && msg.preventiveSuggestions.length > 0 && (
                    <div className="mt-3 rounded-xl bg-[#F7FAF7] p-3">
                      <p className="text-xs font-bold text-[#166534]">
                        Preventive Suggestions
                      </p>
                      <ul className="mt-1.5 space-y-1 text-xs text-[#17251B]">
                        {msg.preventiveSuggestions.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#22C55E]" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {msg.treatmentGuidance && msg.treatmentGuidance.length > 0 && (
                    <div className="mt-2.5 rounded-xl bg-amber-50/70 p-3">
                      <p className="text-xs font-bold text-amber-900">
                        Treatment Guidance
                      </p>
                      <ul className="mt-1.5 space-y-1 text-xs text-amber-950">
                        {msg.treatmentGuidance.map((tItem, idx) => (
                          <li key={idx}>• {tItem}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {request.status !== 'Closed' && (
            <form
              onSubmit={handleSendFollowUp}
              className="border-t border-slate-100 bg-white p-4 flex gap-2"
            >
              <input
                type="text"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                placeholder="Write a follow-up question or field update..."
                className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none"
              />
              <button
                type="submit"
                disabled={sending || !followUp.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#14532D] disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
