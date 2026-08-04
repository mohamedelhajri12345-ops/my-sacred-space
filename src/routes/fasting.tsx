import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { FastingTracker } from "@/components/fasting/FastingTracker";

export const Route = createFileRoute("/fasting")({
  head: () => ({
    meta: [
      { title: "متابعة الصيام — نور" },
      { name: "description", content: "تتبع أيام صيامك والنوافل" },
    ],
  }),
  component: FastingPage,
});

function FastingPage() {
  return (
    <AppShell title="متابعة الصيام" subtitle="سجّل أيام صيامك">
      <FastingTracker />
    </AppShell>
  );
}
