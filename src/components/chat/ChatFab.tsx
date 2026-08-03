import { useEffect, useRef, useState } from "react";
import { Moon, Send, X, WifiOff, Info } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "ما فضل أذكار الصباح؟",
  "كيف أخشع في صلاتي؟",
  "اشرح لي معنى سورة الفاتحة",
  "دعاء للهمّ والحزن",
];

function mockReply(question: string) {
  return `هذا رد تجريبي مؤقت (لم يتم ربط الذكاء الاصطناعي بعد).\n\nسؤالك: «${question}»\n\nعند تفعيل الخدمة سيُجيبك مساعد إسلامي بإجابة مؤصّلة مع ذكر المصادر. وتذكّر دائمًا الرجوع إلى أهل العلم في المسائل الشرعية.`;
}

export function ChatFab() {
  const { online } = useApp();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "السلام عليكم ورحمة الله وبركاته\nأنا مساعدك الإسلامي. اسألني عن الأذكار أو التفسير أو آداب العبادة.\n\nتنبيه: هذه الميزة الوحيدة في التطبيق التي تحتاج اتصالًا بالإنترنت.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || thinking) return;
    haptic("medium");
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: value }]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", text: mockReply(value) }]);
      setThinking(false);
      inputRef.current?.focus();
    }, 900);
  };

  return (
    <>
      <button
        aria-label="محادثة إسلامية بالذكاء الاصطناعي"
        onClick={() => {
          haptic("medium");
          setOpen(true);
        }}
        className="press animate-soft-pulse fixed bottom-24 left-4 z-50 flex size-14 items-center justify-center rounded-full gradient-gold text-gold-foreground shadow-[var(--shadow-glow)]"
      >
        <Moon className="size-6 -rotate-12" />
        <span aria-hidden className="absolute -top-0.5 -left-0.5 size-2 rounded-full bg-primary" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 backdrop-blur-sm">
          <div className="animate-rise flex h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-base font-bold">المساعد الإسلامي</h2>
                <p className="text-[11px] text-muted-foreground">نسخة تجريبية — الردود مؤقتة</p>
              </div>
              <button
                aria-label="إغلاق"
                onClick={() => {
                  haptic("light");
                  setOpen(false);
                }}
                className="press flex size-9 items-center justify-center rounded-xl border border-border bg-card"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex items-start gap-2 border-b border-border bg-secondary/60 px-4 py-2 text-[11px] text-secondary-foreground">
              {online ? <Info className="mt-0.5 size-3.5 shrink-0" /> : <WifiOff className="mt-0.5 size-3.5 shrink-0" />}
              <p>
                {online
                  ? "هذه الميزة الوحيدة التي تحتاج اتصال إنترنت، أما باقي التطبيق فيعمل أوفلاين بالكامل."
                  : "أنت غير متصل بالإنترنت الآن. المحادثة تحتاج اتصالًا، وباقي التطبيق يعمل أوفلاين."}
              </p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex", m.role === "user" ? "justify-start" : "justify-end")}>
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-card-foreground",
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex justify-end">
                  <div className="rounded-2xl border border-border bg-card px-3.5 py-2.5 text-sm text-muted-foreground">
                    يكتب…
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="border-t border-border px-4 py-3">
              <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="press shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] text-muted-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-end gap-2"
              >
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder="اكتب سؤالك…"
                  className="max-h-28 flex-1 resize-none rounded-2xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  aria-label="إرسال"
                  className="press flex size-11 shrink-0 items-center justify-center rounded-2xl gradient-warm text-primary-foreground disabled:opacity-50"
                >
                  <Send className="size-4 -scale-x-100" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}