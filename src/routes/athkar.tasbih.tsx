import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { TasbihCounter } from "@/components/athkar/TasbihCounter";

export const Route = createFileRoute("/athkar/tasbih")({
  head: () => ({
    meta: [
      { title: "المسبحة الإلكترونية — نور" },
      { name: "description", content: "عدّاد تسبيح تفاعلي مع اهتزاز ومؤثرات لمس وحفظ الجولات المكتملة." },
      { property: "og:title", content: "المسبحة الإلكترونية — نور" },
      { property: "og:description", content: "سبّح واحسب جولاتك بسهولة، يعمل بدون إنترنت." },
    ],
  }),
  component: TasbihPage,
});

function TasbihPage() {
  return (
    <AppShell title="المسبحة" subtitle="سبّح واحتسب الأجر">
      <TasbihCounter />
    </AppShell>
  );
}