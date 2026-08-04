import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  BellRing,
  Bell,
  BookOpenText,
  Info,
  MapPin,
  Moon,
  Palette,
  Play,
  Square,
  Sun,
  Clock3,
  Star,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/lib/app-context";
import { METHODS, PRAYER_LABELS, type MethodKey, type PrayerKey } from "@/lib/prayer";
import { RECITERS } from "@/lib/quran";
import { previewAlertSound, requestNotificationPermission, stopAlertSound } from "@/lib/notifications";
import { placeLabel } from "@/lib/geo";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import type { AlertKind } from "@/lib/app-context";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "الإعدادات — نور" },
      { name: "description", content: "اضبط الموقع وطريقة حساب المواقيت وتنبيهات الأذان والقارئ والمظهر وتذكيرات القيام والصيام." },
      { property: "og:title", content: "الإعدادات — نور" },
      { property: "og:description", content: "تخصيص كامل لتجربتك في تطبيق نور." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-card glass-panel space-y-3 p-4">
      <h2 className="flex items-center gap-2 text-sm font-bold">
        <span className="flex size-8 items-center justify-center rounded-xl bg-secondary text-primary">
          <Icon className="size-4" />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium">{label}</p>
        {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      </div>
      <button
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => {
          haptic(value ? "light" : "medium");
          onChange(!value);
        }}
        className={cn(
          "press relative h-7 w-12 shrink-0 rounded-full transition-colors",
          value ? "gradient-gold" : "bg-secondary",
        )}
      >
        <span
          className={cn(
            "absolute top-1 block size-5 rounded-full bg-card transition-all",
            value ? "right-1" : "right-6",
          )}
        />
      </button>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block text-xs text-muted-foreground">
      {label}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={() => haptic("light")}
        className="mt-2 w-full accent-[var(--gold)]"
      />
    </label>
  );
}

const ALERTS: { key: AlertKind; label: string }[] = [
  { key: "silent", label: "صامت" },
  { key: "beep", label: "تنبيه قصير" },
  { key: "adhan", label: "أذان كامل" },
];

