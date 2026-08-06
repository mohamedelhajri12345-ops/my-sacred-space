import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/** مزوّد Lovable AI (متوافق مع OpenAI) — يُنشأ داخل حدود الطلب فقط. */
export function createLovableAiGatewayProvider(lovableApiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}
