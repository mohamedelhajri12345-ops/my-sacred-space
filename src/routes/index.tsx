import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { NextPrayerCard } from "@/components/prayer/NextPrayerCard";
import { upcomingEvents, formatGregorianAr, formatHijri } from "@/lib/hijri";
import { Star, Moon, BookOpen, Sparkles, Sun, Sunset, SunMoon, Compass, Calendar, Library, HandHeart, Play, Pause, ChevronLeft, Waves, Flame, Prayer, Mosque } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useEffect, useState, useMemo } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Sacred Space — رفيقك اليومي في العبادة" },
      {
        name: "description",
        content: "تطبيق إسلامي شامل: القرآن والتفسير، الأذكار والمسبحة، مواقيت الصلاة، القبلة والتقويم الهجري.",
      },
      { property: "og:title", content: "My Sacred Space" },
      { property: "og:description", content: "رفيقك اليومي في العبادة" },
    ],
  }),
  component: Index,
});

const AYAH_OF_DAY = {
  text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
  source: "سورة الرعد",
  verse: "28"
};

const HADITH_OF_DAY = {
  text: "قال رسول الله ﷺ: إنَّ اللهَ تعالى يقول: أنا عندَ ظنِّ عبدي بي، وأنا معَه إذا ذكَرَني",
  source: "رواه البخاري ومسلم"
};

function GreetingSection() {
  const hour = new Date().getHours();
  const today = new Date();
  
  const greeting = hour < 5 
    ? { icon: Moon, text: "قيام مبارك", gradient: "from-indigo-600 via-purple-600 to-indigo-700", emoji: "🌙" }
    : hour < 12 
    ? { icon: Sun, text: "صباح النور", gradient: "from-amber-400 via-orange-400 to-amber-500", emoji: "☀️" }
    : hour < 17 
    ? { icon: SunMoon, text: "طاب نهارك", gradient: "from-orange-400 via-amber-400 to-yellow-400", emoji: "🌤️" }
    : hour < 20 
    ? { icon: Sunset, text: "مساء الخير", gradient: "from-orange-500 via-amber-500 to-orange-600", emoji: "🌅" }
    : { icon: Moon, text: "طابت ليلتك", gradient: "from-indigo-700 via-purple-700 to-indigo-800", emoji: "🌙" };
  
  const GreetingIcon = greeting.icon;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl"
    >
      {/* Background with gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br p-6 text-white",
        greeting.gradient
      )} />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-12 -top-12 size-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-1/3 top-1/4 size-20 rounded-full bg-white/5 blur-xl" />
        {/* Decorative circles */}
        <div className="absolute right-8 top-8 size-16 rounded-full border border-white/10" />
        <div className="absolute left-4 bottom-12 size-12 rounded-full border border-white/5" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-5">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex size-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md"
          >
            <GreetingIcon className="size-7" />
          </motion.div>
          <div>
            <p className="text-white/80 text-sm font-medium">{formatHijri(today)}</p>
            <h2 className="text-2xl font-bold">{greeting.text}</h2>
          </div>
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl bg-white/15 backdrop-blur-md p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="size-4 text-white/70" />
            <p className="text-xs text-white/70">آية اليوم</p>
          </div>
          <p className="font-display text-xl leading-relaxed">{AYAH_OF_DAY.text}</p>
          <p className="text-xs text-white/60 mt-3">{AYAH_OF_DAY.source} — الآية {AYAH_OF_DAY.verse}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function QuickActions() {
  const actions = [
    { to: "/quran", icon: BookOpen, label: "القرآن", gradient: "from-emerald-500 to-emerald-600", emoji: "📖" },
    { to: "/athkar", icon: Moon, label: "الأذكار", gradient: "from-violet-500 to-purple-600", emoji: "🤲" },
    { to: "/athkar/tasbih", icon: Sparkles, label: "السبحة", gradient: "from-amber-500 to-orange-500", emoji: "✨" },
    { to: "/prayer", icon: Compass, label: "الصلاة", gradient: "from-sky-500 to-blue-500", emoji: "🕌" },
  ];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Sparkles className="size-4 text-[var(--gold)]" />
        الوصول السريع
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.to}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + index * 0.05, type: "spring", stiffness: 300 }}
          >
            <Link
              to={action.to}
              className="group flex flex-col items-center gap-2.5 rounded-2xl bg-card p-3.5 text-center transition-all hover:shadow-lg hover:-translate-y-1.5 border border-border/50"
            >
              <div className={cn(
                "flex size-12 items-center justify-center rounded-xl text-white shadow-lg transition-transform group-hover:scale-110",
                action.gradient
              )}>
                <action.icon className="size-5" />
              </div>
              <span className="text-xs font-medium">{action.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function MoreActions() {
  const actions = [
    { to: "/library", icon: Library, label: "المكتبة", gradient: "from-rose-500 to-pink-500", desc: "الأناشيد والكتب" },
    { to: "/calendar", icon: Calendar, label: "التقويم", gradient: "from-teal-500 to-cyan-500", desc: "المناسبات الإسلامية" },
    { to: "/qibla", icon: Compass, label: "القبلة", gradient: "from-indigo-500 to-blue-500", desc: "اتجاه القبلة" },
    { to: "/journal", icon: Star, label: "المفكرة", gradient: "from-amber-500 to-yellow-500", desc: "تتبع العبادات" },
  ];
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Waves className="size-4 text-[var(--gold)]" />
        المزيد
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.to}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + index * 0.05 }}
          >
            <Link
              to={action.to}
              className="group flex items-center gap-3 rounded-2xl bg-card p-4 transition-all hover:shadow-md hover:-translate-y-0.5 border border-border/50"
            >
              <div className={cn("flex size-11 items-center justify-center rounded-xl text-white shadow-md", action.gradient)}>
                <action.icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium block">{action.label}</span>
                <span className="text-[10px] text-muted-foreground block truncate">{action.desc}</span>
              </div>
              <ChevronLeft className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function HadithCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card-glass rounded-2xl p-5 border border-[var(--gold)]/20"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--gold)]/15">
          <Sparkles className="size-4 text-[var(--gold)]" />
        </div>
        <span className="text-sm font-semibold">حديث اليوم</span>
      </div>
      <p className="font-display text-base leading-relaxed text-foreground/90">
        {HADITH_OF_DAY.text}
      </p>
      <p className="mt-3 text-xs text-muted-foreground">{HADITH_OF_DAY.source}</p>
    </motion.div>
  );
}

