import { Link } from "@tanstack/react-router";
import { MapPin, MoonStar, Loader2, AlertCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useAdhanScheduler } from "@/hooks/use-adhan-scheduler";
import { useApp } from "@/lib/app-context";
import { formatCountdown, formatTime, DEFAULT_COORDS } from "@/lib/prayer";
import { formatHijri } from "@/lib/hijri";
import { cn } from "@/lib/utils";

export function NextPrayerCard() {
  const { coords: appCoords } = useApp();
  const { next, remaining, inKhushuWindow, now, isLoading, error } = useAdhanScheduler();

  const coords = appCoords?.latitude && appCoords?.longitude ? appCoords : DEFAULT_COORDS;

  if (isLoading) {
    return (
      <Link to="/prayer" className="block">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/90 to-teal p-6 text-white"
        >
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="size-8 animate-spin mb-3" />
            <p className="text-sm opacity-85">جارٍ تحميل مواقيت الصلاة...</p>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (error || !next) {
    return (
      <Link to="/prayer" className="block">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/90 to-teal p-6 text-white"
        >
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle className="size-8 mb-3" />
            <p className="text-sm opacity-85">تعذر حساب المواقيت</p>
            <p className="text-xs opacity-60 mt-1">جارٍ استخدام الإعدادات الافتراضية...</p>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link to="/prayer" className="block">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary to-teal p-6 text-white shadow-lg"
      >
        {/* خلفية زخرفية */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-12 -top-12 size-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-white/5 blur-2xl" />
        </div>
        
        <div className="relative">
          {/* العنوان */}
          <div className="flex items-center justify-between text-xs opacity-80">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" /> 
              <span className="hidden sm:inline">{coords?.label ?? "مكة المكرمة"}</span>
              <span className="sm:hidden">الموقع الحالي</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {formatHijri(now)}
            </span>
          </div>
          
          {/* معلومات الصلاة */}
          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="text-sm opacity-80 mb-1">الصلاة القادمة</p>
              <h2 className="text-4xl font-bold" style={{ fontFamily: 'Amiri, serif' }}>
                {next?.label ?? "..."}
              </h2>
            </div>
            <div className="text-left">
              <p className="text-lg font-semibold opacity-90">
                {next?.date ? formatTime(next.date) : "--:--"}
              </p>
            </div>
          </div>
          
          {/* العد التنازلي */}
          <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-white/10 py-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <CountdownDigit value={formatCountdown(remaining)} />
            </div>
          </div>
          
          {/* وضع الخشوع */}
          {inKhushuWindow && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-xs backdrop-blur"
            >
              <MoonStar className="size-4" />
              <span>وضع الخشوع مُفعّل — الإشعارات صامتة</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

function CountdownDigit({ value }: { value: string }) {
  // تحويل العد التنازلي إلى أرقام فردية
  const parts = value.split(':');
  
  return (
    <div className="flex items-center gap-1">
      {parts.map((part, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <span className="mx-1 text-lg">:</span>}
          <div className="flex flex-col items-center">
            <span className="font-mono text-3xl font-bold tracking-wider">{part}</span>
            <span className="text-[10px] opacity-60">
              {index === 0 ? 'ساعة' : index === 1 ? 'دقيقة' : 'ثانية'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}