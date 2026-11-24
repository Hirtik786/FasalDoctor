import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sprout, Stethoscope } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Enter a valid email address'),
    phone: z.string().min(8, 'Enter a valid phone number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
    preferredLanguage: z.enum(['en', 'ur']),
    location: z.string().min(2, 'Farm or city location is required'),
    role: z.enum(['farmer', 'expert']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const { setLanguage } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      preferredLanguage: 'en',
      role: 'farmer',
      location: 'Multan, Punjab',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      const user = await registerUser({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        preferredLanguage: values.preferredLanguage,
        location: values.location,
        role: values.role,
      });
      setLanguage(values.preferredLanguage);
      showToast({
        type: 'success',
        title: 'Account created successfully',
        message: `Welcome to FasalDoctor, ${user.name}!`,
      });
      navigate(user.role === 'expert' ? '/expert/dashboard' : '/farmer/dashboard');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 shadow-sm space-y-6">
        <div className="text-center">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#17251B]">Create Your Account</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Join FasalDoctor to protect melon crops or provide expert guidance
          </p>
        </div>

        {/* Role Selector */}
        <div>
          <label className="block text-xs font-semibold text-[#17251B] mb-2">
            Account Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue('role', 'farmer')}
              className={`flex items-center gap-2.5 rounded-2xl border p-3.5 text-start transition-all ${
                selectedRole === 'farmer'
                  ? 'border-[#166534] bg-emerald-50 text-[#166534]'
                  : 'border-slate-200 text-[#64748B] hover:border-slate-300'
              }`}
            >
              <Sprout className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-bold">Farmer</p>
                <p className="text-[11px]">Scan crops & consult experts</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setValue('role', 'expert')}
              className={`flex items-center gap-2.5 rounded-2xl border p-3.5 text-start transition-all ${
                selectedRole === 'expert'
                  ? 'border-[#166534] bg-emerald-50 text-[#166534]'
                  : 'border-slate-200 text-[#64748B] hover:border-slate-300'
              }`}
            >
              <Stethoscope className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-bold">Agricultural Expert</p>
                <p className="text-[11px]">Review & guide farmers</p>
              </div>
            </button>
          </div>
        </div>

        {serverError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-[#DC2626]">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#17251B] mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="Ahmed Raza"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-[#DC2626]">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="ahmed@example.com"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-[#DC2626]">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone')}
              placeholder="+92 300 1234567"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-[#DC2626]">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1">
              Preferred Language
            </label>
            <select
              {...register('preferredLanguage')}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none"
            >
              <option value="en">English</option>
              <option value="ur">اردو (Urdu)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1">
              Farm Location
            </label>
            <input
              type="text"
              {...register('location')}
              placeholder="Multan, Punjab"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
            />
            {errors.location && (
              <p className="mt-1 text-xs text-[#DC2626]">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1">
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              placeholder="Min. 6 characters"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-[#DC2626]">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...register('confirmPassword')}
              placeholder="Re-enter password"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-[#DC2626]">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] py-3 text-sm font-semibold text-white hover:bg-[#14532D] disabled:opacity-60 transition-colors"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Account
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-[#64748B]">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-[#166534] hover:underline">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};
