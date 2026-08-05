/**
 * إعدادات API للذكاء الاصطناعي الإسلامي
 * يستخدم OpenRouter للتفاعل مع نماذج الذكاء الاصطناعي
 * 
 * ⚠️ ملاحظة: يتم قراءة مفتاح API من متغير البيئة OPENROUTER_API_KEY
 */

// الحصول على مفتاح API من متغير البيئة أو استخدام قيمة فارغة كاحتياطي
const getApiKey = (): string => {
  // في الخادم (Nitro/Cloudflare Workers)
  if (typeof process !== 'undefined' && process.env?.OPENROUTER_API_KEY) {
    return process.env.OPENROUTER_API_KEY;
  }
  // في المتصفح - يتم توفيره من الخادم
  if (typeof window !== 'undefined') {
    return (window as unknown as Record<string, string>).__OPENROUTER_API_KEY__ || '';
  }
  return '';
};

export const API_CONFIG = {
  // مفتاح OpenRouter API - من متغير البيئة
  get OPENROUTER_API_KEY() { return getApiKey(); },
  
  // رابط API لـ OpenRouter
  API_URL: "https://openrouter.ai/api/v1/chat/completions",
  
  // النموذج الافتراضي - Gemini 2.0 Flash للسرعة والتكلفة
  MODEL: "google/gemini-2.0-flash-001",
  
  // النماذج المتاحة
  AVAILABLE_MODELS: [
    { id: "google/gemini-2.0-flash-001", name: "Gemini 2.0 Flash (سريع)" },
    { id: "google/gemini-2.5-flash-preview-05-20", name: "Gemini 2.5 Flash (معاينة)" },
    { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku (اقتصادي)" },
    { id: "openai/gpt-4o-mini", name: "GPT-4o Mini (موثوق)" },
  ] as const,
};

// إعدادات إضافية
export const AI_SETTINGS = {
  // درجة الإبداع (0.0 - 2.0)
  TEMPERATURE: 0.7,
  
  // الحد الأقصى للأtokens
  MAX_TOKENS: 2000,
  
  // وقت الاستجابة المتوقع بالثواني
  TIMEOUT: 30,
};

export type Model = typeof API_CONFIG.AVAILABLE_MODELS[number]["id"];
