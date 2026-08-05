import { createFileRoute } from "@tanstack/react-router";
import { AI_SETTINGS } from "@/lib/api-config";

const SYSTEM_PROMPT = `أنت "المساعد الإسلامي" داخل تطبيق إسلامي عربي.

هويتك ومنهجك:
- عالم مُيسِّر، عميق الفهم، منطقي التحليل، لطيف الأسلوب، تجيب بالعربية الفصحى السهلة.
- تجيب عن أي سؤال ديني: العقيدة، الفقه (المذاهب الأربعة)، التفسير، الحديث، السيرة، الأخلاق، التزكية، المعاملات المعاصرة، والأسئلة الوجودية والنفسية من منظور إسلامي.
- عند اختلاف الفقهاء اذكر الأقوال المعتبرة وأدلتها بإنصاف، ثم بيّن القول الأرجح مع تعليل منطقي، ولا تتعصب لمذهب.
- استشهد بالآيات بنصها مع اسم السورة ورقم الآية، وبالأحاديث مع درجتها ومصدرها (البخاري/مسلم/…) قدر الإمكان، ولا تخترع نصًا أو تخريجًا؛ إن لم تتأكد فقل ذلك صراحة.
- ابدأ بخلاصة مختصرة، ثم التفصيل بعناوين ونقاط قصيرة، ثم خاتمة عملية.
- في المسائل الشخصية الدقيقة (الطلاق، المواريث، الدماء، الأموال) أعطِ الأصل الشرعي ثم انصح بمراجعة مفتٍ مختص.
- لا تُصدر أحكامًا بالتكفير أو التبديع، ولا تتدخل في السياسة الحزبية، وتجنّب إثارة الفتن الطائفية.
- استخدم تنسيق Markdown خفيفًا (عناوين قصيرة، قوائم، **تشديد**).`;

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.0-flash-001";

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        // قراءة مفتاح API من متغير البيئة (آمن في الخادم)
        const apiKey = process.env['OPENROUTER_API_KEY'];
        if (!apiKey) {
          return new Response("OpenRouter API key not configured", { status: 500 });
        }

        try {
          // تحويل تنسيق الرسائل لـ OpenRouter
          const formattedMessages = (messages as UIMessage[]).map((m) => ({
            role: m.role,
            content: Array.isArray(m.parts) 
              ? m.parts.map((p) => p.text).join("")
              : m.parts
          }));

          const response = await fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
              "HTTP-Referer": "https://ahlaam-alrooh.app",
              "X-Title": "أحلام الروض - Islamic App",
            },
            body: JSON.stringify({
              model: MODEL,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...formattedMessages,
              ],
              temperature: AI_SETTINGS.TEMPERATURE,
              max_tokens: AI_SETTINGS.MAX_TOKENS,
              stream: true,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            if (response.status === 429) {
              return new Response("تم تجاوز الحد المسموح من الطلبات، يرجى الانتظار قليلاً", { status: 429 });
            }
            return new Response(`خطأ في API: ${errorText}`, { status: response.status });
          }

          // إعادة البث مباشرة
          return new Response(response.body, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              "Connection": "keep-alive",
            },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
          return new Response(message, { status: 500 });
        }
      },
    },
  },
});

// نوع الرسائل من Vercel AI SDK
interface UIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  parts: Array<{ type: "text"; text: string }>;
}
