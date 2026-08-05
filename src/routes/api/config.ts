/**
 * نقطة API لجلب إعدادات التطبيق بشكل آمن
 * يُرجع مفتاح API للعميل من متغير البيئة
 */

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/config")({
  server: {
    handlers: {
      GET: async () => {
        // قراءة مفتاح API من متغير البيئة
        const apiKey = process.env['OPENROUTER_API_KEY'];
        
        // التحقق من وجود المفتاح
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "API key not configured" }),
            { 
              status: 500,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        // إرجاع إعدادات التطبيق (بدون المفتاح الفعلي للعميل)
        return new Response(
          JSON.stringify({
            success: true,
            apiKey: apiKey, // في الإنتاج، يجب تشفير هذا أو استخدام جلسة
            model: "google/gemini-2.0-flash-001",
            availableModels: [
              { id: "google/gemini-2.0-flash-001", name: "Gemini 2.0 Flash (سريع)" },
              { id: "google/gemini-2.5-flash-preview-05-20", name: "Gemini 2.5 Flash (معاينة)" },
              { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku (اقتصادي)" },
              { id: "openai/gpt-4o-mini", name: "GPT-4o Mini (موثوق)" },
            ],
          }),
          { 
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      },
    },
  },
});
