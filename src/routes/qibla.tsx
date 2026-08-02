import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { QiblaCompass } from "@/components/qibla/QiblaCompass";

export const Route = createFileRoute("/qibla")({
  head: () => ({
    meta: [
      { title: "اتجاه القبلة — نور" },
      { name: "description", content: "بوصلة تفاعلية تستخدم حساسات جهازك لتحديد اتجاه القبلة نحو الكعبة المشرفة." },
      { property: "og:title", content: "اتجاه القبلة — نور" },
      { property: "og:description", content: "حدّد القبلة بدقة أينما كنت، بدون إنترنت." },
    ],
  }),
  component: QiblaPage,
});

function QiblaPage() {
  return (
    <AppShell title="اتجاه القبلة" subtitle="بوصلة تعتمد على حساسات جهازك">
      <QiblaCompass />
    </AppShell>
  );
}