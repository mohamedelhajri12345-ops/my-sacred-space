import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { NextPrayerCard } from "@/components/prayer/NextPrayerCard";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { SpiritualStats } from "@/components/home/SpiritualStats";
import { upcomingEvents, formatGregorianAr } from "@/lib/hijri";
import { Star, Moon, BookOpen, Sparkles, Sun, Sunset } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

// آية اليوم
const AYAH_OF_DAY = {
  text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
  source: "سورة الرعد",
  verse: "28"
};

// خبر اليوم
const HADITH_OF_DAY = {
  text: "قال رسول الله ﷺ: إنَّ اللهَ تعالى يقول: أنا عندَ ظنِّ عبدي بي، وأنا معَه إذا ذكَرَني",
  source: "رواه البخاري ومسلم"
};

function HeroSection() {
  const hour = new Date().getHours();
  const today = new Date();
  
  const greeting = 
    hour < 5 ? { icon: Moon, text: "قيام مبارك", gradient: "from-indigo-500 to-purple-600" } :
    hour < 12 ? { icon: Sun, text: "صباح النور", gradient: "from-amber-400 to-orange-500" } :
    hour < 17 ? { icon: Sunset, text: "طاب نهارك", gradient: "from-amber-500 to-yellow-400" } :
    hour < 20 ? { icon: Sunset, text: "مساء الخير", gradient: "from-orange-500 to-amber-600" } :
    { icon: Moon, text: "طابت ليلتك", gradient: "from-indigo-600 to-purple-700" };
  
  const GreetingIcon = greeting.icon;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white"
      style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--teal) 50%, var(--sky) 100%)' }}
    >
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white" />
        <div className="absolute -bottom-5 -left-5 size-24 rounded-full bg-white" />
        <div className="absolute right-1/4 top-1/4 size-16 rounded-full bg-white" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="flex size-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur"
          >
            <GreetingIcon className="size-6" />
          </motion.div>
          <div>
            <p className="text-white/80 text-sm">{formatGregorianAr(today)}</p>
            <h2 className="text-2xl font-bold">{greeting.text}</h2>
          </div>
        </div>
        
        <div className="flex gap-3">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex-1 rounded-2xl bg-white/15 backdrop-blur p-4"
          >
            <p className="text-xs text-white/70 mb-1">آية اليوم</p>
            <p className="font-display text-lg leading-relaxed">{AYAH_OF_DAY.text}</p>
            <p className="text-xs text-white/60 mt-2">{AYAH_OF_DAY.source} — الآية {AYAH_OF_DAY.verse}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function QuickActions() {
  const actions = [
    { to: "/quran", icon: BookOpen, label: "القرآن الكريم", color: "bg-emerald-500" },
    { to: "/athkar", icon: Moon, label: "الأذكار", color: "bg-indigo-500" },
    { to: "/athkar/tasbih", icon: Sparkles, label: "السبحة", color: "bg-amber-500" },
    { to: "/journal", icon: Star, label: "المفكرة", color: "bg-rose-500" },
  ];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-4 gap-3"
    >
      {actions.map((action, index) => (
        <motion.div
          key={action.to}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          <Link
            to={action.to}
            className="group flex flex-col items-center gap-2 rounded-2xl bg-card p-4 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
          >
            <div className={cn(
              "flex size-12 items-center justify-center rounded-xl text-white shadow-lg transition-transform group-hover:scale-110",
              action.color
            )}>
              <action.icon className="size-5" />
            </div>
            <span className="text-xs font-medium">{action.label}</span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

function HadithCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-secondary/20 p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--gold)]/10">
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

function EventsSection() {
  const events = upcomingEvents(new Date(), 3);
  const today = new Date();
  
  if (events.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <Star className="size-4 text-[var(--gold)]" />
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
              className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--gold)]/10">
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

function Index() {
  return (
    <AppShell>
      <div className="space-y-5">
        <HeroSection />
        <NextPrayerCard />
        <QuickActions />
        <HadithCard />
        <EventsSection />
        <SpiritualStats />
        
        <div>
          <h2 className="mb-3 px-1 text-sm font-bold text-muted-foreground">الأقسام</h2>
          <FeatureGrid />
        </div>
        
        <div className="divider-geo" aria-hidden />
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-[var(--gold)]/20 bg-[var(--gold)]/5 p-5 text-center"
        >
          <p className="font-display text-lg leading-9 text-foreground/90">
            «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
          </p>
          <p className="mt-2 text-xs text-muted-foreground">سورة الرعد — الآية ٢٨</p>
        </motion.div>
      </div>
    </AppShell>
  );
}
