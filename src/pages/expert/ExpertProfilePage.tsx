import React, { useState } from 'react';
import { Award, Globe2, Loader2, Save, Stethoscope } from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getInitials } from '../../utils/formatters';

export const ExpertProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name ?? 'Dr. Ahmed Khan');
  const [specialization, setSpecialization] = useState(
    user?.specialization ?? 'Crop Disease Specialist (Cucurbits)'
  );
  const [qualifications, setQualifications] = useState(
    user?.qualifications ?? 'Ph.D. Plant Pathology, UAF (Demo Profile)'
  );
  const [experienceYears, setExperienceYears] = useState(user?.experienceYears ?? 11);
  const [languages, setLanguages] = useState(
    (user?.languages ?? ['English', 'Urdu']).join(', ')
  );
  const [availability, setAvailability] = useState<'Available' | 'Busy' | 'Offline'>(
    user?.availability ?? 'Available'
  );
  const [bio, setBio] = useState(
    user?.bio ??
      'Demo agricultural specialist profile focused on cucurbit foliar pathogens and field-level preventive guidance.'
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name,
        specialization,
        qualifications,
        experienceYears: Number(experienceYears),
        languages: languages
          .split(',')
          .map((l) => l.trim())
          .filter(Boolean),
        availability,
        bio,
      });
      showToast({
        type: 'success',
        title: 'Expert Profile Updated',
        message: 'Your demonstration specialist profile has been saved.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumbs
        items={[
          { label: 'Expert Dashboard', to: '/expert/dashboard' },
          { label: 'Profile' },
        ]}
      />

      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#166534] text-xl font-bold text-white">
              {getInitials(name)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#17251B]">{name}</h1>
              <p className="text-sm font-medium text-[#166534] flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4" />
                {specialization}
              </p>
              <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
                <Award className="h-3.5 w-3.5" />
                {qualifications}
              </p>
            </div>
          </div>
          <StatusBadge label={availability} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Availability Status
            </label>
            <select
              value={availability}
              onChange={(e) =>
                setAvailability(e.target.value as 'Available' | 'Busy' | 'Offline')
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Specialization
            </label>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Qualifications
            </label>
            <input
              type="text"
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Experience (Years)
            </label>
            <input
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              <span className="inline-flex items-center gap-1">
                <Globe2 className="h-3.5 w-3.5 text-[#166534]" />
                Languages (comma separated)
              </span>
            </label>
            <input
              type="text"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Professional Biography (Demo)
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#14532D] disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Expert Profile
        </button>
      </form>
    </div>
  );
};
