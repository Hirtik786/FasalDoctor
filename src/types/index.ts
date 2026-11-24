export type Language = 'en' | 'ur';

export type UserRole = 'farmer' | 'expert';

export type DiseaseSeverity = 'healthy' | 'moderate' | 'high';

export type DiseaseCode =
  | 'Healthy Leaf'
  | 'Powdery Mildew'
  | 'Downy Mildew'
  | 'Anthracnose';

export type ConsultationStatus =
  | 'Pending'
  | 'Assigned'
  | 'In Progress'
  | 'Responded'
  | 'Closed';

export type ConsultationPriority = 'Low' | 'Medium' | 'High';

export interface BilingualText {
  en: string;
  ur: string;
}

export interface BilingualList {
  en: string[];
  ur: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  preferredLanguage: Language;
  location: string;
  avatarUrl?: string;
  createdAt: string;
  // Farmer specific
  farmName?: string;
  farmSizeAcres?: number;
  melonVariety?: string;
  // Expert specific
  specialization?: string;
  qualifications?: string;
  experienceYears?: number;
  languages?: string[];
  availability?: 'Available' | 'Busy' | 'Offline';
  bio?: string;
}

export interface DiseaseProfile {
  code: DiseaseCode;
  name: BilingualText;
  status: 'Healthy' | 'Attention Needed' | 'Action Recommended';
  severity: DiseaseSeverity;
  description: BilingualText;
  symptoms: BilingualList;
  prevention: BilingualList;
  treatment: BilingualList;
  nextSteps: BilingualList;
}

export interface DiseaseScan {
  id: string;
  farmerId: string;
  farmerName: string;
  imageUrl: string;
  disease: DiseaseCode;
  confidence: number;
  status: 'Healthy' | 'Attention Needed' | 'Action Recommended';
  severity: DiseaseSeverity;
  scannedAt: string;
  location: string;
  notes?: string;
  isMockPrediction: boolean;
  savedToHistory: boolean;
  sharedWithExpert?: boolean;
}

export interface DailyForecast {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainfallMm: number;
  windKmh: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Humid' | 'Rain Showers' | 'Breezy';
  riskLevel: 'Low' | 'Moderate' | 'High';
}

export interface WeatherAdvisoryData {
  location: string;
  updatedAt: string;
  isMockData: boolean;
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    rainfallMm: number;
    windSpeedKmh: number;
    condition: string;
    uvIndex: number;
  };
  advisory: {
    riskLevel: 'Low' | 'Moderate' | 'High';
    headline: BilingualText;
    message: BilingualText;
    environmentalFactors: BilingualList;
    preventiveActions: BilingualList;
  };
  forecast: DailyForecast[];
}

export interface ExpertProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  languages: string[];
  availability: 'Available' | 'Busy' | 'Offline';
  location: string;
  bio: BilingualText;
  casesHandled: number;
  responseTimeLabel: string;
  isDemoProfile: boolean;
}

export interface ConsultationMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  language: Language;
  text: string;
  preventiveSuggestions?: string[];
  treatmentGuidance?: string[];
  timestamp: string;
}

export interface ConsultationRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  farmerPhone: string;
  subject: string;
  description: string;
  cropType: string;
  category:
    | 'Leaf Disease'
    | 'Pest Damage'
    | 'Soil & Irrigation'
    | 'Weather Stress'
    | 'General Crop Care';
  preferredLanguage: Language;
  images: string[];
  expertId?: string;
  expertName?: string;
  status: ConsultationStatus;
  priority: ConsultationPriority;
  createdAt: string;
  updatedAt: string;
  linkedScanId?: string;
  linkedScanSummary?: string;
  weatherContext?: string;
  messages: ConsultationMessage[];
}

export interface KnowledgeArticle {
  id: string;
  slug: string;
  category:
    | 'Melon Diseases'
    | 'Symptoms'
    | 'Prevention'
    | 'Crop Care'
    | 'Weather and Farming'
    | 'General Agricultural Guidance';
  title: BilingualText;
  summary: BilingualText;
  content: BilingualList;
  readTimeMinutes: number;
  imageUrl: string;
  publishedAt: string;
  isDemoContent: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  role: UserRole;
  type: 'scan' | 'expert' | 'weather' | 'consultation';
  title: BilingualText;
  message: BilingualText;
  timestamp: string;
  read: boolean;
  link: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  language: Language;
  timestamp: string;
  viaVoice?: boolean;
  isDemoResponse?: boolean;
}
