import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { QuranPageEnhanced } from "@/components/quran/QuranPageEnhanced";
import { motion } from "framer-motion";
import { BookOpen, Play, Star } from "lucide-react";
import { useLocalStorage } from "@/lib/use-local-storage";
import { toArabicNumber } from "@/lib/quran";

export const Route = createFileRoute("/quran/")({
  head: () => ({
    meta: [
      { title: "القرآن الكريم — أحلام الروح" },
      { name: "description", content: "تصفّح سور القرآن الكريم مع البحث في الآيات والعلامات المرجعية ومتابعة الختمة." },
      { property: "og:title", content: "القرآن الكريم — أحلام الروح" },
      { property: "og:description", content: "المصحف كاملًا مع التفسير الميسّر والبحث، يعمل بدون إنترنت." },
    ],
  }),
  component: QuranPage,
});

function QuranPage() {
  const [progress] = useLocalStorage<{ surah: number; ayah: number; readAyahs: number } | null>("islamic:progress", null);
  
  return (
    <AppShell title="القرآن الكريم" subtitle="١١٤ سورة · تفسير ميسّر">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl mb-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 size-48 rounded-full bg-white/5 blur-2xl" />
        </div>
        <div className="relative z-10 p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <BookOpen className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">القرآن الكريم</h2>
              <p className="text-sm text-white/80">114 سورة · 6236 آية</p>
            </div>
          </div>
          
          {/* Continue Reading Card */}
          {progress && progress.readAyahs > 0 && (
            <Link
              to="/quran/$surahId"
              params={{ surahId: String(progress.surah) }}
              className="block rounded-2xl bg-white/15 backdrop-blur-sm p-4 transition-all hover:bg-white/25"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
                  <Play className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">متابعة القراءة</p>
                  <p className="text-xs text-white/70">
                    {toArabicNumber(progress.readAyahs)} آية تم قراءتها
                  </p>
                </div>
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                  متابعة
                </span>
              </div>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <QuranPageEnhanced />
    </AppShell>
  );
}