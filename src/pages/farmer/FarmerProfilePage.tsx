import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, Sprout } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { getInitials } from '../../utils/formatters';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Phone number is required'),
  location: z.string().min(2, 'Location is required'),
  preferredLanguage: z.enum(['en', 'ur']),
  farmName: z.string().optional(),
  farmSizeAcres: z.coerce.number().min(0).optional(),
  melonVariety: z.string().optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

export const FarmerProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { setLanguage } = useLanguage();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema) as never,
    defaultValues: {
      name: user?.name ?? 'Ahmed Raza',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      location: user?.location ?? 'Multan, Punjab',
      preferredLanguage: user?.preferredLanguage ?? 'en',
      farmName: user?.farmName ?? 'Green Crescent Melon Farm',
      farmSizeAcres: user?.farmSizeAcres ?? 12,
      melonVariety: user?.melonVariety ?? 'Honeydew & Cantaloupe',
    },
  });

  const onSubmit = async (values: ProfileValues) => {
    setSaving(true);
    try {
      await updateProfile(values);
      setLanguage(values.preferredLanguage);
      showToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your farm and contact details have been saved.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/farmer/dashboard' },
          { label: 'Profile' },
        ]}
      />

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#166534] text-xl font-bold text-white">
            {getInitials(user?.name ?? 'Ahmed Raza')}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#17251B]">{user?.name}</h1>
            <p className="text-sm text-[#64748B] flex items-center gap-1.5">
              <Sprout className="h-4 w-4 text-[#166534]" />
              Melon Grower • {user?.location}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-[#DC2626]">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Location
            </label>
            <input
              type="text"
              {...register('location')}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Preferred Language
            </label>
            <select
              {...register('preferredLanguage')}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
            >
              <option value="en">English</option>
              <option value="ur">اردو (Urdu)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Farm Name
            </label>
            <input
              type="text"
              {...register('farmName')}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Farm Size (Acres)
            </label>
            <input
              type="number"
              {...register('farmSizeAcres')}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Primary Melon Variety
            </label>
            <input
              type="text"
              {...register('melonVariety')}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div className="sm:col-span-2 pt-2">
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
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
