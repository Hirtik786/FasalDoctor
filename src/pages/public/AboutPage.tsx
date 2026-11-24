import React from 'react';
import { Award, Cpu, Globe2, Leaf, ShieldCheck, Stethoscope, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

export const AboutPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <div>
        <Breadcrumbs items={[{ label: 'About FasalDoctor' }]} />
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#166534]">
            <Leaf className="h-3.5 w-3.5" />
            About the Project
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#17251B] sm:text-4xl">
            Empowering Melon Growers with Accessible AI & Agricultural Expertise
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#64748B]">
            FasalDoctor is an AI-powered multilingual melon crop disease detection and agricultural advisory platform designed as a modern, farmer-friendly Final Year Project product. It bridges the gap between early leaf symptom awareness and reliable agronomic support.
          </p>
        </div>
      </div>

      {/* Problem & Objectives */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-[#F59E0B]">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[#17251B]">The Problem We Address</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
            Melon crops are vulnerable to foliar fungal and oomycete diseases such as Powdery Mildew, Downy Mildew, and Anthracnose. Delayed recognition, language barriers in technical agronomy resources, and sudden humidity shifts often lead to avoidable yield loss.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#166534]">
            <Award className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[#17251B]">Platform Objectives</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#64748B]">
            <li>• Provide fast, smartphone-friendly leaf image screening using a MobileNetV2-ready workflow.</li>
            <li>• Deliver bilingual (English & Urdu) guidance and voice-assisted queries.</li>
            <li>• Offer weather-linked fungal risk advisories for proactive field care.</li>
            <li>• Maintain an independent human expert consultation channel for verified advice.</li>
          </ul>
        </div>
      </div>

      {/* Two Independent Pillars */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-7">
          <Cpu className="h-6 w-6 text-[#166534]" />
          <h3 className="mt-3 text-lg font-bold text-[#17251B]">
            AI-Powered Agricultural Assistance
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
            Integrates leaf image screening, environmental weather tracking, and bilingual conversational assistance (prepared for FastAPI, MobileNetV2, Faster-Whisper, and Weather API). All AI outputs are responsibly framed as indicative screening tools rather than guaranteed diagnoses.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7">
          <Stethoscope className="h-6 w-6 text-[#166534]" />
          <h3 className="mt-3 text-lg font-bold text-[#17251B]">
            Independent Human Expert Support
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
            Farmers can directly consult agricultural specialists at any time without going through an AI scan. Experts get their own dedicated portal to triage incoming requests, review field photos, and write bilingual treatment guidance.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="rounded-3xl bg-[#166534] p-8 sm:p-10 text-white">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#84CC16]">
              <ShieldCheck className="h-4 w-4" />
              Our Mission
            </div>
            <p className="mt-3 text-base leading-relaxed text-emerald-50">
              To make early crop health awareness, weather readiness, and expert agricultural guidance intuitive and accessible to melon farmers regardless of language or technical background.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#84CC16]">
              <Globe2 className="h-4 w-4" />
              Our Vision
            </div>
            <p className="mt-3 text-base leading-relaxed text-emerald-50">
              A connected farming ecosystem where responsible AI screening and local agricultural specialists work side-by-side to reduce preventable crop losses and promote sustainable cultivation.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/register"
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#166534] hover:bg-emerald-50"
          >
            Create Demo Account
          </Link>
          <Link
            to="/how-it-works"
            className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            See How It Works
          </Link>
        </div>
      </div>
    </div>
  );
};
