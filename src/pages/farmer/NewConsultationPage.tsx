import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send, Trash2, UploadCloud } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';
import { mockExperts } from '../../data/mockExperts';
import { consultationService } from '../../services/consultationService';
import { diseaseService } from '../../services/diseaseService';
import type { DiseaseScan } from '../../types';
import { fileToDataUrl } from '../../utils/formatters';

const schema = z.object({
  subject: z.string().min(5, 'Please provide a brief subject (at least 5 characters)'),
  description: z
    .string()
    .min(15, 'Describe the crop symptoms or question in at least 15 characters'),
  cropType: z.string().min(2, 'Crop type is required'),
  category: z.enum([
    'Leaf Disease',
    'Pest Damage',
    'Soil & Irrigation',
    'Weather Stress',
    'General Crop Care',
  ]),
  preferredLanguage: z.enum(['en', 'ur']),
  expertId: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']),
});

type FormValues = z.infer<typeof schema>;

export const NewConsultationPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialExpertId = searchParams.get('expertId') ?? '';
  const scanId = searchParams.get('scanId') ?? '';

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [linkedScan, setLinkedScan] = useState<DiseaseScan | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      cropType: 'Melon',
      category: 'Leaf Disease',
      preferredLanguage: language,
      expertId: initialExpertId,
      priority: 'Medium',
    },
  });

  useEffect(() => {
    if (!scanId) return;
    void diseaseService.getScanById(scanId).then((scan) => {
      if (scan) {
        setLinkedScan(scan);
        setUploadedImages([scan.imageUrl]);
        setValue('subject', `Follow-up question regarding ${scan.disease} (${scan.id})`);
      }
    });
  }, [scanId, setValue]);

  const handleFilesAdded = async (files: FileList | null) => {
    if (!files) return;
    const nextUrls: string[] = [];
    for (const file of Array.from(files).slice(0, 4)) {
      if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        nextUrls.push(await fileToDataUrl(file));
      }
    }
    setUploadedImages((prev) => [...prev, ...nextUrls].slice(0, 4));
  };

  const onSubmit = async (values: FormValues) => {
    const created = await consultationService.createRequest({
      farmerId: user?.id ?? 'farmer-1',
      farmerName: user?.name ?? 'Ahmed Raza',
      farmerLocation: user?.location ?? 'Multan, Punjab',
      farmerPhone: user?.phone ?? '+92 300 4512890',
      subject: values.subject,
      description: values.description,
      cropType: values.cropType,
      category: values.category,
      preferredLanguage: values.preferredLanguage,
      images: uploadedImages,
      expertId: values.expertId || undefined,
      priority: values.priority,
      linkedScanId: linkedScan?.id,
      linkedScanSummary: linkedScan
        ? `Possible ${linkedScan.disease} (${linkedScan.confidence.toFixed(1)}% demo confidence)`
        : undefined,
    });

    addNotification({
      userId: 'expert-1',
      role: 'expert',
      type: 'consultation',
      title: {
        en: `New consultation request (${created.id})`,
        ur: `نئی مشاورت کی درخواست (${created.id})`,
      },
      message: {
        en: `${created.farmerName} submitted: ${created.subject}`,
        ur: `${created.farmerName} نے نئی درخواست ارسال کی ہے۔`,
      },
      link: `/expert/requests/${created.id}`,
    });

    showToast({
      type: 'success',
      title: 'Consultation Request Submitted',
      message: `Created support ticket ${created.id}`,
    });

    navigate(`/farmer/consultation/${created.id}`);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/farmer/dashboard' },
          { label: 'Experts', to: '/farmer/experts' },
          { label: 'New Consultation Request' },
        ]}
      />

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <h1 className="text-2xl font-bold text-[#17251B]">
          Submit Agricultural Consultation Request
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Share your melon crop issue and photos directly with an agricultural specialist.
        </p>

        {linkedScan && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs">
            <img
              src={linkedScan.imageUrl}
              alt="Linked scan"
              className="h-11 w-11 rounded-lg object-cover"
            />
            <div>
              <p className="font-bold text-[#166534]">
                Attached Scan Context: {linkedScan.id}
              </p>
              <p className="text-[#64748B]">
                Possible {linkedScan.disease} ({linkedScan.confidence.toFixed(1)}% demo)
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Subject *
            </label>
            <input
              type="text"
              {...register('subject')}
              placeholder="e.g., Yellow angular patches on lower melon leaves"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-[#DC2626]">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Crop Type
            </label>
            <input
              type="text"
              {...register('cropType')}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Problem Category
            </label>
            <select
              {...register('category')}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none"
            >
              <option value="Leaf Disease">Leaf Disease</option>
              <option value="Pest Damage">Pest Damage</option>
              <option value="Soil & Irrigation">Soil & Irrigation</option>
              <option value="Weather Stress">Weather Stress</option>
              <option value="General Crop Care">General Crop Care</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
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
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Select Expert (Optional)
            </label>
            <select
              {...register('expertId')}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none"
            >
              <option value="">Auto-assign any available expert</option>
              {mockExperts.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.name} — {exp.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Urgency / Priority
            </label>
            <div className="flex gap-3">
              {(['Low', 'Medium', 'High'] as const).map((level) => (
                <label
                  key={level}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-[#17251B]"
                >
                  <input type="radio" value={level} {...register('priority')} />
                  {level}
                </label>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
              Description of Crop Problem *
            </label>
            <textarea
              rows={4}
              {...register('description')}
              placeholder="Explain when symptoms began, which field block is affected, recent irrigation or weather changes..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-[#DC2626]">{errors.description.message}</p>
            )}
          </div>

          {/* Crop Image Upload */}
          <div className="sm:col-span-2 space-y-3">
            <label className="block text-xs font-semibold text-[#17251B]">
              Upload Crop Images (Up to 4 JPG/PNG photos)
            </label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-[#F7FAF7] p-5 text-center hover:border-[#166534]">
              <UploadCloud className="h-6 w-6 text-[#166534]" />
              <span className="mt-2 text-xs font-semibold text-[#17251B]">
                Click to select melon leaf or vine photos
              </span>
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                className="hidden"
                onChange={(e) => void handleFilesAdded(e.target.files)}
              />
            </label>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {uploadedImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900"
                  >
                    <img
                      src={img}
                      alt={`Crop upload ${idx + 1}`}
                      className="h-24 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setUploadedImages((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="absolute top-1.5 end-1.5 rounded-lg bg-white/90 p-1 text-[#DC2626] shadow-xs hover:bg-white"
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-6 py-3 text-sm font-semibold text-white hover:bg-[#14532D] disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Submit Consultation Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
