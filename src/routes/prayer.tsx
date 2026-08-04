import { createFileRoute } from "@tanstack/react-router";
import { MapPin, RefreshCw, BellRing } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { NextPrayerCard } from "@/components/prayer/NextPrayerCard";
import { PrayerTimesList } from "@/components/prayer/PrayerTimesList";
import { useApp } from "@/lib/app-context";
import { requestNotificationPermission } from "@/lib/notifications";
import { haptic } from "@/lib/haptics";

export const Route = createFileRoute("/prayer")({
  head: () => ({
    meta: [
      { title: "مواقيت الصلاة — نور" },
      { name: "description", content: "مواقيت الصلاة محسوبة فلكيًا حسب موقعك مع عدّ تنازلي للصلاة القادمة وتنبيهات الأذان." },
      { property: "og:title", content: "مواقيت الصلاة — نور" },
      { property: "og:description", content: "حساب دقيق للمواقيت يعمل أوفلاين بآخر موقع محفوظ." },
    ],
  }),
  component: PrayerPage,
});

function PrayerPage() {
  const { coords, requestLocation, locating, locationError, settings, updateSettings } = useApp();

  const enableNotifications = async () => {
    haptic("medium");
    const result = await requestNotificationPermission();
    if (result === "granted") {
      updateSettings({ notificationsEnabled: true });
      toast.success("تم تفعيل تنبيهات الأذان");
    } else if (result === "unsupported") {
      toast.error("المتصفح لا يدعم الإشعارات");
    } else {
      toast.error("لم يتم منح إذن الإشعارات");
    }
  };

  return (
    <AppShell title="مواقيت الصلاة" subtitle={coords.label ?? "آخر موقع محفوظ"}>
      <div className="space-y-4">
        <NextPrayerCard />

        <div className="surface-card flex items-center justify-between p-4">
          <span className="flex items-center gap-2 text-sm">
            <MapPin className="size-4 text-accent" />
            <span dir="ltr" className="text-xs text-muted-foreground">
              {coords?.latitude?.toFixed(3) ?? "---"}, {coords?.longitude?.toFixed(3) ?? "---"}
            </span>
          </span>
          <button
            onClick={() => {
              haptic("light");
              requestLocation();
            }}
            className="press flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs"
          >
            <RefreshCw className={locating ? "size-3.5 animate-spin" : "size-3.5"} /> تحديد موقعي
          </button>
        </div>
        {locationError && <p className="px-1 text-xs text-destructive">{locationError}</p>}

        {!settings.notificationsEnabled && (
          <button
            onClick={enableNotifications}
            className="press surface-card flex w-full items-center gap-3 p-4 text-right"
          >
            <span className="flex size-10 items-center justify-center rounded-xl gradient-gold text-gold-foreground">
              <BellRing className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-bold">تفعيل تنبيهات الأذان</span>
              <span className="block text-[11px] text-muted-foreground">إشعار عند دخول الوقت وتذكير مسبق</span>
            </span>
          </button>
        )}

        <PrayerTimesList />
      </div>
    </AppShell>
  );
}