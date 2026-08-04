import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { SpiritualJournal } from "@/components/journal/SpiritualJournal";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "المفكرة الروحانية — نور" },
      { name: "description", content: "دوّن خواطرك وأدعيتك وأهدافك الإيمانية في مفكرة خاصة محفوظة على جهازك فقط بدون أي مزامنة." },
      { property: "og:title", content: "المفكرة الروحانية — نور" },
      { property: "og:description", content: "مفكرة إيمانية خاصة تعمل بدون إنترنت وبدون حساب." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  return (
    <AppShell title="المفكرة الروحانية" subtitle="خواطرك محفوظة على جهازك فقط">
      <SpiritualJournal />
    </AppShell>
  );
}
