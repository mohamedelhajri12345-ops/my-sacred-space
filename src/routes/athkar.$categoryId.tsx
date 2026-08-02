import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { AthkarReader } from "@/components/athkar/AthkarReader";
import { ATHKAR } from "@/data/athkar";

export const Route = createFileRoute("/athkar/$categoryId")({
  head: () => ({
    meta: [
      { title: "أذكار — نور" },
      { name: "description", content: "اقرأ الأذكار واضغط على كل ذكر لعدّ التكرار مع مؤثرات لمس واهتزاز." },
      { property: "og:title", content: "أذكار — نور" },
      { property: "og:description", content: "عدّاد تفاعلي للأذكار المأثورة." },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { categoryId } = Route.useParams();
  const category = ATHKAR.find((c) => c.id === categoryId);
  if (!category) throw notFound();
  return (
    <AppShell title={category.title} subtitle="اضغط على الذكر لعدّ التكرار">
      <AthkarReader category={category} />
    </AppShell>
  );
}