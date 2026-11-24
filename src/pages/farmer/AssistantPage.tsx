import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Info,
  Loader2,
  Mic,
  Send,
  Square,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { useLanguage } from '../../context/LanguageContext';
import { speechService } from '../../services/speechService';
import type { AssistantMessage, Language } from '../../types';
import { formatDateTime } from '../../utils/formatters';

const CHAT_STORAGE_KEY = 'fd_assistant_chat_v1';

const EXAMPLE_QUESTIONS: Record<Language, string[]> = {
  en: [
    'What are the symptoms of powdery mildew?',
    'How can I protect melon leaves during rainy weather?',
    'Why are yellow spots appearing on my melon leaves?',
    'What preventive steps should I take?',
  ],
  ur: [
    'سفوفی پھپھوندی (پاؤڈری ملڈیو) کی علامات کیا ہیں؟',
    'بارش کے موسم میں خربوزے کے پتوں کو کیسے محفوظ رکھیں؟',
    'میرے خربوزے کے پتوں پر پیلے دھبے کیوں آ رہے ہیں؟',
    'احتیاطی تدابیر کیا ہونی چاہئیں؟',
  ],
};

function generateDemoReply(question: string, lang: Language): string {
  const q = question.toLowerCase();

  if (lang === 'ur' || /[\u0600-\u06FF]/.test(question)) {
    if (q.includes('سفوفی') || q.includes('سفید') || q.includes('پاؤڈری')) {
      return 'ڈیمو رہنمائی: سفوفی پھپھوندی عموماً پرانے اور سایہ دار پتوں کی اوپری سطح پر سفید آٹے جیسے گول دھبوں کی شکل میں ظاہر ہوتی ہے۔ بیلوں میں ہوا کے گزر کے لیے فاصلہ برقرار رکھیں اور کسی بھی سپرے سے پہلے مقامی زرعی ماہر سے تصدیق ضرور کروائیں۔';
    }
    if (q.includes('بارش') || q.includes('موسم') || q.includes('نمی')) {
      return 'ڈیمو رہنمائی: بارش اور زیادہ نمی میں آبپاشی صبح سویرے کریں تاکہ شام تک پتے خشک ہو جائیں۔ کھیت میں پانی کھڑا نہ ہونے دیں اور بارش کے بعد نچلے پتوں کی نچلی سطح کا معائنہ کریں۔';
    }
    if (q.includes('پیلے') || q.includes('ڈاؤنی')) {
      return 'ڈیمو رہنمائی: پتوں کی رگوں کے درمیان زاویہ دار پیلے دھبے ڈاؤنی ملڈیو یا غذائی کمی کا اشارہ ہو سکتے ہیں۔ صبح کے وقت پتے کے نیچے سرمئی تہہ چیک کریں اور تصدیق کے لیے زرعی ماہر سے مشورہ کریں۔';
    }
    return 'ڈیمو رہنمائی: خربوزے کی فصل کو صحت مند رکھنے کے لیے صبح کی آبپاشی، جڑی بوٹیوں کی صفائی، متوازن کھاد اور پتوں کا باقاعدہ معائنہ اہم ہیں۔ کسی بھی کیمیائی علاج سے پہلے مقامی زرعی افسر سے تصدیق ضرور کریں۔';
  }

  if (q.includes('powdery') || q.includes('white')) {
    return 'Demo Guidance: Powdery mildew typically begins as circular white, talcum-like dusty patches on shaded older melon leaves. Improve canopy airflow, remove heavily coated older leaves carefully, and confirm any fungicide choice with your local agricultural extension office.';
  }
  if (q.includes('rain') || q.includes('humid') || q.includes('weather')) {
    return 'Demo Guidance: During humid or rainy weather, water melon beds early in the morning so leaves dry before nightfall, maintain furrow drainage, and avoid walking through wet vines to prevent spreading fungal spores.';
  }
  if (q.includes('yellow') || q.includes('downy')) {
    return 'Demo Guidance: Angular yellow spots bounded by leaf veins can be an early sign of Downy Mildew—check the leaf underside in morning dew for faint gray-purple fuzz. Nutrient imbalance can also cause yellowing, so consider sharing a clear photo with an agricultural expert.';
  }
  return 'Demo Guidance: Key preventive steps for melon crops include morning drip/furrow irrigation, proper plant spacing, balanced potassium/nitrogen nutrition, and weekly leaf inspection. Always verify treatment decisions with a local agronomist.';
}

