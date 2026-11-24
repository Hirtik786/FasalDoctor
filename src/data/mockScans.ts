import type { DiseaseCode, DiseaseProfile, DiseaseScan } from '../types';

export const DISEASE_PROFILES: Record<DiseaseCode, DiseaseProfile> = {
  'Healthy Leaf': {
    code: 'Healthy Leaf',
    name: {
      en: 'Healthy Leaf',
      ur: 'صحت مند پتا',
    },
    status: 'Healthy',
    severity: 'healthy',
    description: {
      en: 'The scanned leaf appears visually uniform in green pigmentation with no clear signs of powdery spots, angular chlorosis, or necrotic lesions in this demonstration check.',
      ur: 'اس ڈیمو تجزیے میں پتا سبز اور صحت مند دکھائی دیتا ہے اور اس پر سفوفی دھبوں یا جھلساؤ کی واضح علامات نظر نہیں آتیں۔',
    },
    symptoms: {
      en: [
        'Even green leaf blade color without yellowing patches',
        'Intact leaf margins and clear venation',
        'No visible white powdery residue or dark sunken lesions',
      ],
      ur: [
        'پتے کی سطح پر یکساں سبز رنگ اور کوئی پیلا پن نہیں',
        'پتے کے کنارے سلامت اور رگیں واضح ہیں',
        'سفید پاؤڈر یا گہرے بھورے دھبے موجود نہیں',
      ],
    },
    prevention: {
      en: [
        'Maintain drip or furrow irrigation early in the morning to keep foliage dry overnight',
        'Ensure adequate plant spacing for good airflow across melon vines',
        'Inspect undersides of lower leaves twice a week during humid periods',
      ],
      ur: [
        'صبح سویرے آبپاشی کریں تاکہ رات تک پتے خشک رہیں',
        'بیلوں کے درمیان ہوا کے گزر کے لیے مناسب فاصلہ برقرار رکھیں',
        'نمی والے دنوں میں ہفتے میں دو بار نچلے پتوں کا معائنہ کریں',
      ],
    },
    treatment: {
      en: [
        'No disease treatment is indicated by this demonstration check.',
        'Continue balanced fertilization and regular field monitoring.',
      ],
      ur: [
        'اس ڈیمو جانچ کے مطابق کسی خاص علاج کی ضرورت نہیں ہے۔',
        'متوازن کھاد اور فصل کی باقاعدہ نگرانی جاری رکھیں۔',
      ],
    },
    nextSteps: {
      en: [
        'Keep monitoring new growth and check local weather humidity alerts',
        'Save this scan as a healthy baseline in your scan history',
      ],
      ur: [
        'نئی کونپلوں کا معائنہ جاری رکھیں اور موسمی نمی کے الرٹ دیکھیں',
        'اس اسکین کو صحت مند ریکارڈ کے طور پر محفوظ رکھیں',
      ],
    },
  },
  'Powdery Mildew': {
    code: 'Powdery Mildew',
    name: {
      en: 'Powdery Mildew',
      ur: 'سفوفی پھپھوندی (پاؤڈری ملڈیو)',
    },
    status: 'Attention Needed',
    severity: 'moderate',
    description: {
      en: 'Possible Powdery Mildew pattern detected (demo output). This fungal condition typically appears as white, talcum-like powdery spots on upper or lower melon leaf surfaces and can reduce photosynthesis if unmanaged.',
      ur: 'ممکنہ سفوفی پھپھوندی کی علامات ظاہر ہوئی ہیں (ڈیمو نتیجہ)۔ یہ فنگس پتوں کی سطح پر سفید پاؤڈر جیسے دھبوں کی شکل میں نمودار ہوتی ہے اور بروقت توجہ نہ دی جائے تو پیداوار متاثر ہو سکتی ہے۔',
    },
    symptoms: {
      en: [
        'Circular white or grayish powdery patches on upper leaf surfaces',
        'Gradual yellowing and drying of heavily coated older leaves',
        'Premature senescence exposing developing melons to sunscald',
      ],
      ur: [
        'پتوں کی اوپری سطح پر سفید یا سرمئی پاؤڈر جیسے گول دھبے',
        'پرانے پتوں کا بتدریج پیلا پڑ کر سوکھ جانا',
        'پتوں کے گرنے سے پھل کا دھوپ سے جھلسنے کا خطرہ',
      ],
    },
    prevention: {
      en: [
        'Remove and dispose of severely infected older leaves away from the field',
        'Avoid excessive nitrogen fertilization that creates overly dense foliage',
        'Select tolerant melon cultivars and rotate away from cucurbits next season',
      ],
      ur: [
        'شدید متاثرہ پرانے پتوں کو احتیاط سے توڑ کر کھیت سے دور تلف کریں',
        'زیادہ نائٹروجن کھاد سے گریز کریں تاکہ بیلیں بہت زیادہ گھنی نہ ہوں',
        'مزاحمتی اقسام کا انتخاب کریں اور اگلے موسم میں فصلوں کا ادل بدل کریں',
      ],
    },
    treatment: {
      en: [
        'Guidance only — verify with a local agronomist or extension officer before spraying.',
        'Wettable sulfur or potassium bicarbonate sprays are commonly evaluated in early stages (avoid spraying in extreme midday heat).',
        'Ensure thorough coverage on both upper and lower leaf surfaces per label instructions.',
      ],
      ur: [
        'صرف رہنمائی کے لیے — کسی بھی سپرے سے پہلے مقامی زرعی ماہر سے تصدیق ضرور کریں۔',
        'ابتدائی مرحلے میں زرعی ماہر کے مشورے سے موزوں پھپھوندی کش (مثلاً سلفر یا منظور شدہ محلول) کا جائزہ لیا جاتا ہے۔',
        'انتہائی تیز دھوپ میں سپرے سے گریز کریں اور لیبل کی ہدایات پر عمل کریں۔',
      ],
    },
    nextSteps: {
      en: [
        'Inspect neighboring melon vines within 3–5 meters for early white specks',
        'Consult an agricultural expert independently if spread accelerates',
      ],
      ur: [
        'قریبی بیلوں کا معائنہ کریں تاکہ ابتدائی پھیلاؤ کا اندازہ ہو سکے',
        'اگر پھیلاؤ تیز ہو تو علیحدہ سے زرعی ماہر سے مشورہ کریں',
      ],
    },
  },
  'Downy Mildew': {
    code: 'Downy Mildew',
    name: {
      en: 'Downy Mildew',
      ur: 'روئیں دار پھپھوندی (ڈاؤنی ملڈیو)',
    },
    status: 'Action Recommended',
    severity: 'high',
    description: {
      en: 'Possible Downy Mildew pattern detected (demo output). Often favored by cool nights, heavy dew, and humid or rainy conditions, this oomycete pathogen causes angular yellow lesions bounded by leaf veins.',
      ur: 'ممکنہ ڈاؤنی ملڈیو کی علامات ظاہر ہوئی ہیں (ڈیمو نتیجہ)۔ یہ مرض عموماً شبنم، زیادہ نمی اور بارش کے موسم میں تیزی سے پھیلتا ہے اور پتوں کی رگوں کے درمیان زاویہ دار پیلے دھبے بناتا ہے۔',
    },
    symptoms: {
      en: [
        'Angular yellow to pale-green spots restricted by leaf veins',
        'Purplish-gray fuzzy growth visible on the underside of leaves in morning dew',
        'Lesions turning brown and necrotic, causing rapid leaf collapse',
      ],
      ur: [
        'پتوں کی رگوں تک محدود زاویہ دار پیلے یا ہلکے سبز دھبے',
        'صبح کی نمی میں پتے کے نچلے حصے پر ہلکی جامنی یا سرمئی تہہ',
        'دھبوں کا بھورا ہو کر خشک ہونا اور پتوں کا تیزی سے مرجھانا',
      ],
    },
    prevention: {
      en: [
        'Avoid overhead sprinkler irrigation; water early in the day at soil level',
        'Improve field drainage and prune dense lower runners to reduce humidity',
        'Monitor weather advisories closely when relative humidity exceeds 80%',
      ],
      ur: [
        'فوارے سے آبپاشی سے گریز کریں اور صبح کے وقت جڑوں کے قریب پانی دیں',
        'کھیت میں پانی کے نکاس کو بہتر بنائیں تاکہ نمی جمع نہ ہو',
        'جب ہوا میں نمی 80 فیصد سے بڑھے تو موسمی الرٹ پر کڑی نظر رکھیں',
      ],
    },
    treatment: {
      en: [
        'Guidance only — confirm diagnosis with an agricultural officer or plant clinic before applying chemicals.',
        'Targeted oomycete protectants (distinct from standard powdery mildew products) are typically recommended before heavy rain events.',
        'Rotate active ingredients according to local agricultural extension guidelines.',
      ],
      ur: [
        'صرف رہنمائی کے لیے — کیمیائی دوا کے استعمال سے پہلے زرعی ماہر یا پلانٹ کلینک سے تصدیق کروائیں۔',
        'بارش یا شدید نمی سے قبل ماہر کے مشورے سے مخصوص حفاظتی سپرے استعمال کیا جاتا ہے۔',
        'مقامی زرعی محکمے کی سفارشات کے مطابق ادویات کا ردوبدل کریں۔',
      ],
    },
    nextSteps: {
      en: [
        'Check undersides of 10–15 leaves across the field early tomorrow morning',
        'Review the Weather Advisory page for upcoming rain and humidity risk',
      ],
      ur: [
        'کل صبح سویرے کھیت کے مختلف حصوں سے 10 سے 15 پتوں کی نچلی سطح دیکھیں',
        'آنے والی بارش اور نمی کے خطرے کے لیے موسمی مشورہ صفحہ ملاحظہ کریں',
      ],
    },
  },
  Anthracnose: {
    code: 'Anthracnose',
    name: {
      en: 'Anthracnose',
      ur: 'اینتھراکنوز (پتوں اور پھل کے دھبے)',
    },
    status: 'Action Recommended',
    severity: 'high',
    description: {
      en: 'Possible Anthracnose pattern detected (demo output). Caused by Colletotrichum fungi, it spreads via rain splash and contaminated crop debris, producing dark brown circular to irregular lesions on leaves, stems, and fruits.',
      ur: 'ممکنہ اینتھراکنوز کی علامات ظاہر ہوئی ہیں (ڈیمو نتیجہ)۔ یہ فنگس بارش کے چھینٹوں اور پرانی باقیات سے پھیلتی ہے اور پتوں، تنوں اور پھل پر گہرے بھورے دھبے بناتی ہے۔',
    },
    symptoms: {
      en: [
        'Dark brown to black necrotic spots, sometimes with a faint yellow halo',
        'Shot-hole tearing as dry center tissue drops out of older lesions',
        'Sunken circular lesions on stems or maturing melon rinds in wet weather',
      ],
      ur: [
        'گہرے بھورے یا کالے دھبے جن کے گرد ہلکا پیلا حلقہ ہو سکتا ہے',
        'پرانے دھبوں کے درمیان سے خشک ٹشو کا جھڑ کر سوراخ بن جانا',
        'نمی میں تنوں اور پھل کی جلد پر دھنسے ہوئے گول داغ',
      ],
    },
    prevention: {
      en: [
        'Use certified disease-free melon seed and practice 2–3 year non-cucurbit rotation',
        'Stay out of fields when vines are wet to avoid mechanical spore transfer',
        'Plow under or remove infected crop residue after harvest',
      ],
      ur: [
        'تصدیق شدہ صحت مند بیج استعمال کریں اور فصلوں کا ادل بدل اپنائیں',
        'جب بیلیں گیلی ہوں تو کھیت میں کام کرنے سے گریز کریں تاکہ بیماری نہ پھیلے',
        'فصل کٹائی کے بعد بیمار پودوں کی باقیات کھیت سے صاف کر دیں',
      ],
    },
    treatment: {
      en: [
        'Guidance only — obtain local agronomic verification prior to treatment.',
        'Broad-spectrum protectant fungicides are commonly applied ahead of warm, wet forecasts per authorized local guidelines.',
        'Sanitize pruning tools and crates if harvesting nearby unaffected blocks.',
      ],
      ur: [
        'صرف رہنمائی کے لیے — علاج شروع کرنے سے پہلے مقامی زرعی ماہر سے مشورہ کریں۔',
        'گرم اور مرطوب موسم کی پیش گوئی سے پہلے منظور شدہ حفاظتی سپرے پر غور کیا جاتا ہے۔',
        'کٹاؤ اور چنائی کے اوزار صاف رکھیں تاکہ صحت مند حصے محفوظ رہیں۔',
      ],
    },
    nextSteps: {
      en: [
        'Inspect melon stems and developing fruits for sunken spots',
        'Avoid overhead watering and consider submitting photos to an agricultural expert',
      ],
      ur: [
        'میلن کے تنوں اور پھل کا بھی معائنہ کریں کہ کہیں دھنسے ہوئے داغ تو نہیں',
        'اوپر سے پانی دینے سے بچیں اور ضرورت ہو تو زرعی ماہر کو تصاویر بھیجیں',
      ],
    },
  },
};

