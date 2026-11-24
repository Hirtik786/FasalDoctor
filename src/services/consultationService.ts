import { initialMockConsultations } from '../data/mockConsultations';
import { mockExperts } from '../data/mockExperts';
import type {
  ConsultationMessage,
  ConsultationPriority,
  ConsultationRequest,
  ConsultationStatus,
  Language,
  UserRole,
} from '../types';
import { apiRequest } from './api';

const CONSULTATIONS_KEY = 'fd_consultations_v1';

function loadConsultations(): ConsultationRequest[] {
  try {
    const raw = localStorage.getItem(CONSULTATIONS_KEY);
    if (!raw) {
      localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(initialMockConsultations));
      return initialMockConsultations;
    }
    const parsed = JSON.parse(raw) as ConsultationRequest[];
    return parsed.length ? parsed : initialMockConsultations;
  } catch {
    return initialMockConsultations;
  }
}

function saveConsultations(items: ConsultationRequest[]): void {
  localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(items));
}

export interface CreateConsultationPayload {
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  farmerPhone: string;
  subject: string;
  description: string;
  cropType: string;
  category: ConsultationRequest['category'];
  preferredLanguage: Language;
  images: string[];
  expertId?: string;
  priority?: ConsultationPriority;
  linkedScanId?: string;
  linkedScanSummary?: string;
}

export const consultationService = {
  async createRequest(payload: CreateConsultationPayload): Promise<ConsultationRequest> {
    try {
      return await apiRequest<ConsultationRequest>('/api/consultations', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      await new Promise((r) => setTimeout(r, 450));
      const all = loadConsultations();
      const chosenExpert = payload.expertId
        ? mockExperts.find((e) => e.id === payload.expertId)
        : undefined;
      const now = new Date().toISOString();
      const reqNumber = String(22 + all.length).padStart(3, '0');
      const newReq: ConsultationRequest = {
        id: `REQ-2026-${reqNumber}`,
        farmerId: payload.farmerId,
        farmerName: payload.farmerName,
        farmerLocation: payload.farmerLocation,
        farmerPhone: payload.farmerPhone,
        subject: payload.subject.trim(),
        description: payload.description.trim(),
        cropType: payload.cropType || 'Melon',
        category: payload.category,
        preferredLanguage: payload.preferredLanguage,
        images: payload.images.length ? payload.images : ['/images/leaf-healthy.svg'],
        expertId: chosenExpert?.id,
        expertName: chosenExpert?.name,
        status: chosenExpert ? 'Assigned' : 'Pending',
        priority: payload.priority ?? 'Medium',
        createdAt: now,
        updatedAt: now,
        linkedScanId: payload.linkedScanId,
        linkedScanSummary: payload.linkedScanSummary,
        weatherContext: 'Local humidity & field advisory context attached',
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderId: payload.farmerId,
            senderName: payload.farmerName,
            senderRole: 'farmer',
            language: payload.preferredLanguage,
            text: payload.description.trim(),
            timestamp: now,
          },
        ],
      };
      saveConsultations([newReq, ...all]);
      return newReq;
    }
  },

  async getFarmerRequests(farmerId: string): Promise<ConsultationRequest[]> {
    try {
      return await apiRequest<ConsultationRequest[]>(
        `/api/consultations/farmer/${farmerId}`,
        { method: 'GET' },
        1000
      );
    } catch {
      const all = loadConsultations();
      const mine = all.filter((c) => c.farmerId === farmerId);
      return mine.length ? mine : all.filter((c) => c.farmerId === 'farmer-1');
    }
  },

  async getExpertRequests(): Promise<ConsultationRequest[]> {
    try {
      return await apiRequest<ConsultationRequest[]>('/api/consultations/expert', {
        method: 'GET',
      });
    } catch {
      return loadConsultations();
    }
  },

  async getRequestById(id: string): Promise<ConsultationRequest | undefined> {
    const all = loadConsultations();
    return all.find((c) => c.id === id);
  },

  async sendMessage(params: {
    requestId: string;
    senderId: string;
    senderName: string;
    senderRole: UserRole;
    language: Language;
    text: string;
    preventiveSuggestions?: string[];
    treatmentGuidance?: string[];
    newStatus?: ConsultationStatus;
    assignExpertId?: string;
    assignExpertName?: string;
  }): Promise<ConsultationRequest> {
    await new Promise((r) => setTimeout(r, 350));
    const all = loadConsultations();
    const now = new Date().toISOString();
    const nextMsg: ConsultationMessage = {
      id: `msg-${Date.now()}`,
      senderId: params.senderId,
      senderName: params.senderName,
      senderRole: params.senderRole,
      language: params.language,
      text: params.text.trim(),
      preventiveSuggestions: params.preventiveSuggestions,
      treatmentGuidance: params.treatmentGuidance,
      timestamp: now,
    };

    const updated = all.map((req) => {
      if (req.id !== params.requestId) return req;
      const defaultStatus: ConsultationStatus =
        params.senderRole === 'expert' ? 'Responded' : req.status;
      return {
        ...req,
        expertId: params.assignExpertId ?? req.expertId,
        expertName: params.assignExpertName ?? req.expertName,
        status: params.newStatus ?? defaultStatus,
        updatedAt: now,
        messages: [...req.messages, nextMsg],
      };
    });

    saveConsultations(updated);
    const target = updated.find((c) => c.id === params.requestId);
    if (!target) throw new Error('Consultation request not found');
    return target;
  },

  async updateStatus(
    requestId: string,
    status: ConsultationStatus,
    expertId?: string,
    expertName?: string
  ): Promise<ConsultationRequest> {
    await new Promise((r) => setTimeout(r, 250));
    const all = loadConsultations();
    const now = new Date().toISOString();
    const updated = all.map((req) => {
      if (req.id !== requestId) return req;
      return {
        ...req,
        status,
        expertId: expertId ?? req.expertId,
        expertName: expertName ?? req.expertName,
        updatedAt: now,
      };
    });
    saveConsultations(updated);
    const target = updated.find((c) => c.id === requestId);
    if (!target) throw new Error('Consultation request not found');
    return target;
  },
};
