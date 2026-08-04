import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { KhatmahCard } from "@/components/quran/KhatmahCard";

export const Route = createFileRoute("/khatmah")({
  head: () => ({
    meta: [
      { title: "تقدّم الختمة — نور" },
      { name: "description", content: "تابع تقدّمك في ختم القرآن الكريم وشارك بطاقة أنيقة قابلة للتنزيل كصورة." },
      { property: "og:title", content: "تقدّم الختمة — نور" },
      { property: "og:description", content: "بطاقة مشاركة أنيقة لتقدّم ختم القرآن." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: KhatmahPage,
});

function KhatmahPage() {
  return (
    <AppShell title="ختمة القرآن" subtitle="تقدّمك وبطاقة المشاركة">
      <KhatmahCard />
    </AppShell>
  );
}