function ContinueReading() {
  const [progress] = useLocalStorage<{ surah: number; ayah: number } | null>("islamic:progress", null);
  
  if (!progress) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
    >
      <Link
        to="/quran/$surahId"
        params={{ surahId: String(progress.surah) }}
        className="card-glass flex items-center justify-between rounded-2xl p-4 transition-all hover:shadow-lg border border-emerald-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <Play className="size-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">متابعة القراءة</p>
            <p className="text-xs text-muted-foreground">اضغط للمتابعة</p>
          </div>
        </div>
        <span className="text-xs text-primary font-medium flex items-center gap-1">
          استمرار
          <ChevronLeft className="size-3" />
        </span>
      </Link>
    </motion.div>
  );
}

function EventsSection() {
  const events = upcomingEvents(new Date(), 3);
  const today = new Date();
  
  if (events.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <Calendar className="size-4 text-[var(--gold)]" />
        <h3 className="text-sm font-bold">المناسبات القادمة</h3>
      </div>
      
      <div className="space-y-2">
        {events.slice(0, 2).map(({ event, date }) => {
          const daysUntil = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const isToday = daysUntil === 0;
          const isTomorrow = daysUntil === 1;
          
          return (
            <motion.div
              key={`${event.hm}-${event.hd}`}
              whileHover={{ scale: 1.01 }}
              className="card-glass flex items-center justify-between rounded-2xl p-4 transition-shadow border border-[var(--gold)]/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--gold)]/15">
                  <Star className="size-5 text-[var(--gold)]" />
                </div>
                <div>
                  <p className="font-medium">{event.name}</p>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-primary">
                  {isToday ? "اليوم" : isTomorrow ? "غداً" : `بعد ${daysUntil} يوم`}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {date.toLocaleDateString("ar-SA", { month: "short", day: "numeric" })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function InspirationalQuote() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="card-glass rounded-2xl p-5 text-center border border-[var(--gold)]/20"
    >
      <div className="mb-3 flex justify-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-[var(--gold)]/15">
          <Moon className="size-5 text-[var(--gold)]" />
        </div>
      </div>
      <p className="font-display text-lg leading-9 text-foreground/90">
        «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
      </p>
      <p className="mt-2 text-xs text-muted-foreground">سورة الرعد — الآية ٢٨</p>
    </motion.div>
  );
}

// Stats Section
function StatsSection() {
  const [progress] = useLocalStorage<{ readAyahs: number } | null>("islamic:progress", null);
  const [streak] = useLocalStorage<{ count: number; totalSessions: number }>("islamic:streak", { count: 0, lastDay: "", totalSessions: 0 });
  
  const stats = useMemo(() => [
    { label: "آيات القرآن", value: progress?.readAyahs || 0, icon: BookOpen, color: "text-emerald-500" },
    { label: "أيام متتالية", value: streak.count, icon: Flame, color: "text-amber-500" },
    { label: "الجلسات", value: streak.totalSessions, icon: Sparkles, color: "text-violet-500" },
  ], [progress, streak]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="grid grid-cols-3 gap-3"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + index * 0.05 }}
          className="card-glass rounded-2xl p-4 text-center border border-border/50"
        >
          <stat.icon className={cn("size-5 mx-auto mb-2", stat.color)} />
          <p className="text-xl font-bold">{stat.value}</p>
          <p className="text-[10px] text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

function Index() {
  return (
    <AppShell>
      <div className="space-y-5">
        <GreetingSection />
        <NextPrayerCard />
        <QuickActions />
        <ContinueReading />
        <StatsSection />
        <HadithCard />
        <MoreActions />
        <EventsSection />
        <InspirationalQuote />
      </div>
    </AppShell>
  );
}
