import { useState, useEffect } from "react";
import { Sun, Moon, Calendar, Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { haptic } from "@/lib/haptics";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";

type FastingDay = {
  date: string; // ISO date string
  type: "ramadan" | "sunnah" | "naafl" | "expiation";
  note?: string;
};

type FastingStats = {
  currentMonth: number;
  totalFasts: number;
  ramadanFasts: number;
  sunnahFasts: number;
  streak: number;
};

const FASTING_TYPES = [
  { key: "ramadan", label: "رمضان", color: "bg-primary" },
  { key: "sunnah", label: "نافلة", color: "bg-gold" },
  { key: "naafl", label: "صيام النفل", color: "bg-secondary" },
  { key: "expiation", label: "قضاء/كفارة", color: "bg-muted" },
] as const;

/** تخزين أيام الصيام */
export function FastingTracker() {
  const [fastingDays, setFastingDays] = useLocalStorage<FastingDay[]>("islamic:fastingDays", []);
  const [stats, setStats] = useState<FastingStats>({
    currentMonth: 0,
    totalFasts: 0,
    ramadanFasts: 0,
    sunnahFasts: 0,
    streak: 0,
  });

  // حساب الإحصائيات
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // أيام هذا الشهر
    const thisMonthFasts = fastingDays.filter((day) => {
      const d = new Date(day.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    // حساب السلسلة
    let streak = 0;
    const sortedDays = [...fastingDays].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (let i = 0; i < sortedDays.length; i++) {
      const dayDate = new Date(sortedDays[i]!.date);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (dayDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    setStats({
      currentMonth: thisMonthFasts.length,
      totalFasts: fastingDays.length,
      ramadanFasts: fastingDays.filter((d) => d.type === "ramadan").length,
      sunnahFasts: fastingDays.filter((d) => d.type === "sunnah").length,
      streak,
    });
  }, [fastingDays]);

  /** إضافة يوم صيام */
  const addFastingDay = (date: Date, type: FastingDay["type"], note?: string) => {
    haptic("medium");
    const dateStr = date.toISOString().split("T")[0]!;

    const exists = fastingDays.some((d) => d.date === dateStr);
    if (exists) {
      toast.info("هذا اليوم محفوظ مسبقاً");
      return;
    }

    setFastingDays((prev) => [...prev, { date: dateStr, type, note }]);
    toast.success("تم تسجيل يوم الصيام");
  };

  /** حذف يوم صيام */
  const removeFastingDay = (date: string) => {
    haptic("light");
    setFastingDays((prev) => prev.filter((d) => d.date !== date));
    toast.success("تم حذف يوم الصيام");
  };

  /** إضافة صيام النافلة السائد (الاثنين والخميس والأيام البيض) */
  const addCommonFasts = () => {
    haptic("medium");
    const now = new Date();
    const newDays: FastingDay[] = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      const dayOfWeek = date.getDay();
      const dayOfMonth = date.getDate();

      // الاثنين (1) والخميس (4)
      if (dayOfWeek === 1 || dayOfWeek === 4) {
        const dateStr = date.toISOString().split("T")[0]!;
        if (!fastingDays.some((d) => d.date === dateStr)) {
          newDays.push({ date: dateStr, type: "sunnah" });
        }
      }

      // الأيام البيض (13، 14، 15)
      if (dayOfMonth === 13 || dayOfMonth === 14 || dayOfMonth === 15) {
        const dateStr = date.toISOString().split("T")[0]!;
        if (!fastingDays.some((d) => d.date === dateStr)) {
          newDays.push({ date: dateStr, type: "sunnah", note: "يوم البيض" });
        }
      }
    }

    if (newDays.length > 0) {
      setFastingDays((prev) => [...prev, ...newDays]);
      toast.success(`تم إضافة ${newDays.length} يوم صيام نافلة`);
    } else {
      toast.info("لا توجد أيام نافلة في الشهر القادم");
    }
  };

  const today = new Date().toISOString().split("T")[0]!;
  const isTodayFasting = fastingDays.some((d) => d.date === today);

  return (
    <div className="space-y-4">
      {/* الإحصائيات */}
      <div className="grid grid-cols-2 gap-3">
        <div className="surface-card p-4 text-center">
          <Calendar className="mx-auto mb-2 size-6 text-primary" />
          <p className="text-2xl font-bold">{stats.currentMonth}</p>
          <p className="text-xs text-muted-foreground">يوم هذا الشهر</p>
        </div>
        <div className="surface-card p-4 text-center">
          <Sun className="mx-auto mb-2 size-6 text-gold" />
          <p className="text-2xl font-bold">{stats.totalFasts}</p>
          <p className="text-xs text-muted-foreground">إجمالي الصيام</p>
        </div>
        <div className="surface-card p-4 text-center">
          <Moon className="mx-auto mb-2 size-6 text-primary" />
          <p className="text-2xl font-bold">{stats.ramadanFasts}</p>
          <p className="text-xs text-muted-foreground">رمضان</p>
        </div>
        <div className="surface-card p-4 text-center">
          <Check className="mx-auto mb-2 size-6 text-gold" />
          <p className="text-2xl font-bold">{stats.streak}</p>
          <p className="text-xs text-muted-foreground">سلسلة متصلة</p>
        </div>
      </div>

      {/* إضافة يوم جديد */}
      <div className="surface-card p-4 space-y-3">
        <p className="text-sm font-medium">تسجيل يوم صيام:</p>
        <div className="flex flex-wrap gap-2">
          {FASTING_TYPES.map((type) => (
            <button
              key={type.key}
              onClick={() => addFastingDay(new Date(), type.key)}
              className={cn(
                "press flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                type.color,
              )}
            >
              <Plus className="size-3" />
              {type.label}
            </button>
          ))}
        </div>
        <button
          onClick={addCommonFasts}
          className="press w-full rounded-xl border border-border bg-card py-2 text-xs"
        >
          إضافة صيام الاثنين والخميس والأيام البيض للشهر القادم
        </button>
      </div>

      {/* الأيام الأخيرة */}
      {fastingDays.length > 0 && (
        <div className="surface-card p-4 space-y-3">
          <p className="text-sm font-medium">آخر أيام الصيام:</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {fastingDays
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 10)
              .map((day) => {
                const typeInfo = FASTING_TYPES.find((t) => t.key === day.type);
                return (
                  <div
                    key={day.date}
                    className="flex items-center justify-between rounded-xl bg-secondary/50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn("size-2 rounded-full", typeInfo?.color)} />
                      <span className="text-sm">
                        {new Date(day.date).toLocaleDateString("ar-SA", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-xs text-muted-foreground">{typeInfo?.label}</span>
                    </div>
                    <button
                      onClick={() => removeFastingDay(day.date)}
                      className="text-xs text-destructive hover:underline"
                    >
                      حذف
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* يومنا الحالي */}
      <div
        className={cn(
          "surface-card flex items-center justify-between p-4",
          isTodayFasting && "border-primary bg-primary/5",
        )}
      >
        <div>
          <p className="font-medium">هل نصوم اليوم؟</p>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("ar-SA", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          {!isTodayFasting && (
            <>
              <button
                onClick={() => addFastingDay(new Date(), "sunnah")}
                className="press rounded-full bg-secondary px-4 py-2 text-xs font-medium"
              >
                نعم، صمت
              </button>
            </>
          )}
          {isTodayFasting && (
            <span className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs text-primary-foreground">
              <Check className="size-3" /> تم الصيام
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
