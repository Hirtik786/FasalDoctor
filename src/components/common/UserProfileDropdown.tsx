import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getInitials } from '../../utils/formatters';

export const UserProfileDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  if (!user) return null;

  const basePath = user.role === 'expert' ? '/expert' : '/farmer';

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-start hover:bg-slate-50 transition-colors"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#166534] text-xs font-bold text-white">
          {getInitials(user.name)}
        </div>
        <div className="hidden md:block leading-tight">
          <p className="text-xs font-semibold text-[#17251B]">{user.name}</p>
          <p className="text-[11px] capitalize text-[#64748B]">{user.role}</p>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-[#64748B]" />
      </button>

      {open && (
        <div className="absolute end-0 z-40 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <div className="border-b border-slate-100 px-3 py-2.5">
            <p className="text-xs font-bold text-[#17251B]">{user.name}</p>
            <p className="truncate text-[11px] text-[#64748B]">{user.email}</p>
          </div>
          <div className="py-1">
            <Link
              to={`${basePath}/profile`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#17251B] hover:bg-emerald-50 hover:text-[#166534]"
            >
              <UserIcon className="h-4 w-4" />
              {t('sideProfile')}
            </Link>
            <Link
              to={`${basePath}/settings`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#17251B] hover:bg-emerald-50 hover:text-[#166534]"
            >
              <Settings className="h-4 w-4" />
              {t('sideSettings')}
            </Link>
          </div>
          <div className="border-t border-slate-100 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#DC2626] hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              {t('sideLogout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
