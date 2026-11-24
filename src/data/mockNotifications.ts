import type { AppNotification } from '../types';

export const initialMockNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'farmer-1',
    role: 'farmer',
    type: 'scan',
    title: {
      en: 'Disease scan completed',
      ur: 'پتے کا اسکین مکمل ہو گیا',
    },
    message: {
      en: 'Block A scan flagged possible Powdery Mildew (88.4% demo confidence).',
      ur: 'بلاک A کے اسکین میں ممکنہ سفوفی پھپھوندی کی نشاندہی ہوئی ہے۔',
    },
    timestamp: '2026-11-23T09:16:00Z',
    read: false,
    link: '/farmer/scan-results/scan-1042',
  },
  {
    id: 'notif-2',
    userId: 'farmer-1',
    role: 'farmer',
    type: 'expert',
    title: {
      en: 'Expert responded to REQ-2026-014',
      ur: 'ماہر نے آپ کی درخواست کا جواب دیا',
    },
    message: {
      en: 'Dr. Ahmed Khan shared preventive guidance for your Block C cantaloupe vines.',
      ur: 'ڈاکٹر احمد خان نے بلاک C کے لیے احتیاطی ہدایات ارسال کی ہیں۔',
    },
    timestamp: '2026-11-20T14:21:00Z',
    read: false,
    link: '/farmer/consultation/REQ-2026-014',
  },
  {
    id: 'notif-3',
    userId: 'farmer-1',
    role: 'farmer',
    type: 'weather',
    title: {
      en: 'New weather advisory available',
      ur: 'نیا موسمی مشورہ دستیاب ہے',
    },
    message: {
      en: 'Humidity up to 84% and mid-week showers expected in Multan (Demo Advisory).',
      ur: 'ملتان میں نمی 84% تک بڑھنے اور بارش کا امکان ہے۔',
    },
    timestamp: '2026-11-24T08:05:00Z',
    read: false,
    link: '/farmer/weather',
  },
  {
    id: 'notif-4',
    userId: 'farmer-1',
    role: 'farmer',
    type: 'consultation',
    title: {
      en: 'Consultation request assigned',
      ur: 'مشاورت کی درخواست ماہر کو تفویض کر دی گئی',
    },
    message: {
      en: 'REQ-2026-019 has been assigned to Dr. Sana Malik.',
      ur: 'درخواست REQ-2026-019 ڈاکٹر ثناء ملک کو بھیج دی گئی ہے۔',
    },
    timestamp: '2026-11-23T15:02:00Z',
    read: true,
    link: '/farmer/consultation/REQ-2026-019',
  },
  {
    id: 'notif-exp-1',
    userId: 'expert-1',
    role: 'expert',
    type: 'consultation',
    title: {
      en: 'New high-priority request (REQ-2026-021)',
      ur: 'نئی ہنگامی مشاورت کی درخواست',
    },
    message: {
      en: 'Bilal Hussain in Bahawalpur reported post-rain dark brown leaf lesions.',
      ur: 'بہاولپور سے بلال حسین نے بارش کے بعد پتوں پر بھورے دھبوں کی اطلاع دی ہے۔',
    },
    timestamp: '2026-11-24T07:32:00Z',
    read: false,
    link: '/expert/requests/REQ-2026-021',
  },
  {
    id: 'notif-exp-2',
    userId: 'expert-1',
    role: 'expert',
    type: 'consultation',
    title: {
      en: 'Case REQ-2026-019 awaiting review',
      ur: 'کیس REQ-2026-019 جائزے کا منتظر ہے',
    },
    message: {
      en: 'Ahmed Raza uploaded Block A honeydew leaf images for consultation.',
      ur: 'احمد رضا نے بلاک A کے پتوں کی تصاویر ارسال کی ہیں۔',
    },
    timestamp: '2026-11-23T11:15:00Z',
    read: false,
    link: '/expert/requests/REQ-2026-019',
  },
];
