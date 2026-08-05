/**
 * مساعد إسلامي ذكي - مفتي ومرشد
 * يستخدم الذكاء الاصطناعي للإجابة على الأسئلة الشرعية
 */

import { API_CONFIG, AI_SETTINGS } from "./api-config";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface IslamicAnswer {
  answer: string;
  sources: Source[];
  relatedTopics?: string[];
}

export interface Source {
  type: "quran" | "hadith" | "scholar" | "general";
  text: string;
  reference: string;
}

// النظام بروبت للذكاء الاصطناعي الإسلامي
const SYSTEM_PROMPT = `أنت مفتي ومستشار إسلامي خبير وموثوق.

التزاماتك:
- أجب فقط من القرآن والسنة الصحيحة
- اذكر المصدر دائمًا (البخاري، مسلم، أبو داود، الترمذي، النسائي، ابن ماجه)
- إذا لم تكن تعرف الإجابة، قل "لا أعلم"
- لا تفتي في القضايا الفارغة دون ذكر الأقوال
- استخدم لغة عربية فصحى سليمة
- كن مختصرًا ومفيدًا
- أضف تنويه: "هذه الفتوى العلمية، يرجى الرجوع لأهل العلم"
- احترم جميع المذاهب الإسلامية (الحنفية، المالكية، الشافعية، الحنبلية)
- في المسائل الخلافية اذكر الأقوال المختلفة وأدلتها
- لا تكفر أحدًا ولا تبدّعه
- تجنب التدخل في السياسة الحزبية
- استخدم تنسيق Markdown خفيف`;

const CONNECTION_ERROR = "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى لاحقاً.";
const TIMEOUT_ERROR = "انتهت مهلة الاتصال. يرجى التحقق من اتصالك بالإنترنت.";
const RATE_LIMIT_ERROR = "تم تجاوز الحد المسموح من الطلبات. يرجى الانتظار قليلاً.";

/**
 * إرسال سؤال إسلامي للذكاء الاصطناعي
 */
export async function askIslamicQuestion(
  question: string,
  history: ChatMessage[] = []
): Promise<IslamicAnswer> {
  try {
    const response = await fetchWithTimeout(
      API_CONFIG.API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_CONFIG.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://ahlaam-alrooh.app",
          "X-Title": "أحلام الروح - Islamic App",
        },
        body: JSON.stringify({
          model: API_CONFIG.MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...history.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: question },
          ],
          temperature: AI_SETTINGS.TEMPERATURE,
          max_tokens: AI_SETTINGS.MAX_TOKENS,
        }),
      },
      AI_SETTINGS.TIMEOUT * 1000
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(RATE_LIMIT_ERROR);
      }
      throw new Error(`خطأ في الاتصال: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error("استجابة غير صالحة من الخادم");
    }

    const answerText = data.choices[0].message.content;
    
    // استخراج المصادر من النص
    const sources = extractSources(answerText);
    const relatedTopics = extractRelatedTopics(answerText);
    
    // إضافة تنويه شرعي إذا لم يكن موجوداً
    let finalAnswer = answerText;
    if (!answerText.includes("الرجوع لأهل العلم") && !answerText.includes("استفتاء")) {
      finalAnswer = answerText + "\n\n⚠️ هذه الفتوى العلمية، يرجى الرجوع لأهل العلم المختصين.";
    }

    return {
      answer: finalAnswer,
      sources,
      relatedTopics,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(TIMEOUT_ERROR);
      }
      throw new Error(`${CONNECTION_ERROR}\n${error.message}`);
    }
    throw new Error(CONNECTION_ERROR);
  }
}

/**
 * إرسال سؤال والحصول على استجابة متدفقة (streaming)
 */
export async function askIslamicQuestionStream(
  question: string,
  history: ChatMessage[] = [],
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    const response = await fetchWithTimeout(
      API_CONFIG.API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_CONFIG.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://ahlaam-alrooh.app",
          "X-Title": "أحلام الروض - Islamic App",
        },
        body: JSON.stringify({
          model: API_CONFIG.MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...history.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: question },
          ],
          temperature: AI_SETTINGS.TEMPERATURE,
          max_tokens: AI_SETTINGS.MAX_TOKENS,
          stream: true,
        }),
      },
      AI_SETTINGS.TIMEOUT * 1000
    );

    if (!response.ok) {
      if (response.status === 429) {
        onError(RATE_LIMIT_ERROR);
        return;
      }
      throw new Error(`خطأ في الاتصال: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError("تعذر قراءة الاستجابة");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);
            if (parsed.choices?.[0]?.delta?.content) {
              onChunk(parsed.choices[0].delta.content);
            }
          } catch {
            // تجاهل أخطاء التحليل
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        onError(TIMEOUT_ERROR);
      } else {
        onError(`${CONNECTION_ERROR}\n${error.message}`);
      }
    } else {
      onError(CONNECTION_ERROR);
    }
  }
}

/**
 * استخراج المصادر من النص
 */
function extractSources(text: string): Source[] {
  const sources: Source[] = [];
  const patterns = [
    // القرآن
    { regex: /سورة\s+([^\s]+)(?:\s+الآية\s+(\d+))?(?:\s*[:\-]\s*)?([^\n]+)/gi, type: "quran" as const },
    // الأحاديث
    { regex: /(?:رواه|صحيح|حسن|ضعيف|أحاديث)\s+([^\n]+)/gi, type: "hadith" as const },
    // العلماء
    { regex: /(?:قال|ذكر|أشار)\s+(?:الشيخ|العالم|الفقيه)\s+([^\n]+)/gi, type: "scholar" as const },
  ];

  for (const { regex, type } of patterns) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      sources.push({
        type,
        text: match[0],
        reference: match[1] || match[0],
      });
      if (sources.length >= 5) break;
    }
  }

  return sources;
}

/**
 * استخراج المواضيع ذات الصلة
 */
function extractRelatedTopics(text: string): string[] {
  const topics: string[] = [];
  const keywords = [
    "الصلاة", "الوضوء", "الزكاة", "الصيام", "الحج", "القرآن", 
    "الطهارة", "الجنابة", "الحيض", "الصدقة", "الدعاء",
    "الذكر", "التوبة", "الاستغفار", "التسبيح", "التحميد",
    "الله", "الإيمان", "الشرك", "البدعة", "السنة", "الحديث"
  ];

  for (const keyword of keywords) {
    if (text.includes(keyword) && !topics.includes(keyword)) {
      topics.push(keyword);
      if (topics.length >= 5) break;
    }
  }

  return topics;
}

/**
 * دالة مساعدة للطلبات مع انتهاء المهلة
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * الحصول على قائمة النماذج المتاحة
 */
export function getAvailableModels() {
  return API_CONFIG.AVAILABLE_MODELS;
}

/**
 * تغيير النموذج المستخدم
 */
export function setModel(modelId: string) {
  if (API_CONFIG.AVAILABLE_MODELS.some(m => m.id === modelId)) {
    (API_CONFIG as { MODEL: string }).MODEL = modelId;
  }
}
