import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { SurahReader } from "@/components/quran/SurahReader";

type SurahSearch = { ayah?: number | undefined };

export const Route = createFileRoute("/quran/$surahId")({
  validateSearch: (search: Record<string, unknown>): SurahSearch => ({
    ayah: search['ayah'] ? Number(search['ayah']) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "قراءة السورة — نور" },
      { name: "description", content: "اقرأ السورة كاملة مع التفسير الميسّر والتلاوة الصوتية والعلامات المرجعية." },
      { property: "og:title", content: "قراءة السورة — نور" },
      { property: "og:description", content: "نص قرآني كامل مع تفسير مبسّط." },
    ],
  }),
  component: SurahPage,
});

function SurahPage() {
  const { surahId } = Route.useParams();
  const { ayah } = Route.useSearch();
  return (
    <AppShell title="المصحف" subtitle="اضغط على الآية لعرض التفسير">
      <SurahReader surahId={Number(surahId)} />
    </AppShell>
  );
}