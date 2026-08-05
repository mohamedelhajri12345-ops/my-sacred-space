import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { MusicLibrary } from "@/components/music/MusicLibrary";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "المكتبة — أحلام الروح" },
      { name: "description", content: "مكتبة الأناشيد والأدعية والتلاوات الإسلامية مع مشغل متحرك." },
      { property: "og:title", content: "المكتبة — أحلام الروض" },
      { property: "og:description", content: "مكتبة أناشيد وأدعية وتلاوات دينية إسلامية." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  return (
    <AppShell title="المكتبة الصوتية" subtitle="أناشيد · أدعية · تلاوات">
      <MusicLibrary />
    </AppShell>
  );
}
