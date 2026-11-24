import type { Language } from '../types';
import { apiRequest } from './api';

export interface TranscriptionResult {
  text: string;
  language: Language;
  isDemoMode: boolean;
  engineLabel: string;
}

const DEMO_VOICE_SAMPLES: Record<Language, string[]> = {
  en: [
    'Why are white powdery spots appearing on my lower melon leaves?',
    'What preventive steps should I take before the rain this week?',
    'How can I tell powdery mildew apart from downy mildew?',
  ],
  ur: [
    'میرے خربوزے کے نچلے پتوں پر سفید پاؤڈر جیسے دھبے کیوں آ رہے ہیں؟',
    'اس ہفتے متوقع بارش سے پہلے فصل کو بچانے کے لیے کیا احتیاط کروں؟',
    'پتوں پر پیلے دھبوں کا موسمی نمی سے کیا تعلق ہے؟',
  ],
};

let demoSampleCursor = 0;

/**
 * Speech-to-text service prepared for FastAPI + Faster-Whisper backend.
 * When backend is unavailable, explicitly returns a clearly labeled demo phrase
 * so the user can test and edit the transcription UI honestly without claiming live STT.
 */
export const speechService = {
  async transcribeAudio(
    audioBlob: Blob | null,
    language: Language
  ): Promise<TranscriptionResult> {
    if (audioBlob) {
      try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voice-query.webm');
        formData.append('language', language);
        const live = await apiRequest<{ text: string; language: Language }>(
          '/api/speech/transcribe',
          { method: 'POST', body: formData },
          2500
        );
        return {
          text: live.text,
          language: live.language,
          isDemoMode: false,
          engineLabel: 'Faster-Whisper Backend',
        };
      } catch {
        // Fallback to honest demo mode below
      }
    }

    await new Promise((r) => setTimeout(r, 700));
    const list = DEMO_VOICE_SAMPLES[language];
    const sample = list[demoSampleCursor % list.length];
    demoSampleCursor += 1;

    return {
      text: sample,
      language,
      isDemoMode: true,
      engineLabel: 'Demo Mode (Faster-Whisper offline — sample editable prompt inserted)',
    };
  },
};
