import React, { useState } from 'react';
import { CheckCircle2, Info, Loader2, ScanLine, Sparkles, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { ImageUploader } from '../../components/common/ImageUploader';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';
import { diseaseService } from '../../services/diseaseService';

const SCAN_STAGES = [
  'Validating image dimensions & leaf visibility...',
  'Preprocessing foliage texture...',
  'Running classification check (Demo / MobileNetV2-ready)...',
  'Preparing bilingual guidance & confidence report...',
];

export const DiseaseDetectionPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);

  const handleImageSelect = (dataUrl: string, name: string, file?: File) => {
    setError(null);
    setImageUrl(dataUrl);
    setFileName(name);
    setSelectedFile(file);
  };

  const handleClear = () => {
    setImageUrl(null);
    setFileName('');
    setSelectedFile(undefined);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!imageUrl) {
      setError('Please upload or capture a melon leaf image before analyzing.');
      return;
    }

    setError(null);
    setAnalyzing(true);
    setStageIndex(0);

    const timer = setInterval(() => {
      setStageIndex((prev) => (prev < SCAN_STAGES.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const scanResult = await diseaseService.predictDisease({
        imageDataUrl: imageUrl,
        fileName,
        file: selectedFile,
        farmerId: user?.id ?? 'farmer-1',
        farmerName: user?.name ?? 'Ahmed Raza',
        location: user?.location ?? 'Multan, Punjab',
        notes: notes.trim() || undefined,
      });

      addNotification({
        userId: user?.id ?? 'farmer-1',
        role: 'farmer',
        type: 'scan',
        title: {
          en: 'Disease scan completed',
          ur: 'پتے کا اسکین مکمل ہو گیا',
        },
        message: {
          en: `Possible ${scanResult.disease} (${scanResult.confidence.toFixed(1)}% demo confidence).`,
          ur: `ممکنہ نتیجہ: ${scanResult.disease}۔`,
        },
        link: `/farmer/scan-results/${scanResult.id}`,
      });

      showToast({
        type: 'success',
        title: 'Leaf screening complete',
        message: `Result saved as ${scanResult.id} (Demo screening output)`,
      });

      navigate(`/farmer/scan-results/${scanResult.id}`);
    } catch {
      setError('Unable to analyze the image right now. Please try another photograph.');
      setAnalyzing(false);
    } finally {
      clearInterval(timer);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/farmer/dashboard' },
          { label: 'Melon Disease Detection' },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Upload & Scanning Card */}
        <div className="lg:col-span-8 space-y-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-[#17251B]">
                  Melon Disease Detection
                </h1>
                <p className="mt-1 text-sm text-[#64748B]">
                  Upload a clear image of your melon leaf to identify possible diseases.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#166534]">
                <Sparkles className="h-3.5 w-3.5" />
                MobileNetV2 Ready (Demo)
              </span>
            </div>

            <div className="mt-6 relative">
              <ImageUploader
                imageUrl={imageUrl}
                fileName={fileName}
                onImageSelect={handleImageSelect}
                onClear={handleClear}
                error={error}
                onError={(msg) => setError(msg)}
              />

              {/* Animated Scanning Overlay */}
              {analyzing && imageUrl && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-slate-950/75 p-6 text-center text-white backdrop-blur-xs">
                  <div className="relative h-40 w-40 overflow-hidden rounded-2xl border-2 border-[#22C55E]">
                    <img
                      src={imageUrl}
                      alt="Scanning leaf"
                      className="h-full w-full object-cover opacity-75"
                    />
                    <div className="animate-scan-line absolute start-0 end-0 h-1 bg-[#84CC16] shadow-[0_0_12px_#84CC16]" />
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-sm font-bold">
                    <Loader2 className="h-4 w-4 animate-spin text-[#84CC16]" />
                    <span>Analyzing Melon Leaf...</span>
                  </div>
                  <p className="mt-1.5 text-xs text-emerald-100">
                    {SCAN_STAGES[stageIndex]}
                  </p>
                  <div className="mt-4 h-2 w-60 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-[#22C55E] transition-all duration-300"
                      style={{ width: `${((stageIndex + 1) / SCAN_STAGES.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5">
              <label className="block text-xs font-semibold text-[#17251B] mb-1.5">
                Field Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Block A lower leaf after morning irrigation"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={analyzing}
                onClick={handleAnalyze}
                className="inline-flex items-center gap-2 rounded-xl bg-[#166534] px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#14532D] disabled:opacity-60 transition-colors"
              >
                {analyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ScanLine className="h-4 w-4" />
                )}
                Analyze Image
              </button>
              <button
                type="button"
                disabled={analyzing || !imageUrl}
                onClick={handleClear}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#17251B] hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Clear Image
              </button>
            </div>
          </div>
        </div>

        {/* Photo Guidelines & Responsible Notice */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <h2 className="text-base font-bold text-[#17251B]">
              Photo Capture Instructions
            </h2>
            <ul className="mt-3 space-y-2.5 text-xs text-[#64748B]">
              {[
                'Capture a clear leaf image up close.',
                'Ensure good natural daylight without deep shadows.',
                'Keep the entire affected leaf surface visible in frame.',
                'Avoid blurry photographs or distant wide shots.',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#22C55E]" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <Info className="h-4 w-4 text-[#F59E0B]" />
              <span>Important Screening Notice</span>
            </div>
            <p className="leading-relaxed">
              FasalDoctor provides possible AI leaf classifications as early screening support—not a guaranteed diagnosis. When running without the live FastAPI model server, demonstration predictions are displayed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
