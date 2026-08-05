import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { MusicLibrary } from "@/components/music/MusicLibrary";
import { BackButton } from "@/components/ui/back-button";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "المكتبة — نور" },
      { name: "description", content: "مكتبة الأناشيد والأغاني الدينية الإسلامية مع مشغل متحرك." },
      { property: "og:title", content: "المكتبة — نور" },
      { property: "og:description", content: "مكتبة أناشيد وأغاني دينية إسلامية." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  return (
    <AppShell title="المكتبة" subtitle="أناشيد وأغاني إسلامية">
      <div className="mb-4">
        <BackButton />
      </div>
      <MusicLibrary />
    </AppShell>
  );
}
