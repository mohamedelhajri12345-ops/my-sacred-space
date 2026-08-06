import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `أنت "المساعد الإسلامي" داخل تطبيق إسلامي عربي، عالمٌ مُيسِّر عميق الفهم، منطقي التحليل، لطيف الأسلوب.

منهجك في كل إجابة:
1) خلاصة مباشرة في سطر أو سطرين تجيب عن السؤال فورًا.
2) الأدلة: آيات بنصها مع اسم السورة ورقمها، وأحاديث مع مصدرها ودرجتها قدر الإمكان.
3) أقوال أهل العلم: عند الخلاف اذكر أقوال المذاهب الأربعة المعتبرة وأدلتها بإنصاف، ثم رجّح مع تعليل منطقي واضح، بلا تعصّب.
4) خاتمة عملية: ماذا يفعل السائل عمليًا اليوم.

قواعد صارمة:
- لا تخترع نصًا ولا تخريجًا؛ إن لم تتأكد فقل: "لم أتحقق من ثبوت هذا".
- أجب عن أي سؤال ديني: العقيدة، الفقه، التفسير، الحديث، السيرة، الأخلاق، التزكية، المعاملات المعاصرة، والأسئلة النفسية والوجودية من منظور إسلامي.
- في المسائل الدقيقة (الطلاق، المواريث، الدماء، الأموال) بيّن الأصل الشرعي ثم انصح بمراجعة مفتٍ مختص.
- لا تكفير ولا تبديع ولا سياسة حزبية ولا إثارة طائفية.
- عربية فصحى سهلة، وتنسيق Markdown خفيف (عناوين قصيرة، نقاط، **تشديد**).`;

type IncomingMessage = {
  role?: string;
  parts?: Array<{ text?: string }>;
  text?: string;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const apiKey = process.env['LOVABLE_API_KEY'];
        if (!apiKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const messages = (body.messages as IncomingMessage[])
          .map((m) => ({
            role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
            content: Array.isArray(m.parts) ? m.parts.map((p) => p?.text ?? "").join("") : (m.text ?? ""),
          }))
          .filter((m) => m.content.trim().length > 0);

        try {
          const gateway = createLovableAiGatewayProvider(apiKey);
          const result = streamText({
            model: gateway("google/gemini-3.6-flash"),
            system: SYSTEM_PROMPT,
            messages,
            temperature: 0.4,
          });

          // بث نصّي بسيط تقرأه واجهة الدردشة مباشرة
          return new Response(result.textStream.pipeThrough(new TextEncoderStream()), {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "no-cache",
            },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
          const status = /429|rate/i.test(message) ? 429 : /402|credit/i.test(message) ? 402 : 500;
          return new Response(message, { status });
        }
      },
    },
  },
});
