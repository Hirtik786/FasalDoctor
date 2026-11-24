import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, Mail, Sprout, Stethoscope } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import type { UserRole } from '../../types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [demoLoadingRole, setDemoLoadingRole] = useState<UserRole | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'ahmed.farmer@fasaldoctor.demo',
      password: 'demo1234',
      rememberMe: true,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const user = await login(values);
      showToast({
        type: 'success',
        title: `Welcome back, ${user.name}!`,
        message: `Signed in to ${user.role === 'expert' ? 'Expert' : 'Farmer'} Portal`,
      });
      navigate(user.role === 'expert' ? '/expert/dashboard' : '/farmer/dashboard');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Unable to sign in');
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setServerError(null);
    setDemoLoadingRole(role);
    try {
      const user = await loginAsDemo(role);
      showToast({
        type: 'success',
        title: `Demo ${role === 'expert' ? 'Expert' : 'Farmer'} Session Started`,
        message: `Signed in as ${user.name}`,
      });
      navigate(role === 'expert' ? '/expert/dashboard' : '/farmer/dashboard');
    } finally {
      setDemoLoadingRole(null);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-sm">
        <div className="text-center">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-[#17251B]">Sign In to FasalDoctor</h1>
          <p className="mt-1.5 text-sm text-[#64748B]">
            Access your Farmer or Agricultural Expert portal
          </p>
        </div>

        {/* Instant Role-Based Demo Access */}
        <div className="rounded-2xl border border-emerald-200/80 bg-[#F7FAF7] p-4 space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#166534]">
            Quick FYP Demo Access (1-Click)
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={demoLoadingRole !== null}
              onClick={() => handleDemoLogin('farmer')}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#166534]/30 bg-white px-3 py-2.5 text-xs font-semibold text-[#166534] hover:bg-emerald-50 transition-colors"
            >
              {demoLoadingRole === 'farmer' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sprout className="h-4 w-4" />
              )}
              Demo Farmer
            </button>
            <button
              type="button"
              disabled={demoLoadingRole !== null}
              onClick={() => handleDemoLogin('expert')}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#166534]/30 bg-white px-3 py-2.5 text-xs font-semibold text-[#166534] hover:bg-emerald-50 transition-colors"
            >
              {demoLoadingRole === 'expert' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Stethoscope className="h-4 w-4" />
              )}
              Demo Expert
            </button>
          </div>
        </div>

        {serverError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-[#DC2626]">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                type="email"
                {...register('email')}
                className="w-full rounded-xl border border-slate-200 py-2.5 ps-10 pe-3 text-sm focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-[#DC2626]">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                type="password"
                {...register('password')}
                className="w-full rounded-xl border border-slate-200 py-2.5 ps-10 pe-3 text-sm focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-[#DC2626]">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="inline-flex items-center gap-2 text-[#64748B]">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 rounded border-slate-300 text-[#166534] focus:ring-[#166534]"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="font-semibold text-[#166534] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#14532D] disabled:opacity-60 transition-colors"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-[#64748B]">
          New to FasalDoctor?{' '}
          <Link to="/register" className="font-semibold text-[#166534] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
