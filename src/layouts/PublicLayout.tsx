import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const PublicLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSectionLink = (hash: string) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate(`/${hash}`);
      setTimeout(() => {
        const el = document.querySelector(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
      return;
    }
    const el = document.querySelector(hash);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const portalHref =
    user?.role === 'expert' ? '/expert/dashboard' : '/farmer/dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF7] text-[#17251B]">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo to="/" showTagline />

          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-[#64748B]">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `transition-colors hover:text-[#166534] ${
                  isActive ? 'font-semibold text-[#166534]' : ''
                }`
              }
            >
              {t('navHome')}
            </NavLink>
            <NavLink
              to="/how-it-works"
              className={({ isActive }) =>
                `transition-colors hover:text-[#166534] ${
                  isActive ? 'font-semibold text-[#166534]' : ''
                }`
              }
            >
              {t('navHowItWorks')}
            </NavLink>
            <button
              type="button"
              onClick={() => handleSectionLink('#ai-detection')}
              className="transition-colors hover:text-[#166534]"
            >
              {t('navDiseaseDetection')}
            </button>
            <button
              type="button"
              onClick={() => handleSectionLink('#weather-advisory')}
              className="transition-colors hover:text-[#166534]"
            >
              {t('navWeatherAdvisory')}
            </button>
            <button
              type="button"
              onClick={() => handleSectionLink('#expert-consultation')}
              className="transition-colors hover:text-[#166534]"
            >
              {t('navExpertConsultation')}
            </button>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition-colors hover:text-[#166534] ${
                  isActive ? 'font-semibold text-[#166534]' : ''
                }`
              }
            >
              {t('navAbout')}
            </NavLink>
          </nav>

          <div className="flex items-center gap-2.5">
            <LanguageSelector compact />
            {isAuthenticated ? (
              <Link
                to={portalHref}
                className="hidden sm:inline-flex items-center rounded-xl bg-[#166534] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#14532D] transition-colors"
              >
                {language === 'ur' ? 'ڈیش بورڈ کھولیں' : 'Open Dashboard'}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#17251B] hover:bg-slate-50 transition-colors"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center rounded-xl bg-[#166534] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#14532D] transition-colors"
                >
                  {t('navGetStarted')}
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex xl:hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-[#17251B] hover:bg-slate-50"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 xl:hidden">
            <div className="flex flex-col gap-2 text-sm font-medium text-[#17251B]">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2 hover:bg-emerald-50"
              >
                {t('navHome')}
              </Link>
              <Link
                to="/how-it-works"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2 hover:bg-emerald-50"
              >
                {t('navHowItWorks')}
              </Link>
              <button
                type="button"
                onClick={() => handleSectionLink('#ai-detection')}
                className="rounded-xl px-3 py-2 text-start hover:bg-emerald-50"
              >
                {t('navDiseaseDetection')}
              </button>
              <button
                type="button"
                onClick={() => handleSectionLink('#weather-advisory')}
                className="rounded-xl px-3 py-2 text-start hover:bg-emerald-50"
              >
                {t('navWeatherAdvisory')}
              </button>
              <button
                type="button"
                onClick={() => handleSectionLink('#expert-consultation')}
                className="rounded-xl px-3 py-2 text-start hover:bg-emerald-50"
              >
                {t('navExpertConsultation')}
              </button>
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2 hover:bg-emerald-50"
              >
                {t('navAbout')}
              </Link>
              <div className="mt-2 flex gap-2 border-t border-slate-100 pt-3">
                {isAuthenticated ? (
                  <Link
                    to={portalHref}
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-xl bg-[#166534] py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Open Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold"
                    >
                      {t('navLogin')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 rounded-xl bg-[#166534] py-2.5 text-center text-sm font-semibold text-white"
                    >
                      {t('navGetStarted')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <Logo to="/" showTagline />
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#64748B]">
                {language === 'ur'
                  ? 'فصل ڈاکٹر خربوزے کی فصلوں کی ابتدائی بیماریوں کی نشاندہی، موسمی رہنمائی اور ماہرین سے براہِ راست مشاورت کے لیے ایک جدید زرعی پلیٹ فارم ہے۔'
                  : 'FasalDoctor empowers melon growers with AI-assisted leaf screening, weather-based fungal risk advisories, bilingual guidance in English & Urdu, and independent access to agricultural specialists.'}
              </p>
              <p className="mt-3 text-xs text-[#64748B]">
                FYP-I Demonstration Platform • AI outputs and mock advisories require professional verification.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#17251B]">
                Platform
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-[#64748B]">
                <li>
                  <Link to="/how-it-works" className="hover:text-[#166534]">
                    {t('navHowItWorks')}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#166534]">
                    {t('navAbout')}
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-[#166534]">
                    Farmer & Expert Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-[#166534]">
                    Create Demo Account
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#17251B]">
                Core Support Tracks
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-[#64748B]">
                <li>
                  <Link to="/farmer/disease-detection" className="hover:text-[#166534]">
                    AI Disease Detection
                  </Link>
                </li>
                <li>
                  <Link to="/farmer/weather" className="hover:text-[#166534]">
                    Weather Crop Advisory
                  </Link>
                </li>
                <li>
                  <Link to="/farmer/assistant" className="hover:text-[#166534]">
                    Ask FasalDoctor (EN / اردو)
                  </Link>
                </li>
                <li>
                  <Link to="/farmer/experts" className="hover:text-[#166534]">
                    Expert Consultation
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-[#64748B] sm:flex-row">
            <p>© 2026 FasalDoctor. Final Year Project Demonstration.</p>
            <p>Prepared for FastAPI • MobileNetV2 • Faster-Whisper • PostgreSQL</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
