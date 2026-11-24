import React from 'react';
import {
  BookOpen,
  Camera,
  CloudSun,
  Cpu,
  FileCheck2,
  Stethoscope,
  UserPlus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

const STEPS = [
  {
    number: 1,
    title: 'Register or Log In',
    description:
      'Create a Farmer or Agricultural Expert account (or use instant 1-click Demo Access on the login page) and choose English or Urdu.',
    icon: UserPlus,
    actionLabel: 'Go to Login',
    actionTo: '/login',
  },
  {
    number: 2,
    title: 'Upload or Capture a Melon Leaf Image',
    description:
      'Drag and drop a clear JPG/PNG photograph of a melon leaf, browse from your phone, or capture live using your device camera in good daylight.',
    icon: Camera,
    actionLabel: 'Open Scanner',
    actionTo: '/farmer/disease-detection',
  },
  {
    number: 3,
    title: 'AI Analyzes the Leaf Image',
    description:
      'The scanning interface validates the photo and routes it to the MobileNetV2 classification service (or runs clearly labeled demo screening when offline).',
    icon: Cpu,
  },
  {
    number: 4,
    title: 'View Possible Disease Results',
    description:
      'Review the predicted condition (e.g., Healthy Leaf, Powdery Mildew, Downy Mildew, Anthracnose), confidence score, and responsible disclaimer.',
    icon: FileCheck2,
  },
  {
    number: 5,
    title: 'Read Treatment & Prevention Guidance',
    description:
      'Explore symptom checklists, preventive field hygiene, and treatment guidance in English or Urdu—always marked for local agronomic verification.',
    icon: BookOpen,
    actionLabel: 'Knowledge Center',
    actionTo: '/farmer/knowledge',
  },
  {
    number: 6,
    title: 'Check Weather Advisory',
    description:
      'Review 7-day temperature, humidity, and rainfall trends alongside indicative fungal risk alerts and practical irrigation timing tips.',
    icon: CloudSun,
    actionLabel: 'Weather Advisory',
    actionTo: '/farmer/weather',
  },
  {
    number: 7,
    title: 'Contact an Agricultural Expert Independently',
    description:
      'Whenever you want human specialist guidance—with or without an AI scan—submit a consultation request with photos and track expert responses.',
    icon: Stethoscope,
    actionLabel: 'Consult an Expert',
    actionTo: '/farmer/experts',
  },
];

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <div>
        <Breadcrumbs items={[{ label: 'How It Works' }]} />
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">
            Complete Farmer Workflow
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#17251B] sm:text-4xl">
            How FasalDoctor Supports Your Melon Crop
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#64748B]">
            Follow a clear, mobile-friendly workflow from quick leaf screening to weather readiness and optional agricultural expert consultation.
          </p>
        </div>
      </div>

      {/* Visual Step-by-Step Timeline */}
      <div className="relative space-y-5 before:absolute before:start-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-emerald-200 sm:before:start-8">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="relative flex gap-4 sm:gap-6">
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-4 border-[#F7FAF7] bg-[#166534] text-sm font-bold text-white shadow-xs sm:h-16 sm:w-16">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>

              <div className="flex-1 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#166534]">
                    Step {step.number}
                  </span>
                  {step.actionTo && step.actionLabel && (
                    <Link
                      to={step.actionTo}
                      className="text-xs font-semibold text-[#166534] hover:underline"
                    >
                      {step.actionLabel} →
                    </Link>
                  )}
                </div>
                <h2 className="mt-1.5 text-lg font-bold text-[#17251B]">{step.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[#64748B]">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
