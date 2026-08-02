import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { NextPrayerCard } from "@/components/prayer/NextPrayerCard";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { SpiritualStats } from "@/components/home/SpiritualStats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "نور — قرآن وأذكار ومواقيت صلاة" },
      {
        name: "description",
        content: "تطبيق إسلامي شامل يعمل بدون إنترنت: القرآن والتفسير، الأذكار والمسبحة، مواقيت الصلاة، القبلة والتقويم الهجري.",
      },
      { property: "og:title", content: "نور — قرآن وأذكار ومواقيت صلاة" },
      { property: "og:description", content: "رفيقك اليومي في العبادة، يعمل أوفلاين بالكامل." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AppShell title="نور" subtitle="رفيقك اليومي في العبادة">
      <div className="space-y-5">
        <NextPrayerCard />
        <SpiritualStats />
        <div>
          <h2 className="mb-3 px-1 text-sm font-bold text-muted-foreground">الأقسام</h2>
          <FeatureGrid />
        </div>
        <div className="surface-card p-4 text-center">
          <p className="font-display text-lg leading-9">
            «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">سورة الرعد — الآية ٢٨</p>
        </div>
      </div>
    </AppShell>
  );
}
