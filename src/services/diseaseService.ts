import { DISEASE_PROFILES, initialMockScans } from '../data/mockScans';
import type { DiseaseCode, DiseaseScan } from '../types';
import { apiRequest } from './api';

const SCANS_STORAGE_KEY = 'fd_disease_scans_v1';

function loadScans(): DiseaseScan[] {
  try {
    const raw = localStorage.getItem(SCANS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(initialMockScans));
      return initialMockScans;
    }
    const parsed = JSON.parse(raw) as DiseaseScan[];
    return parsed.length ? parsed : initialMockScans;
  } catch {
    return initialMockScans;
  }
}

function persistScans(scans: DiseaseScan[]): void {
  try {
    localStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(scans));
  } catch {
    // Handle quota exceeded gracefully if large dataURLs were added
    const trimmed = scans.slice(0, 12);
    localStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(trimmed));
  }
}

function inferDemoDisease(fileName: string): { disease: DiseaseCode; confidence: number } {
  const lower = fileName.toLowerCase();
  if (lower.includes('powder') || lower.includes('white')) {
    return { disease: 'Powdery Mildew', confidence: 89.2 };
  }
  if (lower.includes('downy') || lower.includes('yellow')) {
    return { disease: 'Downy Mildew', confidence: 85.6 };
  }
  if (lower.includes('anthrac') || lower.includes('spot') || lower.includes('brown')) {
    return { disease: 'Anthracnose', confidence: 82.4 };
  }
  if (lower.includes('health') || lower.includes('clean')) {
    return { disease: 'Healthy Leaf', confidence: 93.8 };
  }

  const options: Array<{ disease: DiseaseCode; confidence: number }> = [
    { disease: 'Powdery Mildew', confidence: 87.6 },
    { disease: 'Downy Mildew', confidence: 83.4 },
    { disease: 'Healthy Leaf', confidence: 92.5 },
    { disease: 'Anthracnose', confidence: 81.8 },
  ];
  const existing = loadScans();
  return options[existing.length % options.length];
}

export const diseaseService = {
  async predictDisease(params: {
    imageDataUrl: string;
    fileName: string;
    file?: File;
    farmerId: string;
    farmerName: string;
    location: string;
    notes?: string;
  }): Promise<DiseaseScan> {
    // Attempt real FastAPI MobileNetV2 endpoint if available
    if (params.file) {
      try {
        const formData = new FormData();
        formData.append('file', params.file);
        formData.append('farmer_id', params.farmerId);
        const liveResult = await apiRequest<DiseaseScan>(
          '/api/disease/predict',
          { method: 'POST', body: formData },
          2000
        );
        const existing = loadScans();
        persistScans([liveResult, ...existing]);
        return liveResult;
      } catch {
        // Backend unavailable; proceed with clearly marked demonstration scan
      }
    }

    await new Promise((r) => setTimeout(r, 1700));
    const { disease, confidence } = inferDemoDisease(params.fileName);
    const profile = DISEASE_PROFILES[disease];

    const newScan: DiseaseScan = {
      id: `scan-${Date.now().toString().slice(-6)}`,
      farmerId: params.farmerId,
      farmerName: params.farmerName,
      imageUrl: params.imageDataUrl,
      disease,
      confidence,
      status: profile.status,
      severity: profile.severity,
      scannedAt: new Date().toISOString(),
      location: params.location || 'Multan, Punjab',
      notes: params.notes,
      isMockPrediction: true,
      savedToHistory: true,
    };

    const existing = loadScans();
    persistScans([newScan, ...existing]);
    return newScan;
  },

  async getScanHistory(farmerId?: string): Promise<DiseaseScan[]> {
    try {
      const data = await apiRequest<DiseaseScan[]>('/api/disease/history', { method: 'GET' }, 1000);
      return data;
    } catch {
      const scans = loadScans();
      if (!farmerId) return scans;
      // Show farmer's scans (or default demo scans for custom farmer logins)
      const filtered = scans.filter((s) => s.farmerId === farmerId);
      return filtered.length ? filtered : scans;
    }
  },

  async getScanById(scanId: string): Promise<DiseaseScan | undefined> {
    const scans = loadScans();
    return scans.find((s) => s.id === scanId);
  },

  async saveScanToHistory(scanId: string): Promise<DiseaseScan | undefined> {
    const scans = loadScans();
    const updated = scans.map((s) =>
      s.id === scanId ? { ...s, savedToHistory: true } : s
    );
    persistScans(updated);
    return updated.find((s) => s.id === scanId);
  },
};