const INITIAL_MESSAGES: AssistantMessage[] = [
  {
    id: 'welcome-1',
    sender: 'assistant',
    language: 'en',
    text: 'Assalam-o-Alaikum! I am Ask FasalDoctor (Demo Assistant). You can ask melon crop questions in English or Urdu, or try push-to-talk voice input below.',
    timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
    isDemoResponse: true,
  },
];

export const AssistantPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [chatLang, setChatLang] = useState<Language>(language);
  const [messages, setMessages] = useState<AssistantMessage[]>(() => {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AssistantMessage[]) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Voice recording & Faster-Whisper demo state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptPreview, setTranscriptPreview] = useState<string | null>(null);
  const [transcriptNotice, setTranscriptNotice] = useState<string | null>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLanguageSwitch = (nextLang: Language) => {
    setChatLang(nextLang);
    setLanguage(nextLang);
  };

  const sendMessage = async (textToSend: string, viaVoice = false) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const userMsg: AssistantMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      language: chatLang,
      timestamp: new Date().toISOString(),
      viaVoice,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setTranscriptPreview(null);
    setTranscriptNotice(null);
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 650));

    const reply: AssistantMessage = {
      id: `a-${Date.now()}`,
      sender: 'assistant',
      text: generateDemoReply(trimmed, chatLang),
      language: chatLang,
      timestamp: new Date().toISOString(),
      isDemoResponse: true,
    };

    setMessages((prev) => [...prev, reply]);
    setIsTyping(false);
  };

  const startRecording = async () => {
    setTranscriptPreview(null);
    setTranscriptNotice(null);
    setRecordSeconds(0);
    setIsRecording(true);
    audioChunksRef.current = [];

    timerRef.current = window.setInterval(() => {
      setRecordSeconds((s) => s + 1);
    }, 1000);

    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
      }
    } catch {
      // Microphone permission unavailable; timer still runs for honest Demo Mode preview
    }
  };

  const stopRecordingAndTranscribe = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setTranscribing(true);

    let blob: Blob | null = null;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      if (audioChunksRef.current.length > 0) {
        blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      }
    }

    try {
      const result = await speechService.transcribeAudio(blob, chatLang);
      setTranscriptPreview(result.text);
      setTranscriptNotice(result.engineLabel);
    } finally {
      setTranscribing(false);
    }
  };

  const handleClearConversation = () => {
    setMessages(INITIAL_MESSAGES);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(INITIAL_MESSAGES));
    setConfirmClearOpen(false);
  };

  return (
    <div className="space-y-5">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/farmer/dashboard' },
          { label: 'Ask FasalDoctor' },
        ]}
      />

      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden flex flex-col h-[calc(100vh-14rem)] min-h-[540px]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#166534] text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#17251B]">Ask FasalDoctor</h1>
              <p className="text-xs text-[#64748B]">
                Multilingual melon guidance • Faster-Whisper voice interface (Demo Mode)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-[#F7FAF7]">
              <button
                type="button"
                onClick={() => handleLanguageSwitch('en')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  chatLang === 'en'
                    ? 'bg-[#166534] text-white'
                    : 'text-[#64748B] hover:text-[#17251B]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageSwitch('ur')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  chatLang === 'ur'
                    ? 'bg-[#166534] text-white'
                    : 'text-[#64748B] hover:text-[#17251B]'
                }`}
              >
                اردو
              </button>
            </div>

            <button
              type="button"
              onClick={() => setConfirmClearOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-[#64748B] hover:bg-red-50 hover:text-[#DC2626]"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>

        {/* Example Question Chips */}
        <div className="border-b border-slate-100 bg-[#F7FAF7] px-5 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-[#64748B]">Try asking:</span>
            {EXAMPLE_QUESTIONS[chatLang].map((q) => (
              <button
                key={q}
                type="button"
                dir={chatLang === 'ur' ? 'rtl' : 'ltr'}
                onClick={() => void sendMessage(q)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-[#17251B] hover:border-[#166534] hover:text-[#166534] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F7FAF7]/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isUrduMsg = msg.language === 'ur' || /[\u0600-\u06FF]/.test(msg.text);
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#166534]">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  dir={isUrduMsg ? 'rtl' : 'ltr'}
                  className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-[#166534] text-white rounded-be-sm'
                      : 'border border-slate-200 bg-white text-[#17251B] rounded-bs-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`mt-1.5 flex items-center justify-between gap-3 text-[10px] ${
                      isUser ? 'text-emerald-100' : 'text-[#64748B]'
                    }`}
                  >
                    <span>{formatDateTime(msg.timestamp, chatLang)}</span>
                    {msg.viaVoice && <span>Voice Input</span>}
                    {msg.isDemoResponse && <span>Demo Assistant</span>}
                  </div>
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-[#17251B]">
                    <UserIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <Loader2 className="h-4 w-4 animate-spin text-[#166534]" />
              <span>Preparing guidance...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Editable Voice Transcription Preview */}
        {transcriptPreview !== null && (
          <div className="border-t border-emerald-200 bg-emerald-50/80 px-5 py-3 space-y-2">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#166534]">
                <Info className="h-3.5 w-3.5" />
                {transcriptNotice}
              </span>
              <button
                type="button"
                onClick={() => {
                  setTranscriptPreview(null);
                  setTranscriptNotice(null);
                }}
                className="text-xs font-semibold text-[#64748B] hover:text-[#DC2626]"
              >
                Discard
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                dir={chatLang === 'ur' ? 'rtl' : 'ltr'}
                value={transcriptPreview}
                onChange={(e) => setTranscriptPreview(e.target.value)}
                className="flex-1 rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-sm text-[#17251B] focus:border-[#166534] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => void sendMessage(transcriptPreview, true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#166534] px-4 py-2 text-xs font-semibold text-white hover:bg-[#14532D]"
              >
                <Send className="h-3.5 w-3.5" />
                Send Transcribed Query
              </button>
            </div>
          </div>
        )}

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage(inputText);
          }}
          className="border-t border-slate-200 bg-white p-3 sm:p-4"
        >
          <div className="flex items-center gap-2">
            {/* Push-to-Talk Button */}
            {!isRecording ? (
              <button
                type="button"
                disabled={transcribing}
                onClick={startRecording}
                title="Push to talk (Faster-Whisper Demo)"
                className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F7FAF7] px-3.5 text-xs font-semibold text-[#166534] hover:border-[#166534] hover:bg-emerald-50 disabled:opacity-50"
              >
                {transcribing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {transcribing ? 'Transcribing...' : 'Push to Talk'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecordingAndTranscribe}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#DC2626] px-3.5 text-xs font-semibold text-white animate-pulse"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>Stop ({recordSeconds}s)</span>
              </button>
            )}

            <input
              type="text"
              dir={chatLang === 'ur' ? 'rtl' : 'ltr'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                chatLang === 'ur'
                  ? 'خربوزے کی فصل کے بارے میں اپنا سوال لکھیں...'
                  : 'Ask a question about melon diseases, irrigation, or weather...'
              }
              className="h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#166534] px-4 text-sm font-semibold text-white hover:bg-[#14532D] disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </div>

      <ConfirmationModal
        open={confirmClearOpen}
        title="Clear Conversation?"
        description="This will remove the current chat messages and reset Ask FasalDoctor to the initial welcome message."
        confirmLabel="Clear Chat"
        danger
        onConfirm={handleClearConversation}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  );
};
