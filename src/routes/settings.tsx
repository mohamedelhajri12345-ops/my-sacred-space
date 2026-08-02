import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/lib/app-context";
import { METHODS, type MethodKey } from "@/lib/prayer";
import { RECITERS } from "@/lib/quran";
import { requestNotificationPermission } from "@/lib/notifications";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import type { AlertKind } from "@/lib/app-context";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "الإعدادات — نور" },
      { name: "description", content: "اضبط طريقة حساب المواقيت ونوع تنبيه الأذان ووقت التذكير ووضع الخشوع والقارئ المفضل." },
      { property: "og:title", content: "الإعدادات — نور" },
      { property: "og:description", content: "تخصيص كامل لتجربتك في تطبيق نور." },
    ],
  }),
  component: SettingsPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="surface-card space-y-3 p-4">
      <h2 className="text-sm font-bold">{title}</h2>
      {children}
    </section>
  );
}

const ALERTS: { key: AlertKind; label: string }[] = [
  { key: "silent", label: "صامت" },
  { key: "beep", label: "نغمة قصيرة" },
  { key: "adhan", label: "نغمة أذان" },
];

function SettingsPage() {
  const { settings, updateSettings, coords, requestLocation, locating, streak } = useApp();

  const enableNotifications = async () => {
    haptic("medium");
    if (settings.notificationsEnabled) {
      updateSettings({ notificationsEnabled: false });
      return;
    }
    const result = await requestNotificationPermission();
    if (result === "granted") {
      updateSettings({ notificationsEnabled: true });
      toast.success("تم تفعيل التنبيهات");
    } else {
      toast.error("لم يتم منح إذن الإشعارات");
    }
  };

  return (
    <AppShell title="الإعدادات" subtitle="خصّص تجربتك">
      <div className="space-y-4">
        <Section title="الموقع وطريقة الحساب">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{coords.label ?? "موقع محفوظ"}</span>
            <button onClick={requestLocation} className="press rounded-full border border-border px-3 py-1.5">
              {locating ? "جارٍ التحديد…" : "تحديث الموقع"}
            </button>
          </div>
          <select
            value={settings.method}
            onChange={(e) => updateSettings({ method: e.target.value as MethodKey })}
            className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none"
          >
            {METHODS.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </Section>

        <Section title="تنبيهات الأذان">
          <button
            onClick={enableNotifications}
            className={cn(
              "press w-full rounded-xl px-3 py-2.5 text-sm font-bold",
              settings.notificationsEnabled ? "gradient-warm text-primary-foreground" : "bg-secondary text-secondary-foreground",
            )}
          >
            {settings.notificationsEnabled ? "التنبيهات مُفعّلة" : "تفعيل التنبيهات"}
          </button>
          <div className="flex gap-2">
            {ALERTS.map((a) => (
              <button
                key={a.key}
                onClick={() => {
                  haptic("light");
                  updateSettings({ alertKind: a.key });
                }}
                className={cn(
                  "press flex-1 rounded-xl border border-border px-2 py-2 text-xs",
                  settings.alertKind === a.key ? "gradient-gold border-transparent text-gold-foreground" : "bg-card text-muted-foreground",
                )}
              >
                {a.label}
              </button>
            ))}
          </div>
          <label className="block text-xs text-muted-foreground">
            التذكير المسبق: {settings.reminderMinutes} دقيقة
            <input
              type="range"
              min={0}
              max={45}
              step={5}
              value={settings.reminderMinutes}
              onChange={(e) => updateSettings({ reminderMinutes: Number(e.target.value) })}
              className="mt-2 w-full accent-[oklch(0.75_0.12_80)]"
            />
          </label>
        </Section>

        <Section title="وضع الخشوع">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">إيقاف التنبيهات مؤقتًا بعد دخول وقت الصلاة</p>
            <button
              onClick={() => {
                haptic("light");
                updateSettings({ khushuMode: !settings.khushuMode });
              }}
              className={cn(
                "press h-7 w-12 rounded-full transition-colors",
                settings.khushuMode ? "bg-primary" : "bg-secondary",
              )}
            >
              <span
                className={cn(
                  "block size-5 rounded-full bg-card transition-transform",
                  settings.khushuMode ? "translate-x-1.5" : "translate-x-6",
                )}
              />
            </button>
          </div>
          <label className="block text-xs text-muted-foreground">
            مدة الخشوع: {settings.khushuMinutes} دقيقة
            <input
              type="range"
              min={5}
              max={45}
              step={5}
              value={settings.khushuMinutes}
              onChange={(e) => updateSettings({ khushuMinutes: Number(e.target.value) })}
              className="mt-2 w-full accent-[oklch(0.75_0.12_80)]"
            />
          </label>
        </Section>

        <Section title="التلاوة والقراءة">
          <select
            value={settings.reciter}
            onChange={(e) => updateSettings({ reciter: e.target.value })}
            className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none"
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-muted-foreground">التلاوة الصوتية تحتاج اتصالًا بالإنترنت.</p>
        </Section>

        <Section title="إحصائياتي">
          <p className="text-xs text-muted-foreground">
            سلسلة الأذكار: {streak.count} يوم · مجموع الجلسات: {streak.totalSessions}
          </p>
        </Section>

        <p className="px-1 text-center text-[11px] text-muted-foreground">
          جميع البيانات محفوظة على جهازك فقط، والتطبيق يعمل بدون إنترنت عدا المحادثة الذكية والتلاوة الصوتية.
        </p>
      </div>
    </AppShell>
  );
}