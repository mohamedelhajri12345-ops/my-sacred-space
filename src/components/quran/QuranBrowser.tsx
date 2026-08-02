import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, BookMarked, Loader2, BookOpen } from "lucide-react";
import { loadQuran, searchQuran, toArabicNumber, type Bookmark, type ReadingProgress } from "@/lib/quran";
import { useLocalStorage } from "@/lib/use-local-storage";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

type Tab = "surahs" | "search" | "bookmarks";

export function QuranBrowser() {
  const [tab, setTab] = useState<Tab>("surahs");
  const [query, setQuery] = useState("");
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

  const tabs: { key: Tab; label: string }[] = [
    { key: "surahs", label: "السور" },
    { key: "search", label: "بحث" },
    { key: "bookmarks", label: "العلامات" },
  ];

  return (
    <div className="space-y-4">
      {progress && (
        <Link
          to="/quran/$surahId"
          params={{ surahId: String(progress.surah) }}
          className="press surface-card flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl gradient-warm text-primary-foreground">
              <BookOpen className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold">متابعة القراءة</p>
              <p className="text-[11px] text-muted-foreground">
                سورة {data?.find((s) => s.i === progress.surah)?.n ?? ""} — الآية {toArabicNumber(progress.ayah)}
              </p>
            </div>
          </div>
          <span className="text-xs text-accent">افتح</span>
        </Link>
      )}

      <div className="flex rounded-2xl bg-secondary p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              haptic("light");
              setTab(t.key);
            }}
            className={cn(
              "press flex-1 rounded-xl py-2 text-sm font-medium",
              tab === t.key ? "bg-card text-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> جارٍ تحميل المصحف…
        </div>
      )}
      {isError && <p className="py-10 text-center text-sm text-destructive">تعذّر تحميل المصحف</p>}

      {data && tab === "surahs" && (
        <ul className="space-y-2">
          {data.map((s) => (
            <li key={s.i}>
              <Link
                to="/quran/$surahId"
                params={{ surahId: String(s.i) }}
                onClick={() => haptic("light")}
                className="press surface-card flex items-center justify-between p-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-primary">
                    {toArabicNumber(s.i)}
                  </span>
                  <div>
                    <p className="font-display text-base font-bold">سورة {s.n}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {s.t === "meccan" ? "مكية" : "مدنية"} · {toArabicNumber(s.c)} آية
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground">{s.e}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {data && tab === "search" && (
        <div className="space-y-3">
          <div className="surface-card flex items-center gap-2 px-3.5 py-2.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في آيات القرآن…"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          {query.trim().length >= 2 && (
            <p className="text-[11px] text-muted-foreground">النتائج: {toArabicNumber(results.length)}</p>
          )}
          {results.map((hit) => (
            <Link
              key={`${hit.surah}-${hit.ayah}`}
              to="/quran/$surahId"
              params={{ surahId: String(hit.surah) }}
              search={{ ayah: hit.ayah }}
              className="press surface-card block p-4"
            >
              <p className="quran-text text-[1.3rem]">{hit.text}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">
                سورة {hit.surahName} — الآية {toArabicNumber(hit.ayah)}
              </p>
            </Link>
          ))}
        </div>
      )}

      {tab === "bookmarks" && (
        <div className="space-y-3">
          {bookmarks.length === 0 && (
            <div className="surface-card flex flex-col items-center gap-2 p-10 text-center text-muted-foreground">
              <BookMarked className="size-6" />
              <p className="text-sm">لا توجد علامات مرجعية بعد</p>
            </div>
          )}
          {bookmarks.map((b) => (
            <div key={`${b.surah}-${b.ayah}`} className="surface-card p-4">
              <Link to="/quran/$surahId" params={{ surahId: String(b.surah) }} search={{ ayah: b.ayah }}>
                <p className="quran-text text-[1.3rem]">{b.text}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  سورة {b.surahName} — الآية {toArabicNumber(b.ayah)}
                </p>
              </Link>
              <button
                onClick={() => {
                  haptic("warn");
                  setBookmarks(bookmarks.filter((x) => !(x.surah === b.surah && x.ayah === b.ayah)));
                }}
                className="press mt-2 text-[11px] text-destructive"
              >
                حذف العلامة
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}