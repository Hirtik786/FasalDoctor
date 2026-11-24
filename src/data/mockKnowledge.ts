import type { KnowledgeArticle } from '../types';

export const mockKnowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'art-1',
    slug: 'recognizing-powdery-mildew-on-melon',
    category: 'Melon Diseases',
    title: {
      en: 'Recognizing Powdery Mildew Early on Melon Leaves',
      ur: 'خربوزے کے پتوں پر سفوفی پھپھوندی کی ابتدائی شناخت',
    },
    summary: {
      en: 'Learn how to spot early white talcum-like patches on shaded lower leaves before they reduce vine vigor.',
      ur: 'جانیں کہ سایہ دار نچلے پتوں پر سفید پاؤڈر جیسے دھبوں کو پھیلنے سے پہلے کیسے پہچانا جائے۔',
    },
    content: {
      en: [
        'Demonstration educational guide: Always confirm local treatment protocols with certified agricultural extension services.',
        'Powdery mildew is one of the most common foliar issues in melon cultivation. Unlike downy mildew, it can develop even in relatively dry air when canopies are shaded and dense.',
        'Look first at older, shaded leaves near the crown of the vine. Early signs appear as tiny circular white powdery spots on either side of the leaf.',
        'Good airflow, balanced nitrogen levels, and removing severely affected older leaves help slow disease spread.',
      ],
      ur: [
        'ڈیمو تعلیمی رہنمائی: کسی بھی دوا کے استعمال سے پہلے مقامی زرعی محکمے سے تصدیق ضرور کریں۔',
        'سفوفی پھپھوندی خربوزے کی فصل کا ایک عام مرض ہے۔ یہ گھنی بیلوں اور سایہ دار پتوں پر نسبتاً خشک موسم میں بھی نمودار ہو سکتی ہے۔',
        'سب سے پہلے پودے کے نچلے اور پرانے پتوں کا جائزہ لیں جہاں سفید پاؤڈر جیسے گول دھبے نظر آتے ہیں۔',
        'بیلوں میں مناسب فاصلہ، متوازن کھاد اور متاثرہ پتوں کی صفائی اس کے پھیلاؤ کو کم کرتی ہے۔',
      ],
    },
    readTimeMinutes: 4,
    imageUrl: '/images/leaf-powdery-mildew.svg',
    publishedAt: '2026-11-12',
    isDemoContent: true,
  },
  {
    id: 'art-2',
    slug: 'downy-mildew-vs-powdery-mildew',
    category: 'Symptoms',
    title: {
      en: 'Downy Mildew vs. Powdery Mildew: Key Visual Differences',
      ur: 'ڈاؤنی ملڈیو اور پاؤڈری ملڈیو میں واضح بصری فرق',
    },
    summary: {
      en: 'Compare angular vein-restricted yellow patches against circular white powdery colonies for better field scouting.',
      ur: 'زاویہ دار پیلے دھبوں اور سفید پاؤڈر نما تہہ کے درمیان فرق سمجھیں تاکہ کھیت کا معائنہ آسان ہو۔',
    },
    content: {
      en: [
        'Demonstration educational guide for FYP-I field awareness.',
        'Powdery mildew produces bright white, flour-like dust on top of the leaf blade.',
        'Downy mildew produces angular yellow to light-green patches bounded strictly by leaf veins on the upper surface, with purplish-gray fuzz underneath during morning dew.',
        'Correctly distinguishing these two conditions matters because different management products target oomycetes versus true fungi.',
      ],
      ur: [
        'ایف وائی پی ڈیمو آگاہی کے لیے تعلیمی مضمون۔',
        'پاؤڈری ملڈیو میں پتے کے اوپر سفید آٹے جیسا سفوف بنتا ہے۔',
        'ڈاؤنی ملڈیو میں پتے کی رگوں کے درمیان زاویہ دار پیلے دھبے بنتے ہیں اور صبح کے وقت نچلی سطح پر سرمئی روئیں نظر آتے ہیں۔',
        'دونوں میں فرق پہچاننا ضروری ہے کیونکہ ان کے تدارک کا طریقہ کار مختلف ہوتا ہے۔',
      ],
    },
    readTimeMinutes: 5,
    imageUrl: '/images/leaf-downy-mildew.svg',
    publishedAt: '2026-11-10',
    isDemoContent: true,
  },
  {
    id: 'art-3',
    slug: 'morning-irrigation-and-leaf-wetness',
    category: 'Weather and Farming',
    title: {
      en: 'Why Morning Irrigation Reduces Fungal Risk in Humid Weather',
      ur: 'نمی والے موسم میں صبح کی آبپاشی پھپھوندی کا خطرہ کیوں کم کرتی ہے',
    },
    summary: {
      en: 'Understand how leaf wetness duration drives spore germination and how simple scheduling adjustments protect your crop.',
      ur: 'سمجھیں کہ پتوں پر دیر تک نمی رہنے سے بیماریاں کیسے بڑھتی ہیں اور آبپاشی کا وقت بدل کر فصل کیسے بچائی جائے۔',
    },
    content: {
      en: [
        'Demonstration educational guide.',
        'Many melon leaf pathogens require several continuous hours of free moisture on the leaf surface to germinate and infect tissue.',
        'Evening watering keeps leaves wet all night, whereas watering between 6:00 AM and 9:00 AM allows sunlight and morning breeze to dry foliage rapidly.',
        'Pair morning watering with furrow or drip delivery to avoid splashing soil-borne spores onto lower leaves.',
      ],
      ur: [
        'ڈیمو تعلیمی رہنمائی۔',
        'پتوں پر کئی گھنٹے مسلسل پانی یا شبنم رہنے سے پھپھوندی کے جراثیم آسانی سے پھیلتے ہیں۔',
        'شام کے وقت پانی دینے سے پتے رات بھر گیلے رہتے ہیں، جبکہ صبح 6 سے 9 بجے آبپاشی کرنے سے دھوپ اور ہوا پتوں کو جلد خشک کر دیتی ہے۔',
        'ڈرپ یا کھیلوں کے ذریعے پانی دیں تاکہ مٹی کے چھینٹے نچلے پتوں پر نہ پڑیں۔',
      ],
    },
    readTimeMinutes: 3,
    imageUrl: '/images/melon-farm-hero.svg',
    publishedAt: '2026-11-06',
    isDemoContent: true,
  },
  {
    id: 'art-4',
    slug: 'preventing-anthracnose-in-rainy-seasons',
    category: 'Prevention',
    title: {
      en: 'Preventing Anthracnose After Rain Showers',
      ur: 'بارش کے بعد اینتھراکنوز سے بچاؤ کے عملی اقدامات',
    },
    summary: {
      en: 'Practical sanitation, crop rotation, and field-entry habits that limit dark necrotic leaf and fruit lesions.',
      ur: 'بارش کے بعد کھیت کی صفائی، فصلوں کے ادل بدل اور احتیاطی عادات جو پتوں اور پھل کو داغوں سے بچاتی ہیں۔',
    },
    content: {
      en: [
        'Demonstration educational guide.',
        'Anthracnose spores spread easily through rain splash and by workers brushing against wet vines.',
        'Wait until vines are completely dry before weeding or harvesting, and promptly remove infected plant debris after the season ends.',
      ],
      ur: [
        'ڈیمو تعلیمی رہنمائی۔',
        'اینتھراکنوز بارش کے چھینٹوں اور گیلی بیلوں کو چھونے سے تیزی سے پھیلتا ہے۔',
        'جب بیلیں مکمل خشک ہوں تب ہی کھیت میں کام کریں اور فصل کے بعد بیمار باقیات تلف کر دیں۔',
      ],
    },
    readTimeMinutes: 4,
    imageUrl: '/images/leaf-anthracnose.svg',
    publishedAt: '2026-11-02',
    isDemoContent: true,
  },
  {
    id: 'art-5',
    slug: 'capturing-clear-leaf-photos-for-ai',
    category: 'General Agricultural Guidance',
    title: {
      en: 'How to Capture Clear Melon Leaf Photos for Better Screening',
      ur: 'بہتر تجزیے کے لیے خربوزے کے پتوں کی واضح تصویر لینے کا طریقہ',
    },
    summary: {
      en: 'Simple smartphone photography tips—natural daylight, flat framing, and steady focus—for clearer results.',
      ur: 'موبائل فون سے قدرتی روشنی میں صاف اور واضح تصویر لینے کے آسان اصول۔',
    },
    content: {
      en: [
        'Demonstration educational guide.',
        'Hold your phone 15–25 cm above a single representative leaf in diffused daylight without harsh shadows.',
        'Ensure affected spots are in sharp focus and avoid cluttered soil backgrounds when possible.',
      ],
      ur: [
        'ڈیمو تعلیمی رہنمائی۔',
        'دن کی قدرتی روشنی میں پتے سے تقریباً 15 سے 25 سینٹی میٹر اوپر کیمرہ رکھیں اور تیز سائے سے بچیں۔',
        'متاثرہ دھبوں پر فوکس صاف رکھیں تاکہ تصویر دھندلی نہ ہو۔',
      ],
    },
    readTimeMinutes: 3,
    imageUrl: '/images/leaf-healthy.svg',
    publishedAt: '2026-10-28',
    isDemoContent: true,
  },
  {
    id: 'art-6',
    slug: 'balanced-nutrition-healthy-melon-vines',
    category: 'Crop Care',
    title: {
      en: 'Balanced Nutrition & Canopy Care for Resilient Melon Vines',
      ur: 'مضبوط اور صحت مند خربوزے کی بیلوں کے لیے متوازن خوراک اور دیکھ بھال',
    },
    summary: {
      en: 'How potassium, calcium, and proper vine spacing strengthen leaf tissue against environmental stress.',
      ur: 'پوٹاشیم، کیلشیم اور مناسب فاصلے کے ذریعے پودوں کو موسمی دباؤ سے محفوظ بنانے کے طریقے۔',
    },
    content: {
      en: [
        'Demonstration educational guide.',
        'Over-applying nitrogen causes soft, succulent foliage that attracts pests and fungal pathogens.',
        'Balanced potassium supports fruit sweetness and stronger cell walls, helping melon plants withstand heat and humidity shifts.',
      ],
      ur: [
        'ڈیمو تعلیمی رہنمائی۔',
        'ضرورت سے زیادہ نائٹروجن پتوں کو نرم اور بیماریاں قبول کرنے والا بنا دیتی ہے۔',
        'متوازن پوٹاشیم پھل کی مٹھاس بڑھاتا ہے اور پودے کو موسمی دباؤ برداشت کرنے کی طاقت دیتا ہے۔',
      ],
    },
    readTimeMinutes: 4,
    imageUrl: '/images/melon-farm-hero.svg',
    publishedAt: '2026-10-22',
    isDemoContent: true,
  },
];
