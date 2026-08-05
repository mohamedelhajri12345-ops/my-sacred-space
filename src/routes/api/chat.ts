import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

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

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env['LOVABLE_API_KEY'];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);

        try {
          const result = streamText({
            model: gateway("google/gemini-3.6-flash"),
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages as UIMessage[]),
          });
          return result.toTextStreamResponse();
        } catch (error) {
          const message = error instanceof Error ? error.message : "AI error";
          const status = message.includes("429") ? 429 : message.includes("402") ? 402 : 500;
          return new Response(message, { status });
        }
      },
    },
  },
});
