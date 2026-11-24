import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  CloudRain,
  Droplets,
  Globe2,
  Leaf,
  MessageSquare,
  Mic,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { mockExperts } from '../../data/mockExperts';
import { DISEASE_PROFILES } from '../../data/mockScans';
import type { DiseaseCode } from '../../types';
import { getInitials } from '../../utils/formatters';

const FAQ_ITEMS = [
  {
    q: 'Are AI disease predictions a guaranteed medical or agricultural diagnosis?',
    a: 'No. FasalDoctor presents AI outputs as possible leaf classifications for early screening and awareness. Farmers should verify treatment decisions with local agricultural extension officers or qualified agronomists.',
  },
  {
    q: 'Do I have to consult a human expert after every AI leaf scan?',
    a: 'No. AI-Powered Assistance and Agricultural Expert Consultation are two completely independent support tracks. You can use AI scanning, weather advisories, and Ask FasalDoctor on their own, or contact an expert separately whenever you want human guidance.',
  },
  {
    q: 'Which languages does FasalDoctor support?',
    a: 'FasalDoctor supports both English and Urdu (with full right-to-left layout support), making disease guidance, weather advisories, and chat assistance accessible for local melon growers.',
  },
  {
    q: 'How does the weather-based disease advisory work?',
    a: 'It monitors local temperature, relative humidity, and rainfall trends to issue indicative crop-risk advisories (Low, Moderate, or High) and preventive actions—such as switching to morning irrigation.',
  },
  {
    q: 'Is a live backend required to explore FasalDoctor?',
    a: 'No. When the FastAPI backend (MobileNetV2, Faster-Whisper, Weather API, PostgreSQL) is offline, the frontend runs in a clearly labeled Demonstration Mode using realistic mock data and browser persistence.',
  },
];

