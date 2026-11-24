import React, { useState } from 'react';
import { Bell, Globe2, Lock, Save } from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';

export const FarmerSettingsPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { showToast } = useToast();

  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [expertAlerts, setExpertAlerts] = useState(true);
  const [scanAlerts, setScanAlerts] = useState(true);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);

  const handleSavePreferences = () => {
    showToast({
      type: 'success',
      title: 'Preferences Saved',
      message: 'Language and notification preferences updated.',
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    if (newPw.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('New passwords do not match.');
      return;
    }
    await authService.changePassword(currentPw, newPw);
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    showToast({
      type: 'success',
      title: 'Password Updated (Demo)',
      message: 'Your demonstration session password has been updated.',
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/farmer/dashboard' },
          { label: 'Settings' },
        ]}
      />

      <h1 className="text-2xl font-bold text-[#17251B]">Account & App Settings</h1>

      {/* Language Preferences */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Globe2 className="h-5 w-5 text-[#166534]" />
          <h2 className="text-base font-bold text-[#17251B]">Language Preferences</h2>
        </div>
        <p className="text-xs text-[#64748B]">
          Switch the interface between English (LTR) and Urdu (RTL).
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`rounded-xl border px-4 py-2.5 text-xs font-semibold ${
              language === 'en'
                ? 'border-[#166534] bg-[#166534] text-white'
                : 'border-slate-200 text-[#17251B]'
            }`}
          >
            English (LTR)
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ur')}
            className={`rounded-xl border px-4 py-2.5 text-xs font-semibold ${
              language === 'ur'
                ? 'border-[#166534] bg-[#166534] text-white'
                : 'border-slate-200 text-[#17251B]'
            }`}
          >
            اردو (RTL)
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#166534]" />
          <h2 className="text-base font-bold text-[#17251B]">Notification Preferences</h2>
        </div>
        <div className="space-y-3 text-sm">
          {[
            {
              label: 'Weather & fungal risk advisories',
              checked: weatherAlerts,
              set: setWeatherAlerts,
            },
            {
              label: 'Agricultural expert replies & updates',
              checked: expertAlerts,
              set: setExpertAlerts,
            },
            {
              label: 'AI leaf scan completion alerts',
              checked: scanAlerts,
              set: setScanAlerts,
            },
          ].map((item) => (
            <label
              key={item.label}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#F7FAF7] px-4 py-3"
            >
              <span className="font-medium text-[#17251B]">{item.label}</span>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.set(e.target.checked)}
                className="h-4 w-4 accent-[#166534]"
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={handleSavePreferences}
          className="inline-flex items-center gap-2 rounded-xl bg-[#166534] px-4 py-2 text-xs font-semibold text-white hover:bg-[#14532D]"
        >
          <Save className="h-4 w-4" />
          Save Preferences
        </button>
      </div>

      {/* Password Change */}
      <form
        onSubmit={handlePasswordChange}
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-[#166534]" />
          <h2 className="text-base font-bold text-[#17251B]">Change Password</h2>
        </div>

        {pwError && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-[#DC2626]">
            {pwError}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <input
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            placeholder="Current password"
            className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
          />
          <input
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="New password"
            className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
          />
          <input
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="Confirm new password"
            className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#17251B] hover:bg-slate-50"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};
