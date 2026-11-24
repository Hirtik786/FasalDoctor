import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Logo } from '../../components/common/Logo';

const schema = z.object({
  email: z.string().email('Please enter a valid registered email address'),
});

type FormValues = z.infer<typeof schema>;

export const ForgotPasswordPage: React.FC = () => {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 450));
    setSubmittedEmail(values.email);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-sm space-y-6">
        <div className="text-center">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-[#17251B]">Reset Password</h1>
          <p className="mt-1.5 text-sm text-[#64748B]">
            Enter your email to simulate a password recovery link
          </p>
        </div>

        {submittedEmail ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-center space-y-3">
            <CheckCircle2 className="mx-auto h-8 w-8 text-[#166534]" />
            <h2 className="text-base font-bold text-[#17251B]">
              Demo Recovery Link Prepared
            </h2>
            <p className="text-xs leading-relaxed text-[#64748B]">
              In production, a reset link would be sent to{' '}
              <span className="font-semibold text-[#17251B]">{submittedEmail}</span>. For this demonstration build, you can sign in immediately using the demo buttons on the login page.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#166534] px-4 py-2 text-xs font-semibold text-white"
            >
              Return to Login
            </Link>
          </div>
        ) : (
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
                  placeholder="ahmed.farmer@fasaldoctor.demo"
                  className="w-full rounded-xl border border-slate-200 py-2.5 ps-10 pe-3 text-sm focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-[#DC2626]">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#166534] py-3 text-sm font-semibold text-white hover:bg-[#14532D] disabled:opacity-60"
            >
              Send Recovery Instructions
            </button>
          </form>
        )}

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#166534]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
