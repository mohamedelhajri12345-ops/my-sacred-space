import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  BellRing,
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
  Eye,
  Zap,
  Wifi,
  WifiOff,
  Smartphone,
  Volume2,
  Vibrate,
  Shield,
  Gauge,
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
      { title: "الإعدادات — أحلام الروض" },
      { name: "description", content: "اضبط الموقع وطريقة حساب المواقيت وتنبيهات الأذان والقارئ والمظهر." },
      { property: "og:title", content: "الإعدادات — أحلام الروض" },
      { property: "og:description", content: "تخصيص كامل لتجربتك في تطبيق أحلام الروض." },
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
  const { settings, updateSettings, coords, place, requestLocation, locating, locationError, streak, online } = useApp();
  const [previewing, setPreviewing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
      await registerForBackgroundNotifications();
    } else if (result === "unsupported") {
      toast.error("متصفحك لا يدعم الإشعارات");
    } else {
      toast.error("لم يتم منح إذن الإشعارات");
    }
  };

  const registerForBackgroundNotifications = async () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          // طلب إذن Push
          if ('pushManager' in registration) {
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array('BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U7M')
            });
            console.log('Push subscription:', subscription);
          }
        } catch (error) {
          console.log('Push registration failed:', error);
        }
      }
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

  return (
    <AppShell title="الإعدادات" subtitle="خصّص تجربتك">
      <div className="space-y-4 pb-24">
        {/* حالة الاتصال */}
        <div className="surface-card p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {online ? (
              <Wifi className="size-4 text-green-500" />
            ) : (
              <WifiOff className="size-4 text-muted-foreground" />
            )}
            <span className="text-xs">
              {online ? "متصل بالإنترنت" : "غير متصل - أوفلاين"}
            </span>
          </div>
          <div className="text-[10px] text-muted-foreground">
            AI: {online ? "متاح" : "غير متاح"}
          </div>
        </div>

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
              {locating ? "جارٍ التحديد…" : "تحديد موقعي (GPS)"}
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
            {settings.notificationsEnabled ? "التنبيهات مُفعّلة ✓" : "تفعيل التنبيهات"}
          </button>

          <p className="text-[11px] text-muted-foreground">
            {settings.notificationsEnabled ? (
              <span className="flex items-center gap-1">
                <Smartphone className="size-3" />
                الإشعارات تعمل حتى عند إغلاق التطبيق
              </span>
            ) : (
              "تفعيل الإشعارات للحصول على تنبيهات الأذان"
            )}
          </p>

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
                {a.key === "silent" && <Volume2 className="size-3 mx-auto mb-1" />}
                {a.key === "beep" && <Vibrate className="size-3 mx-auto mb-1" />}
                {a.key === "adhan" && <BellRing className="size-3 mx-auto mb-1" />}
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
              { key: "reading", label: "قراءة", icon: Eye },
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
          <p className="text-[11px] text-muted-foreground">
            {settings.theme === "reading" 
              ? "وضع القراءة: خلفية كحلي داكن مع نص ذهبي للقراءة المريحة"
              : settings.theme === "dark"
              ? "الوضع الليلي: ألوان داكنة مع زخارف متحركة"
              : "الوضع النهاري: ألوان فاتحة ومشرقة"}
          </p>
          <Toggle
            label="الخلفية المتحركة"
            hint="زخارف إسلامية تتحرك ببطء خلف المحتوى"
            value={settings.animatedBackground}
            onChange={(v) => updateSettings({ animatedBackground: v })}
          />
        </Section>

        {/* الإعدادات المتقدمة */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:bg-secondary"
        >
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-[var(--gold)]" />
            <span className="font-medium">الإعدادات المتقدمة</span>
          </div>
          <span className="text-muted-foreground">{showAdvanced ? "▲" : "▼"}</span>
        </button>

        {showAdvanced && (
          <div className="space-y-4">
            <Section title="الأداء" icon={Gauge}>
              <Toggle
                label="التحميل السريع"
                hint="تحميل المحتوى الأهم أولاً"
                value={true}
                onChange={() => {}}
              />
              <Toggle
                label="تخزين ذكي"
                hint="حفظ البيانات للاستخدام أوفلاين"
                value={true}
                onChange={() => {}}
              />
            </Section>

            <Section title="الخصوصية" icon={Shield}>
              <Toggle
                label="حفظ الموقع محلياً"
                hint="عدم إرسال الموقع للخوادم"
                value={true}
                onChange={() => {}}
              />
              <Toggle
                label="عدم تتبع الاستخدام"
                hint="تحسين الخصوصية"
                value={false}
                onChange={() => {}}
              />
            </Section>

            <Section title="إدارة البيانات" icon={BookOpenText}>
              <button className="press w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-right">
                تصدير البيانات
              </button>
              <button className="press w-full rounded-xl border border-destructive bg-destructive/10 px-3 py-2.5 text-sm text-destructive text-right">
                حذف جميع البيانات
              </button>
            </Section>
          </div>
        )}

        <Section title="عن التطبيق" icon={Info}>
          <p className="text-xs text-muted-foreground">
            سلسلة الأذكار: {streak.count} يوم · مجموع الجلسات: {streak.totalSessions}
          </p>
          <p className="text-[11px] leading-6 text-muted-foreground">
            «أحلام الروض» تطبيق إسلامي يعمل بالكامل بدون إنترنت بعد أول زيارة. جميع بياناتك — العلامات، الختمة،
            المفكرة — محفوظة على جهازك فقط بلا حساب ولا مزامنة. التلاوة الصوتية والذكاء الاصطناعي فقط يحتاجان
            اتصالًا بالإنترنت.
          </p>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="rounded-full bg-green-500/20 px-2 py-1 text-green-500">القرآن: أوفلاين</span>
            <span className="rounded-full bg-[var(--gold)]/20 px-2 py-1 text-[var(--gold)]">AI: {online ? "متصل" : "غير متاح"}</span>
            <span className="rounded-full bg-blue-500/20 px-2 py-1 text-blue-500">الصوت: أوفلاين</span>
          </div>
        </Section>
      </div>
    </AppShell>
  );
}

// Helper function for push notifications
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