export const initialMockScans: DiseaseScan[] = [
  {
    id: 'scan-1042',
    farmerId: 'farmer-1',
    farmerName: 'Ahmed Raza',
    imageUrl: '/images/leaf-powdery-mildew.svg',
    disease: 'Powdery Mildew',
    confidence: 88.4,
    status: 'Attention Needed',
    severity: 'moderate',
    scannedAt: '2026-11-23T09:15:00Z',
    location: 'Multan, Block A (South)',
    notes: 'Noticed light white dusting on lower honeydew leaves near irrigation channel.',
    isMockPrediction: true,
    savedToHistory: true,
  },
  {
    id: 'scan-1041',
    farmerId: 'farmer-1',
    farmerName: 'Ahmed Raza',
    imageUrl: '/images/leaf-healthy.svg',
    disease: 'Healthy Leaf',
    confidence: 94.2,
    status: 'Healthy',
    severity: 'healthy',
    scannedAt: '2026-11-21T16:40:00Z',
    location: 'Multan, Block B (North)',
    notes: 'Routine weekly check on upper canopy leaves.',
    isMockPrediction: true,
    savedToHistory: true,
  },
  {
    id: 'scan-1039',
    farmerId: 'farmer-1',
    farmerName: 'Ahmed Raza',
    imageUrl: '/images/leaf-downy-mildew.svg',
    disease: 'Downy Mildew',
    confidence: 84.7,
    status: 'Action Recommended',
    severity: 'high',
    scannedAt: '2026-11-18T07:50:00Z',
    location: 'Multan, Block C (East)',
    notes: 'Angular yellow patches observed after morning fog.',
    isMockPrediction: true,
    savedToHistory: true,
    sharedWithExpert: true,
  },
  {
    id: 'scan-1036',
    farmerId: 'farmer-1',
    farmerName: 'Ahmed Raza',
    imageUrl: '/images/leaf-anthracnose.svg',
    disease: 'Anthracnose',
    confidence: 81.9,
    status: 'Action Recommended',
    severity: 'high',
    scannedAt: '2026-11-14T11:20:00Z',
    location: 'Multan, Block A (West)',
    notes: 'Dark brown spots near leaf edges after light showers.',
    isMockPrediction: true,
    savedToHistory: true,
  },
  {
    id: 'scan-1032',
    farmerId: 'farmer-1',
    farmerName: 'Ahmed Raza',
    imageUrl: '/images/leaf-healthy.svg',
    disease: 'Healthy Leaf',
    confidence: 96.1,
    status: 'Healthy',
    severity: 'healthy',
    scannedAt: '2026-11-10T10:05:00Z',
    location: 'Multan, Block B',
    isMockPrediction: true,
    savedToHistory: true,
  },
  {
    id: 'scan-1028',
    farmerId: 'farmer-1',
    farmerName: 'Ahmed Raza',
    imageUrl: '/images/leaf-powdery-mildew.svg',
    disease: 'Powdery Mildew',
    confidence: 79.5,
    status: 'Attention Needed',
    severity: 'moderate',
    scannedAt: '2026-11-05T14:30:00Z',
    location: 'Multan, Block D',
    isMockPrediction: true,
    savedToHistory: true,
  },
];
