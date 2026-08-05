import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { QuranPageEnhanced } from "@/components/quran/QuranPageEnhanced";

export const Route = createFileRoute("/quran/")({
  head: () => ({
    meta: [
      { title: "القرآن الكريم — أحلام الروح" },
      { name: "description", content: "تصفّح سور القرآن الكريم مع البحث في الآيات والعلامات المرجعية ومتابعة الختمة." },
      { property: "og:title", content: "القرآن الكريم — أحلام الروح" },
      { property: "og:description", content: "المصحف كاملًا مع التفسير الميسّر والبحث، يعمل بدون إنترنت." },
    ],
  }),
  component: QuranPage,
});

function QuranPage() {
  return (
    <AppShell title="القرآن الكريم" subtitle="١١٤ سورة · تفسير ميسّر">
      <QuranPageEnhanced />
    </AppShell>
  );
}