export const LandingPage: React.FC = () => {
  const { language } = useLanguage();
  const [selectedDisease, setSelectedDisease] = useState<DiseaseCode>('Powdery Mildew');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activeDisease = DISEASE_PROFILES[selectedDisease];

  const diseasePreviewImages: Record<DiseaseCode, string> = {
    'Healthy Leaf': '/images/leaf-healthy.svg',
    'Powdery Mildew': '/images/leaf-powdery-mildew.svg',
    'Downy Mildew': '/images/leaf-downy-mildew.svg',
    Anthracnose: '/images/leaf-anthracnose.svg',
  };

  return (
    <div className="bg-[#F7FAF7]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-[#166534]">
              <Sparkles className="h-3.5 w-3.5 text-[#166534]" />
              <span>
                {language === 'ur'
                  ? 'خربوزے کی فصل کا ذہین AI و زرعی مشاورتی پلیٹ فارم'
                  : 'AI-Powered Multilingual Melon Crop Advisory'}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#17251B] sm:text-4xl lg:text-5xl leading-[1.15]">
              {language === 'ur'
                ? 'ذہین AI مدد سے اپنی خربوزے کی فصل کی حفاظت کریں'
                : 'Protect Your Melon Crops with Intelligent AI Assistance'}
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-[#64748B] sm:text-lg">
              {language === 'ur'
                ? 'خربوزے کی ممکنہ بیماریوں کی بروقت نشاندہی کریں، فصل کی صحت کو سمجھیں، اور اپنی زبان میں قابلِ اعتماد زرعی رہنمائی حاصل کریں۔'
                : 'Detect possible melon diseases early, understand crop health, and receive trusted agricultural guidance in your own language.'}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                to="/farmer/disease-detection"
                className="inline-flex items-center gap-2 rounded-xl bg-[#166534] px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#14532D] transition-all"
              >
                <ScanLine className="h-4.5 w-4.5" />
                {language === 'ur' ? 'فصل کی بیماری چیک کریں' : 'Detect Crop Disease'}
              </Link>
              <Link
                to="/farmer/experts"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-[#17251B] hover:border-[#166534] hover:bg-emerald-50/50 transition-all"
              >
                <Stethoscope className="h-4.5 w-4.5 text-[#166534]" />
                {language === 'ur' ? 'ماہر سے مشورہ کریں' : 'Consult an Expert'}
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
              <div>
                <p className="text-lg font-bold text-[#166534]">2 Tracks</p>
                <p className="text-xs text-[#64748B]">Independent AI & Expert help</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#166534]">EN / اردو</p>
                <p className="text-xs text-[#64748B]">Bilingual + RTL ready</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#166534]">7-Day</p>
                <p className="text-xs text-[#64748B]">Weather fungal risk guide</p>
              </div>
            </div>
          </div>

          {/* Hero Visual: Farm image + AI Scanning Preview */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl border border-slate-200 bg-[#F7FAF7] p-3 shadow-xl">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="/images/melon-farm-hero.svg"
                  alt="Healthy melon farm field"
                  className="h-72 sm:h-96 w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />

                {/* Floating AI Scan Preview Card */}
                <div className="absolute bottom-4 start-4 end-4 rounded-2xl border border-white/25 bg-white/95 p-4 shadow-lg backdrop-blur-md">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src="/images/leaf-powdery-mildew.svg"
                        alt="Sample scanned melon leaf"
                        className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                          AI Scan Preview (Demo)
                        </p>
                        <p className="text-sm font-bold text-[#17251B]">
                          Possible Powdery Mildew
                        </p>
                      </div>
                    </div>
                    <div className="text-end">
                      <StatusBadge label="Attention Needed" />
                      <p className="mt-1 text-xs font-bold text-[#166534]">
                        88.4% Confidence
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. PLATFORM OVERVIEW (Two Independent Support Options) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">
            Platform Overview
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#17251B] sm:text-3xl">
            Two Independent Ways to Protect Your Melon Harvest
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#64748B]">
            Use instant AI screening and weather guidance anytime, or reach out directly to an agricultural specialist—with no forced steps in between.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#166534]">
              <ScanLine className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-[#17251B]">
              1. AI-Powered Crop Assistance
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
              Upload or capture a melon leaf photograph to screen for common patterns like Powdery Mildew, Downy Mildew, or Anthracnose, check local weather risk, and ask questions in English or Urdu.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#17251B]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                <span>Fast leaf screening with symptom & prevention guidance</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                <span>Voice push-to-talk interface & Urdu RTL support</span>
              </li>
            </ul>
            <Link
              to="/farmer/disease-detection"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#166534] hover:underline"
            >
              Try AI Disease Detection <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#166534]">
              <Stethoscope className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-[#17251B]">
              2. Independent Agricultural Expert Consultation
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
              Prefer human expertise? Independently browse agricultural specialists, submit field photos and questions, and track personalized recommendations in one clean workspace.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#17251B]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                <span>Direct case submission without requiring an AI scan first</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                <span>Status tracking from Pending to Expert Responded</span>
              </li>
            </ul>
            <Link
              to="/farmer/experts"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#166534] hover:underline"
            >
              Explore Agricultural Experts <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. HOW FASALDOCTOR WORKS */}
      <section className="border-y border-slate-200/70 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">
                Simple Farmer Workflow
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#17251B] sm:text-3xl">
                How FasalDoctor Works
              </h2>
            </div>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#166534] hover:underline"
            >
              View Full 7-Step Guide <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Capture Leaf Photo',
                desc: 'Take a clear daylight picture of a melon leaf or select from your phone gallery.',
                icon: ScanLine,
              },
              {
                step: '02',
                title: 'Review AI Screening',
                desc: 'View possible disease classification, confidence score, and clear verification notices.',
                icon: Leaf,
              },
              {
                step: '03',
                title: 'Check Weather & Chat',
                desc: 'Monitor local humidity/rain fungal risk and ask follow-up questions in English or Urdu.',
                icon: CloudRain,
              },
              {
                step: '04',
                title: 'Optional Expert Support',
                desc: 'Submit an independent consultation request anytime you need tailored specialist advice.',
                icon: Users,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="rounded-2xl border border-slate-200/80 bg-[#F7FAF7] p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#166534]">
                      STEP {item.step}
                    </span>
                    <Icon className="h-5 w-5 text-[#166534]" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[#17251B]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#64748B]">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. AI DISEASE DETECTION SHOWCASE */}
      <section id="ai-detection" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">
              AI Disease Detection
            </p>
            <h2 className="text-2xl font-bold text-[#17251B] sm:text-3xl">
              Screen Common Melon Leaf Conditions in Seconds
            </h2>
            <p className="text-sm leading-relaxed text-[#64748B]">
              Select a demonstration profile below to preview how FasalDoctor presents possible leaf classifications, visual symptoms, and safe preventive guidance.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {(Object.keys(DISEASE_PROFILES) as DiseaseCode[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedDisease(code)}
                  className={`rounded-xl border px-3.5 py-2.5 text-start text-xs font-semibold transition-all ${
                    selectedDisease === code
                      ? 'border-[#166534] bg-[#166534] text-white shadow-xs'
                      : 'border-slate-200 bg-white text-[#17251B] hover:border-[#166534]/50'
                  }`}
                >
                  {DISEASE_PROFILES[code].name[language]}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm grid sm:grid-cols-5">
              <div className="sm:col-span-2 bg-slate-900">
                <img
                  src={diseasePreviewImages[selectedDisease]}
                  alt={activeDisease.name[language]}
                  className="h-56 sm:h-full w-full object-cover"
                />
              </div>
              <div className="sm:col-span-3 p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-[#17251B]">
                    {activeDisease.name[language]}
                  </h3>
                  <StatusBadge label={activeDisease.status} />
                </div>
                <p className="text-xs leading-relaxed text-[#64748B]">
                  {activeDisease.description[language]}
                </p>
                <div>
                  <p className="text-xs font-bold text-[#17251B]">Key Symptoms:</p>
                  <ul className="mt-1.5 space-y-1 text-xs text-[#64748B]">
                    {activeDisease.symptoms[language].slice(0, 2).map((sym, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22C55E]" />
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2">
                  <Link
                    to="/farmer/disease-detection"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-semibold text-[#166534] hover:bg-[#166534] hover:text-white transition-colors"
                  >
                    Open Leaf Scanner <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WEATHER ADVISORY & 5. MULTILINGUAL ASSISTANCE */}
      <section id="weather-advisory" className="border-y border-slate-200/70 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-2">
          {/* Weather Advisory Card */}
          <div className="rounded-2xl border border-slate-200 bg-[#F7FAF7] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#166534]">
                  <Sun className="h-4 w-4" />
                  Weather-Based Crop Advisory
                </span>
                <StatusBadge label="Moderate Risk" />
              </div>
              <h3 className="mt-3 text-xl font-bold text-[#17251B]">
                Stay Ahead of Humidity & Rain-Driven Fungal Risk
              </h3>
              <p className="mt-2 text-sm text-[#64748B]">
                FasalDoctor tracks temperature, humidity, and rainfall forecasts to provide indicative early preventive advisories before fungal spores take hold.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white p-3 border border-slate-200/80">
                  <p className="text-[11px] text-[#64748B]">Temperature</p>
                  <p className="mt-1 text-lg font-bold text-[#17251B]">26°C</p>
                </div>
                <div className="rounded-xl bg-white p-3 border border-slate-200/80">
                  <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
                    <Droplets className="h-3 w-3 text-[#166534]" /> Humidity
                  </div>
                  <p className="mt-1 text-lg font-bold text-[#17251B]">76%</p>
                </div>
                <div className="rounded-xl bg-white p-3 border border-slate-200/80">
                  <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
                    <CloudRain className="h-3 w-3 text-[#166534]" /> Rainfall
                  </div>
                  <p className="mt-1 text-lg font-bold text-[#17251B]">3.4 mm</p>
                </div>
              </div>
            </div>

            <Link
              to="/farmer/weather"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#166534] hover:underline"
            >
              Explore 7-Day Weather Dashboard <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>

          {/* Multilingual Assistant Card */}
          <div className="rounded-2xl border border-slate-200 bg-[#F7FAF7] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#166534]">
                  <Globe2 className="h-4 w-4" />
                  Multilingual & Voice Assistance
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-[#166534]">
                  English + اردو
                </span>
              </div>
              <h3 className="mt-3 text-xl font-bold text-[#17251B]">
                Ask FasalDoctor in Plain English or Urdu
              </h3>
              <p className="mt-2 text-sm text-[#64748B]">
                Designed for farmers who prefer speaking or reading in Urdu with native right-to-left typography and push-to-talk speech input ready for Faster-Whisper.
              </p>

              <div className="mt-5 space-y-2.5 rounded-xl border border-slate-200/80 bg-white p-4">
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <Mic className="h-4 w-4 text-[#166534]" />
                  <span>Push-to-talk voice query (Demo Mode)</span>
                </div>
                <p dir="rtl" className="rounded-lg bg-emerald-50/80 px-3 py-2 text-sm font-medium text-[#17251B]">
                  میرے خربوزے کے پتوں پر سفید پاؤڈر جیسے دھبے کیوں آ رہے ہیں؟
                </p>
                <div className="flex items-center gap-2 text-xs text-[#166534]">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Instant bilingual care checklist & prevention tips</span>
                </div>
              </div>
            </div>

            <Link
              to="/farmer/assistant"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#166534] hover:underline"
            >
              Open Ask FasalDoctor <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. EXPERT CONSULTATION */}
      <section id="expert-consultation" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">
              Human Agricultural Specialists (Demo Profiles)
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#17251B] sm:text-3xl">
              Independent Expert Consultation When You Need It
            </h2>
          </div>
          <Link
            to="/farmer/experts"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#166534] hover:underline"
          >
            Browse All Specialists <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {mockExperts.map((expert) => (
            <div
              key={expert.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#166534] text-sm font-bold text-white">
                  {getInitials(expert.name)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#17251B]">{expert.name}</h3>
                  <p className="text-xs font-semibold text-[#166534]">
                    {expert.specialization}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#64748B]">
                {expert.bio[language]}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <StatusBadge label={expert.availability} />
                <span className="text-[#64748B]">{expert.experienceYears} yrs exp.</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. WHY CHOOSE FASALDOCTOR */}
      <section className="border-y border-slate-200/70 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-[#17251B] sm:text-3xl">
              Why Choose FasalDoctor?
            </h2>
            <p className="mt-2 text-sm text-[#64748B]">
              Built specifically for melon crop realities—combining simplicity on mobile phones with responsible agricultural guidance.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: 'Responsible Guidance',
                desc: 'Clearly distinguishes possible AI screening results from verified agricultural diagnoses.',
              },
              {
                icon: Globe2,
                title: 'Urdu & English Ready',
                desc: 'Full RTL support and plain-language advice tailored for field accessibility.',
              },
              {
                icon: CloudRain,
                title: 'Weather-Aware',
                desc: 'Connects humidity and rain forecasts directly to melon fungal risk indicators.',
              },
              {
                icon: Stethoscope,
                title: 'Role-Based Portals',
                desc: 'Dedicated workflows for both Melon Farmers and Agricultural Experts.',
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200/80 bg-[#F7FAF7] p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-[#166534]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-[#17251B]">{feature.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#64748B]">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">
            Frequently Asked Questions
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#17251B] sm:text-3xl">
            Common Questions About FasalDoctor
          </h2>
        </div>

        <div className="mt-8 space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-sm font-semibold text-[#17251B] hover:bg-slate-50"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#64748B] transition-transform ${
                      isOpen ? 'rotate-180 text-[#166534]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-[#64748B]">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