function SettingsPage() {
  const { settings, updateSettings, coords, place, requestLocation, locating, locationError, streak } = useApp();
  const [previewing, setPreviewing] = useState(false);

  const enableNotifications = async () => {
    haptic("medium");
    if (settings.notificationsEnabled) {
      updateSettings({ notificationsEnabled: false });
      toast("تم إيقاف التنبيهات");
      return;
    }
    const result = await requestNotificationPermission();
    if (result === "granted") {
      updateSettings({ notificationsEnabled: true });
      toast.success("تم تفعيل التنبيهات");
    } else if (result === "unsupported") {
      toast.error("متصفحك لا يدعم الإشعارات");
    } else {
      toast.error("لم يتم منح إذن الإشعارات");
    }
  };

  const togglePreview = () => {
    haptic("light");
    if (previewing) {
      stopAlertSound();
      setPreviewing(false);
      return;
    }
    previewAlertSound(settings.alertKind);
    setPreviewing(true);
  };

  /** تبديل تنبيه صلاة معينة */
  const togglePrayerNotification = (prayer: string) => {
    haptic("light");
    updateSettings({
      prayerNotifications: {
        ...settings.prayerNotifications,
        [prayer]: !settings.prayerNotifications[prayer],
      },
    });
  };

  return (
    <AppShell title="الإعدادات" subtitle="خصّص تجربتك">
      <div className="space-y-4 pb-24">
        <Section title="الموقع والصلاة" icon={MapPin}>
          <p className="text-[11px] leading-6 text-muted-foreground">
            نحتاج موقعك لحساب مواقيت الصلاة واتجاه القبلة بدقة. الموقع يُحفظ على جهازك فقط ولا يُرسل لأي خادم
            عدا خدمة تحويل الإحداثيات إلى اسم مدينة.
          </p>
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="truncate text-muted-foreground">{placeLabel(place, coords.label ?? "موقع محفوظ")}</span>
            <button
              onClick={() => {
                haptic("medium");
                void requestLocation();
              }}
              className="press shrink-0 rounded-full border border-border bg-card px-3 py-1.5"
            >
              {locating ? "جارٍ التحديد…" : "تحديد موقعي"}
            </button>
          </div>
          {locationError && <p className="text-[11px] text-destructive">{locationError}</p>}

          <Link
            to="/location"
            className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
          >
            <div className="flex items-center gap-2">
              <Star className="size-4 text-muted-foreground" />
              <span>اختيار المدينة يدوياً</span>
            </div>
            <span className="text-muted-foreground">→</span>
          </Link>

          <Toggle
            label="اختيار طريقة الحساب تلقائيًا"
            hint="حسب دولتك المكتشفة من الموقع"
            value={settings.autoMethod}
            onChange={(v) => updateSettings({ autoMethod: v })}
          />
          <select
            value={settings.method}
            onChange={(e) => {
              haptic("light");
              updateSettings({ method: e.target.value as MethodKey, autoMethod: false });
            }}
            className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none"
          >
            {METHODS.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </Section>

        <Section title="الإشعارات والأذان" icon={BellRing}>
          <button
            onClick={enableNotifications}
            className={cn(
              "press w-full rounded-xl px-3 py-2.5 text-sm font-bold",
              settings.notificationsEnabled
                ? "gradient-warm text-primary-foreground"
                : "bg-secondary text-secondary-foreground",
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
                  settings.alertKind === a.key
                    ? "gradient-gold border-transparent text-gold-foreground"
                    : "bg-card text-muted-foreground",
                )}
              >
                {a.label}
              </button>
            ))}
          </div>
          <button
            onClick={togglePreview}
            className="press flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-2 text-xs"
          >
            {previewing ? <Square className="size-3.5" /> : <Play className="size-3.5" />}
            {previewing ? "إيقاف المعاينة" : "معاينة صوت الأذان"}
          </button>

          {/* تنبيهات مستقلة لكل صلاة */}
          <div className="space-y-2">
            <p className="text-xs font-medium">تنبيهات كل صلاة:</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(PRAYER_LABELS) as PrayerKey[])
                .filter((key) => key !== "sunrise")
                .map((prayer) => (
                  <div
                    key={prayer}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-3 py-2 text-xs",
                      settings.prayerNotifications[prayer]
                        ? "border-primary/30 bg-primary/5"
                        : "border-border bg-card",
                    )}
                  >
                    <span>{PRAYER_LABELS[prayer]}</span>
                    <button
                      onClick={() => togglePrayerNotification(prayer)}
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-xs",
                        settings.prayerNotifications[prayer]
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground",
                      )}
                    >
                      <Bell className="size-3" />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <Slider
            label={`التذكير المسبق: ${settings.reminderMinutes} دقيقة`}
            value={settings.reminderMinutes}
            min={0}
            max={45}
            step={5}
            onChange={(v) => updateSettings({ reminderMinutes: v })}
          />
          <Toggle
            label="تذكير الوضوء قبل الأذان"
            hint="تنبيه خفيف للاستعداد للصلاة"
            value={settings.wuduReminder}
            onChange={(v) => updateSettings({ wuduReminder: v })}
          />
          {settings.wuduReminder && (
            <Slider
              label={`قبل الأذان بـ ${settings.wuduMinutes} دقيقة`}
              value={settings.wuduMinutes}
              min={5}
              max={30}
              step={5}
              onChange={(v) => updateSettings({ wuduMinutes: v })}
            />
          )}
          <Toggle
            label="تذكير قيام الليل والوتر"
            hint="عند دخول الثلث الأخير من الليل"
            value={settings.qiyamReminder}
            onChange={(v) => updateSettings({ qiyamReminder: v })}
          />
          <Toggle
            label="تذكير صيام الاثنين والخميس والأيام البيض"
            hint="تذكير مساء اليوم السابق"
            value={settings.fastingReminder}
            onChange={(v) => updateSettings({ fastingReminder: v })}
          />
        </Section>

        <Section title="وضع الخشوع" icon={Clock3}>
          <Toggle
            label="إسكات التنبيهات بعد دخول الوقت"
            hint="لتجنّب التشويش أثناء الصلاة"
            value={settings.khushuMode}
            onChange={(v) => updateSettings({ khushuMode: v })}
          />
          <Slider
            label={`مدة الخشوع: ${settings.khushuMinutes} دقيقة`}
            value={settings.khushuMinutes}
            min={5}
            max={45}
            step={5}
            onChange={(v) => updateSettings({ khushuMinutes: v })}
          />
        </Section>

        <Section title="القراءة والتلاوة" icon={BookOpenText}>
          <select
            value={settings.reciter}
            onChange={(e) => {
              haptic("light");
              updateSettings({ reciter: e.target.value });
            }}
            className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none"
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <Toggle
            label="عرض ترجمة المعاني بالإنجليزية"
            hint="بجانب النص العربي أثناء القراءة"
            value={settings.showTranslation}
            onChange={(v) => updateSettings({ showTranslation: v })}
          />
          <Slider
            label={`حجم الخط: ${Math.round(settings.fontScale * 100)}٪`}
            value={settings.fontScale}
            min={0.9}
            max={1.4}
            step={0.05}
            onChange={(v) => updateSettings({ fontScale: v })}
          />
          <p className="text-[11px] text-muted-foreground">التلاوة الصوتية تحتاج اتصالًا بالإنترنت.</p>
        </Section>

        <Section title="المظهر" icon={Palette}>
          <div className="flex gap-2">
            {([
              { key: "light", label: "نهاري", icon: Sun },
              { key: "dark", label: "ليلي", icon: Moon },
            ] as const).map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  haptic("light");
                  updateSettings({ theme: t.key });
                }}
                className={cn(
                  "press flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs",
                  settings.theme === t.key
                    ? "gradient-gold border-transparent text-gold-foreground"
                    : "bg-card text-muted-foreground",
                )}
              >
                <t.icon className="size-3.5" /> {t.label}
              </button>
            ))}
          </div>
          <Toggle
            label="الخلفية المتحركة"
            hint="زخارف إسلامية تتحرك ببطء خلف المحتوى"
            value={settings.animatedBackground}
            onChange={(v) => updateSettings({ animatedBackground: v })}
          />
        </Section>

        <Section title="عن التطبيق" icon={Info}>
          <p className="text-xs text-muted-foreground">
            سلسلة الأذكار: {streak.count} يوم · مجموع الجلسات: {streak.totalSessions}
          </p>
          <p className="text-[11px] leading-6 text-muted-foreground">
            «نور» تطبيق إسلامي يعمل بالكامل بدون إنترنت بعد أول زيارة. جميع بياناتك — العلامات، الختمة،
            المفكرة — محفوظة على جهازك فقط بلا حساب ولا مزامنة. التلاوة الصوتية والمحادثة الذكية فقط تحتاج
            اتصالًا.
          </p>
        </Section>
      </div>
    </AppShell>
  );
}
