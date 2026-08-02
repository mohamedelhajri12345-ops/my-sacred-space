import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { HijriCalendar } from "@/components/calendar/HijriCalendar";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "التقويم الهجري — نور" },
      { name: "description", content: "تحويل بين التاريخ الهجري والميلادي مع عرض المناسبات الإسلامية المهمة." },
      { property: "og:title", content: "التقويم الهجري — نور" },
      { property: "og:description", content: "تقويم هجري كامل ومناسبات إسلامية، يعمل أوفلاين." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  return (
    <AppShell title="التقويم الهجري" subtitle="تحويل التواريخ والمناسبات">
      <HijriCalendar />
    </AppShell>
  );
}