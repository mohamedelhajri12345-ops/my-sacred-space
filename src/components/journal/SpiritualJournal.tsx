import { useMemo, useState } from "react";
import { NotebookPen, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/lib/use-local-storage";
import { haptic } from "@/lib/haptics";
import { formatHijri } from "@/lib/hijri";

export type JournalEntry = { id: string; text: string; at: number };

export function SpiritualJournal() {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>("islamic:journal", []);
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);

  const sorted = useMemo(() => [...entries].sort((a, b) => b.at - a.at), [entries]);

  const save = () => {
    const text = draft.trim();
    if (!text) return;
    haptic("success");
    setEntries([{ id: crypto.randomUUID(), text, at: Date.now() }, ...entries]);
    setDraft("");
    setOpen(false);
    toast.success("تم حفظ الخاطرة على جهازك");
  };

  const remove = (id: string) => {
    haptic("medium");
    setEntries(entries.filter((e) => e.id !== id));
    toast("تم الحذف");
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="surface-card glass-panel p-4">
        <p className="text-xs leading-6 text-muted-foreground">
          مساحتك الخاصة لتدوين الخواطر والأدعية والأهداف الإيمانية. كل ما تكتبه يُحفظ في متصفح جهازك فقط،
          بلا حساب وبلا مزامنة سحابية.
        </p>
      </div>

      {!open && (
        <button
          onClick={() => {
            haptic("light");
            setOpen(true);
          }}
          className="press gradient-warm flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-primary-foreground"
        >
          <Plus className="size-4" /> خاطرة جديدة
        </button>
      )}

      {open && (
        <div className="surface-card animate-rise space-y-3 p-4">
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={6}
            placeholder="اكتب دعاءك، أو ما استفدته اليوم، أو هدفًا إيمانيًا…"
            className="w-full resize-none rounded-xl border border-input bg-card p-3 text-sm leading-7 outline-none focus:border-[color-mix(in_oklab,var(--gold)_60%,transparent)]"
          />
          <div className="flex gap-2">
            <button onClick={save} className="press gradient-gold flex-1 rounded-xl py-2.5 text-sm font-bold text-gold-foreground">
              حفظ
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setDraft("");
              }}
              className="press flex size-10 items-center justify-center rounded-xl border border-border bg-card"
              aria-label="إلغاء"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="surface-card flex flex-col items-center gap-2 p-10 text-center">
          <NotebookPen className="size-8 text-accent" />
          <p className="text-sm font-bold">لا توجد خواطر بعد</p>
          <p className="text-xs text-muted-foreground">ابدأ بتدوين أول خاطرة إيمانية لك اليوم.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {sorted.map((e) => (
            <li key={e.id} className="surface-card p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[11px] text-muted-foreground">{formatHijri(new Date(e.at))}</span>
                <button
                  onClick={() => remove(e.id)}
                  aria-label="حذف الخاطرة"
                  className="press flex size-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-7">{e.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
