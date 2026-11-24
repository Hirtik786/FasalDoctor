import React, { useState } from 'react';
import {
  BookOpen,
  BriefcaseMedical,
  CloudSun,
  ClipboardList,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquareReply,
  ScanLine,
  Settings,
  Stethoscope,
  User as UserIcon,
  Users,
  X,
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { DemoBanner } from '../components/common/DemoBanner';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { Logo } from '../components/common/Logo';
import { NotificationDropdown } from '../components/common/NotificationDropdown';
import { SearchBar } from '../components/common/SearchBar';
import { UserProfileDropdown } from '../components/common/UserProfileDropdown';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import type { UserRole } from '../types';

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface PortalLayoutProps {
  role: UserRole;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ role }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const { logout } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const farmerItems: NavItem[] = [
    { label: t('sideOverview'), to: '/farmer/dashboard', icon: LayoutDashboard },
    { label: t('sideDiseaseDetection'), to: '/farmer/disease-detection', icon: ScanLine },
    { label: t('sideScanHistory'), to: '/farmer/scan-history', icon: History },
    { label: t('sideWeatherAdvisory'), to: '/farmer/weather', icon: CloudSun },
    { label: t('sideAskAssistant'), to: '/farmer/assistant', icon: MessageCircle },
    { label: t('sideExpertConsultation'), to: '/farmer/experts', icon: Stethoscope },
    { label: t('sideSupportRequests'), to: '/farmer/consultation/requests', icon: ClipboardList },
    { label: t('sideKnowledgeCenter'), to: '/farmer/knowledge', icon: BookOpen },
    { label: t('sideProfile'), to: '/farmer/profile', icon: UserIcon },
    { label: t('sideSettings'), to: '/farmer/settings', icon: Settings },
  ];

  const expertItems: NavItem[] = [
    { label: t('expOverview'), to: '/expert/dashboard', icon: LayoutDashboard },
    { label: t('expRequests'), to: '/expert/requests', icon: ClipboardList },
    { label: t('expAssigned'), to: '/expert/assigned', icon: BriefcaseMedical },
    { label: t('expRespond'), to: '/expert/respond', icon: MessageSquareReply },
    { label: t('expHistory'), to: '/expert/history', icon: Users },
    { label: t('sideProfile'), to: '/expert/profile', icon: UserIcon },
    { label: t('sideSettings'), to: '/expert/settings', icon: Settings },
  ];

  const navItems = role === 'expert' ? expertItems : farmerItems;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearch.trim()) return;
    if (role === 'farmer') {
      navigate(`/farmer/scan-history?q=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      navigate(`/expert/requests?q=${encodeURIComponent(quickSearch.trim())}`);
    }
  };

  const SidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white">
      <div>
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Logo to={role === 'expert' ? '/expert/dashboard' : '/farmer/dashboard'} showTagline />
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-3 py-4">
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            {role === 'expert'
              ? language === 'ur'
                ? 'ماہر پورٹل'
                : 'Agricultural Expert Portal'
              : language === 'ur'
              ? 'کسان پورٹل'
              : 'Farmer Portal'}
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#166534] text-white shadow-xs'
                        : 'text-[#64748B] hover:bg-emerald-50/70 hover:text-[#166534]'
                    }`
                  }
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#DC2626] hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          <span>{t('sideLogout')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7FAF7] text-[#17251B] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-68 shrink-0 border-e border-slate-200/80 bg-white sticky top-0 h-screen overflow-y-auto">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[85vw] shadow-2xl h-full overflow-y-auto">
            {SidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Shell */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-[#17251B] hover:bg-slate-50 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <form onSubmit={handleQuickSearchSubmit} className="hidden sm:block w-full max-w-sm">
              <SearchBar
                value={quickSearch}
                onChange={setQuickSearch}
                placeholder={t('searchPlaceholder')}
              />
            </form>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector compact />
            <NotificationDropdown />
            <UserProfileDropdown />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto space-y-5">
          <DemoBanner />
          <Outlet />
        </main>
      </div>
    </div>
  );
};
