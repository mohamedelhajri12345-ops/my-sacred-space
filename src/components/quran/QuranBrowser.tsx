import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, BookMarked, Loader2, BookOpen, Sparkles, ChevronLeft, BookText, Play, X } from "lucide-react";
import { motion } from "framer-motion";
import { loadQuran, searchQuran, toArabicNumber, type Bookmark, type ReadingProgress } from "@/lib/quran";
import { useLocalStorage } from "@/lib/use-local-storage";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

type Tab = "surahs" | "search" | "bookmarks";

// تصنيفات السور
const SURAHS_BY_TYPE = {
  manzil1: { name: "المحمد", range: [1, 7] },
  manzil2: { name: "المحمد", range: [8, 15] },
  manzil3: { name: "المحمد", range: [16, 24] },
  manzil4: { name: "المحمد", range: [25, 32] },
  manzil5: { name: "المحمد", range: [33, 39] },
  manzil6: { name: "المحمد", range: [40, 46] },
  manzil7: { name: "المحمد", range: [47, 56] },
};

export function QuranBrowser() {
  const [tab, setTab] = useState<Tab>("surahs");
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>("islamic:bookmarks", []);
  const [progress] = useLocalStorage<ReadingProgress | null>("islamic:progress", null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["quran"],
    queryFn: loadQuran,
    staleTime: Infinity,
  });

  const results = useMemo(
    () => (data && tab === "search" ? searchQuran(data, query) : []),
    [data, query, tab],
  );

  const tabs: { key: Tab; label: string; icon: typeof BookOpen }[] = [
    { key: "surahs", label: "السور", icon: BookOpen },
    { key: "search", label: "بحث", icon: Search },
    { key: "bookmarks", label: "العلامات", icon: BookMarked },
  ];

  // تقسيم السور إلى مكية ومدنية
  const meccanSurahs = data?.filter(s => s.t === "meccan") ?? [];
  const medinanSurahs = data?.filter(s => s.t === "medinan") ?? [];

  return (
    <div className="space-y-4">
      {/* متابعة القراءة */}
      {progress && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/quran/$surahId"
            params={{ surahId: String(progress.surah) }}
            className="card-glass flex items-center justify-between rounded-2xl p-4 transition-all hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <Play className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold">متابعة القراءة</p>
                <p className="text-xs text-muted-foreground">
                  سورة {data?.find((s) => s.i === progress.surah)?.n ?? ""} — الآية {toArabicNumber(progress.ayah)}
                </p>
              </div>
            </div>
            <span className="text-xs text-primary font-medium">استمرار</span>
          </Link>
        </motion.div>
      )}

      {/* التبويبات */}
      <div className="card-glass flex rounded-2xl p-1.5">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => {
                haptic("light");
                setTab(t.key);
              }}
              className={cn(
                "press flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all",
                tab === t.key 
                  ? "bg-gradient-to-r from-primary to-teal text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* حالة التحميل */}
      {isLoading && (
        <motion.div 
          className="flex flex-col items-center justify-center gap-4 py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="size-10 text-primary" />
          </motion.div>
          <p className="text-sm text-muted-foreground">جارٍ تحميل المصحف الشريف...</p>
        </motion.div>
      )}
      {isError && (
        <motion.div 
          className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm text-destructive">تعذّر تحميل المصحف الشريف</p>
        </motion.div>
      )}

      {/* قائمة السور */}
      {data && tab === "surahs" && (
        <div className="space-y-6">
          {/* السور المكية */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--gold)]/15">
                <Sparkles className="size-4 text-[var(--gold)]" />
              </div>
              <h3 className="text-sm font-bold">السور المكية</h3>
              <span className="text-xs text-muted-foreground">({meccanSurahs.length} سورة)</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {meccanSurahs.map((s, index) => (
                <motion.div
                  key={s.i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Link
                    to="/quran/$surahId"
                    params={{ surahId: String(s.i) }}
                    onClick={() => haptic("light")}
                    className="card-glass group flex items-center justify-between rounded-2xl p-4 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-teal/20 text-primary">
                        <span className="text-sm font-bold">{toArabicNumber(s.i)}</span>
                      </div>
                      <div>
                        <p className="font-display text-base font-bold">{s.n}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.e} · {toArabicNumber(s.c)} آية
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-secondary/50 px-2.5 py-1 text-[10px] text-muted-foreground">
                        مكية
                      </span>
                      <ChevronLeft className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* السور المدنية */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15">
                <BookText className="size-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold">السور المدنية</h3>
              <span className="text-xs text-muted-foreground">({medinanSurahs.length} سورة)</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {medinanSurahs.map((s, index) => (
                <motion.div
                  key={s.i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Link
                    to="/quran/$surahId"
                    params={{ surahId: String(s.i) }}
                    onClick={() => haptic("light")}
                    className="card-glass group flex items-center justify-between rounded-2xl p-4 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 text-emerald-600">
                        <span className="text-sm font-bold">{toArabicNumber(s.i)}</span>
                      </div>
                      <div>
                        <p className="font-display text-base font-bold">{s.n}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.e} · {toArabicNumber(s.c)} آية
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-600">
                        مدنية
                      </span>
                      <ChevronLeft className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* البحث */}
      {data && tab === "search" && (
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className={cn(
            "card-glass flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all",
            searchFocused && "ring-2 ring-[var(--gold)]/50"
          )}>
            <Search className="size-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="ابحث في آيات القرآن الكريم..."
              className="flex-1 bg-transparent text-sm outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            )}
          </div>
          
          {query.trim().length >= 2 && (
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-muted-foreground">تم العثور على {toArabicNumber(results.length)} نتيجة</p>
            </div>
          )}
          
          <div className="space-y-2">
            {results.map((hit) => (
              <motion.div
                key={`${hit.surah}-${hit.ayah}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link
                  to="/quran/$surahId"
                  params={{ surahId: String(hit.surah) }}
                  search={{ ayah: hit.ayah }}
                  className="card-glass block rounded-2xl p-4 transition-all hover:shadow-lg"
                >
                  <p className="quran-text text-xl leading-loose">{hit.text}</p>
                  <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                      سورة {hit.surahName}
                    </span>
                    <span>الآية {toArabicNumber(hit.ayah)}</span>
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* العلامات المرجعية */}
      {tab === "bookmarks" && (
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {bookmarks.length === 0 && (
            <div className="card-glass flex flex-col items-center gap-3 rounded-2xl p-10 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-secondary/50">
                <BookMarked className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">لا توجد علامات مرجعية</p>
              <p className="text-xs text-muted-foreground">اضغط على أي آية في القرآن لإضافة علامة</p>
            </div>
          )}
          {bookmarks.map((b) => (
            <motion.div
              key={`${b.surah}-${b.ayah}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-glass rounded-2xl p-4"
            >
              <Link to="/quran/$surahId" params={{ surahId: String(b.surah) }} search={{ ayah: b.ayah }}>
                <p className="quran-text text-lg leading-loose">{b.text}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  سورة {b.surahName} — الآية {toArabicNumber(b.ayah)}
                </p>
              </Link>
              <button
                onClick={() => {
                  haptic("warn");
                  setBookmarks(bookmarks.filter((x) => !(x.surah === b.surah && x.ayah === b.ayah)));
                }}
                className="press mt-3 text-xs text-destructive"
              >
                حذف العلامة
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

