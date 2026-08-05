import { Link } from "@tanstack/react-router";
import { MapPin, MoonStar, Loader2, AlertCircle } from "lucide-react";
import { useAdhanScheduler } from "@/hooks/use-adhan-scheduler";
import { useApp } from "@/lib/app-context";
import { formatCountdown, formatTime, DEFAULT_COORDS } from "@/lib/prayer";
import { formatHijri } from "@/lib/hijri";

export function NextPrayerCard() {
  const { coords: appCoords } = useApp();
  const { next, remaining, inKhushuWindow, now, isLoading, error } = useAdhanScheduler();

  // استخدام الإعدادات الافتراضية إذا كانت الإحداثيات غير صالحة
  const coords = appCoords?.latitude && appCoords?.longitude ? appCoords : DEFAULT_COORDS;

  // حالة التحميل
  if (isLoading) {
    return (
      <Link to="/prayer" className="press animate-rise block">
        <div className="gradient-night relative overflow-hidden rounded-3xl p-5 text-cream" style={{ boxShadow: '0 12px 40px -12px rgba(0, 0, 0, 0.35), 0 0 20px rgba(212, 175, 55, 0.15)' }}>
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="size-8 animate-spin text-gold mb-3" />
            <p className="text-sm opacity-85">جارٍ تحميل مواقيت الصلاة...</p>
          </div>
        </div>
      </Link>
    );
  }

  // حالة الخطأ
  if (error || !next) {
    return (
      <Link to="/prayer" className="press animate-rise block">
        <div className="gradient-night relative overflow-hidden rounded-3xl p-5 text-cream" style={{ boxShadow: '0 12px 40px -12px rgba(0, 0, 0, 0.35), 0 0 20px rgba(212, 175, 55, 0.15)' }}>
          <div className="flex flex-col items-center justify-center py-4">
            <AlertCircle className="size-8 text-gold mb-3" />
            <p className="text-sm opacity-85">تعذر حساب المواقيت</p>
            <p className="text-xs opacity-60 mt-1">جارٍ استخدام الإعدادات الافتراضية...</p>
          </div>
        </div>
      </Link>
    );
  }

  // حالة النجاح - عرض بيانات الصلاة
  return (
    <Link to="/prayer" className="press animate-rise block">
      <div className="gradient-night relative overflow-hidden rounded-3xl p-5 text-cream" style={{ 
        boxShadow: '0 12px 40px -12px rgba(0, 0, 0, 0.35), 0 0 30px rgba(212, 175, 55, 0.2)',
        borderRadius: '16px'
      }}>
        <div className="absolute -left-8 -top-10 size-36 rounded-full bg-gold/20 blur-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between text-xs opacity-80">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" /> {coords?.label ?? "مكة المكرمة"}
            </span>
            <span>{formatHijri(now)}</span>
          </div>
          <p className="mt-4 text-sm opacity-85">الصلاة القادمة</p>
          <div className="mt-1 flex items-end justify-between">
            <h2 className="text-4xl font-bold text-gradient-gold drop-shadow-lg" style={{ fontFamily: 'Amiri, serif' }}>{next?.label ?? "..."}</h2>
            <span className="text-lg font-semibold drop-shadow-md">{next?.date ? formatTime(next.date) : "--:--"}</span>
          </div>
          <p className="mt-3 text-center font-mono text-3xl tracking-widest drop-shadow-md">
            {formatCountdown(remaining)}
          </p>
          {inKhushuWindow && (
            <p className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs">
              <MoonStar className="size-3.5" /> وضع الخشوع مُفعّل — الإشعارات صامتة الآن
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}