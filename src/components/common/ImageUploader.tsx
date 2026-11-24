import React, { useRef, useState } from 'react';
import { Camera, RefreshCw, Trash2, UploadCloud, X } from 'lucide-react';
import { fileToDataUrl } from '../../utils/formatters';

interface ImageUploaderProps {
  imageUrl: string | null;
  fileName?: string;
  onImageSelect: (dataUrl: string, fileName: string, file?: File) => void;
  onClear: () => void;
  error?: string | null;
  onError?: (message: string) => void;
  allowSamplePresets?: boolean;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

const SAMPLE_LEAVES = [
  {
    label: 'Healthy Leaf',
    url: '/images/leaf-healthy.svg',
    fileName: 'sample-healthy-leaf.svg',
  },
  {
    label: 'Powdery Mildew',
    url: '/images/leaf-powdery-mildew.svg',
    fileName: 'sample-powdery-mildew.svg',
  },
  {
    label: 'Downy Mildew',
    url: '/images/leaf-downy-mildew.svg',
    fileName: 'sample-downy-mildew.svg',
  },
  {
    label: 'Anthracnose',
    url: '/images/leaf-anthracnose.svg',
    fileName: 'sample-anthracnose-spot.svg',
  },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  fileName,
  onImageSelect,
  onClear,
  error,
  onError,
  allowSamplePresets = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dragging, setDragging] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const validateAndLoadFile = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      onError?.('Unsupported file format. Please upload a JPG, JPEG, or PNG image.');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      onError?.('Image exceeds 10 MB limit. Please select a smaller photograph.');
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      onImageSelect(dataUrl, file.name, file);
    } catch {
      onError?.('Could not read the selected image file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void validateAndLoadFile(file);
  };

  const openCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Live camera access is unavailable in this browser. Please browse or drop an image file.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      setCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 60);
    } catch {
      setCameraError(
        'Camera permission was denied or no camera device was found. You can still upload a leaf photo from your device.'
      );
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  const captureFromCamera = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onImageSelect(dataUrl, `camera-leaf-${Date.now()}.jpg`);
    closeCamera();
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void validateAndLoadFile(file);
          e.target.value = '';
        }}
      />

      {!imageUrl ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center transition-colors ${
            dragging
              ? 'border-[#22C55E] bg-emerald-50/70'
              : 'border-slate-300 bg-[#F7FAF7] hover:border-[#166534]/50'
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100/80 text-[#166534]">
            <UploadCloud className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-[#17251B]">
            Drop your melon leaf image here
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
            Supported formats: <span className="font-semibold text-[#17251B]">JPG, JPEG, PNG</span> (max 10 MB)
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#14532D] transition-colors"
            >
              <UploadCloud className="h-4 w-4" />
              Browse Files
            </button>
            <button
              type="button"
              onClick={openCamera}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#17251B] hover:bg-slate-50 transition-colors"
            >
              <Camera className="h-4 w-4 text-[#166534]" />
              Use Camera
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="relative flex max-h-80 items-center justify-center bg-slate-950/90">
            <img
              src={imageUrl}
              alt="Uploaded melon leaf preview"
              className="max-h-80 w-full object-contain"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
            <p className="truncate text-xs font-medium text-[#64748B]">
              Selected: <span className="font-semibold text-[#17251B]">{fileName || 'Leaf photo'}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#17251B] hover:bg-slate-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Replace
              </button>
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-[#DC2626] hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {allowSamplePresets && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
            Quick Demo Leaf Samples (for instant testing)
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SAMPLE_LEAVES.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => onImageSelect(sample.url, sample.fileName)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-[#F7FAF7] px-2.5 py-1.5 text-xs font-medium text-[#17251B] hover:border-[#166534] hover:bg-emerald-50"
              >
                <img
                  src={sample.url}
                  alt={sample.label}
                  className="h-5 w-5 rounded object-cover"
                />
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {(error || cameraError) && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-medium text-[#DC2626]">
          {error || cameraError}
        </p>
      )}

      {cameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h4 className="text-sm font-bold text-[#17251B]">Capture Melon Leaf Photo</h4>
              <button
                type="button"
                onClick={closeCamera}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-black">
              <video ref={videoRef} autoPlay playsInline className="aspect-video w-full object-cover" />
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-3">
              <button
                type="button"
                onClick={closeCamera}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#17251B]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={captureFromCamera}
                className="inline-flex items-center gap-2 rounded-xl bg-[#166534] px-4 py-2 text-xs font-semibold text-white hover:bg-[#14532D]"
              >
                <Camera className="h-4 w-4" />
                Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
