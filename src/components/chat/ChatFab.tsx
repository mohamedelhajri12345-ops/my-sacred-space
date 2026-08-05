import { useEffect, useRef, useState } from "react";
import { Moon, Send, X, WifiOff, Info, BookOpen, Quote, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { getIslamicAnswer, formatSources, type Source } from "@/lib/islamic-ai";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources?: Source[] | undefined;
  relatedTopics?: string[] | undefined;
};

const SUGGESTIONS = [
  "ما فضل أذكار الصباح؟",
  "كيف أصلي بطريقة صحيحة؟",
  "ما هو الوضوء؟",
  "دعاء للهمّ والحزن",
  "ما هي أركان الإسلام؟",
  "ما فضل قراءة القرآن؟",
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex items-center gap-1 rounded-2xl border border-border bg-card px-4 py-3">
        <div className="flex gap-1">
          <span className="size-2 rounded-full bg-[var(--gold)] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="size-2 rounded-full bg-[var(--gold)] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="size-2 rounded-full bg-[var(--gold)] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

function SourcesSection({ sources }: { sources: Source[] }) {
  const [expanded, setExpanded] = useState(false);
  
  if (sources.length === 0) return null;
  
  return (
    <div className="mt-3 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-xs font-medium text-[var(--gold)]"
      >
        <span className="flex items-center gap-1.5">
          <Quote className="size-3.5" />
          المصادر والمراجع
        </span>
        {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </button>
      {expanded && (
        <div className="mt-2 space-y-2">
          {sources.map((source, i) => (
            <div key={i} className="text-[11px]">
              <span className={cn(
                "inline-block rounded px-1.5 py-0.5 text-[10px] font-medium",
                source.type === "quran" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                source.type === "hadith" && "bg-[var(--gold)]/20 text-[var(--gold)]",
                source.type === "scholar" && "bg-primary/10 text-primary"
              )}>
                {source.type === "quran" && "قرآن"}
                {source.type === "hadith" && "حديث"}
                {source.type === "scholar" && "مصدر"}
              </span>
              <p className="mt-1 leading-relaxed text-muted-foreground">{source.text}</p>
              <p className="mt-0.5 font-medium text-foreground/80">{source.reference}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RelatedTopics({ topics }: { topics?: string[] }) {
  if (!topics || topics.length === 0) return null;
  
  return (
    <div className="mt-3">
      <p className="mb-2 text-[11px] text-muted-foreground">مواضيع ذات صلة:</p>
      <div className="flex flex-wrap gap-1.5">
        {topics.map((topic, i) => (
          <span
            key={i}
            className="rounded-full bg-secondary/80 px-2.5 py-1 text-[10px] text-secondary-foreground"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
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
      text: `السلام عليكم ورحمة الله وبركاته 🌙

أنا مساعدك الإسلامي في تطبيق نُور، يسعدني مساعدتك في:

📖 أسئلة دينية والعقيدة
🕌 أحكام الصلاة والطهارة  
📿 الأذكار والأدعية
📚 تفسير القرآن والسنة
💡 مواضيع إسلامية عامة

⚠️ تنبيه: هذه الميزة تحتاج اتصالًا بالإنترنت.`,
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

  const answerLocally = (value: string, note?: string) => {
    const response = getIslamicAnswer(value);
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text: note ? `${note}\n\n${response.answer}` : response.answer,
        sources: response.sources,
        relatedTopics: response.relatedTopics,
      },
    ]);
  };

  const send = async (text: string) => {
    const value = text.trim();
    if (!value || thinking) return;
    haptic("medium");

    const history = [...messages.filter((m) => m.id !== "welcome"), {
      id: crypto.randomUUID(),
      role: "user" as const,
      text: value,
    }];
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: value }]);
    setInput("");
    setThinking(true);

    if (!online) {
      answerLocally(value, "🔌 أنت غير متصل بالإنترنت، وهذه إجابة من قاعدة المعرفة المحفوظة داخل التطبيق:");
      setThinking(false);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({
            id: m.id,
            role: m.role,
            parts: [{ type: "text", text: m.text }],
          })),
        }),
      });

      if (!res.ok || !res.body) {
        if (res.status === 429) throw new Error("كثرة الطلبات، انتظر قليلًا ثم أعد المحاولة.");
        if (res.status === 402) throw new Error("انتهى رصيد الذكاء الاصطناعي لهذا التطبيق.");
        throw new Error("تعذّر الاتصال بالمساعد.");
      }

      const id = crypto.randomUUID();
      setMessages((prev) => [...prev, { id, role: "assistant", text: "" }]);
      setThinking(false);
      haptic("success");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value: chunk, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(chunk, { stream: true });
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: acc } : m)));
      }
      if (!acc.trim()) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        answerLocally(value);
      }
    } catch (error) {
      const note = error instanceof Error ? `⚠️ ${error.message}` : "⚠️ حدث خطأ.";
      answerLocally(value, `${note}\nإليك إجابة من قاعدة المعرفة المحفوظة:`);
    } finally {
      setThinking(false);
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <button
        aria-label="محادثة إسلامية بالذكاء الاصطناعي"
        onClick={() => {
          haptic("medium");
          setOpen(true);
        }}
        className="press animate-soft-pulse fixed bottom-24 left-4 z-50 flex size-14 items-center justify-center rounded-full gradient-gold text-gold-foreground"
        style={{ boxShadow: '0 8px 32px -8px rgba(212, 175, 55, 0.6), 0 0 40px rgba(212, 175, 55, 0.3)' }}
      >
        <div className="relative">
          <Moon className="size-6 -rotate-12" />
          <Sparkles className="absolute -right-1 -top-1 size-3 animate-pulse text-primary" />
        </div>
        <span aria-hidden className="absolute -top-0.5 -left-0.5 size-2 rounded-full bg-primary" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 backdrop-blur-sm">
          <div className="animate-rise flex h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-border bg-background">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3 gradient-spiritual">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-[var(--gold)]/20">
                  <Moon className="size-5 text-[var(--gold)]" />
                </div>
                <div>
                  <h2 className="text-base font-bold">المساعد الإسلامي</h2>
                  <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-green-500" />
                    </span>
                    يعمل بالذكاء الاصطناعي
                  </p>
                </div>
              </div>
              <button
                aria-label="إغلاق"
                onClick={() => {
                  haptic("light");
                  setOpen(false);
                }}
                className="press flex size-9 items-center justify-center rounded-xl border border-border/50 bg-card/80 backdrop-blur"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Info Banner */}
            <div className="flex items-start gap-2 border-b border-border bg-[var(--gold)]/10 px-4 py-2.5 text-[11px]">
              {online ? (
                <Info className="mt-0.5 size-3.5 shrink-0 text-green-600" />
              ) : (
                <WifiOff className="mt-0.5 size-3.5 shrink-0 text-destructive" />
              )}
              <p className="text-muted-foreground">
                {online
                  ? "اسألني عن أي موضوع إسلامي وسأجيبك مع ذكر المصادر. تذكّر دائمًا الرجوع لأهل العلم في الفتاوى."
                  : "غير متصل بالإنترنت. المحادثة تحتاج اتصالًا، وباقي التطبيق يعمل أوفلاين."}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn("flex", m.role === "user" ? "justify-start" : "justify-end")}
                >
                  <div
                    className={cn(
                      "max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed",
                      m.role === "user"
                        ? "gradient-spiritual text-primary-foreground"
                        : "border border-border bg-card text-card-foreground shadow-[var(--shadow-soft)]"
                    )}
                  >
                    {m.role === "assistant" && (
                      <div className="mb-2 flex items-center gap-2 border-b border-border/50 pb-2">
                        <Moon className="size-4 text-[var(--gold)]" />
                        <span className="text-[10px] font-medium text-[var(--gold)]">المساعد الإسلامي</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-sm">{m.text}</div>
                    {m.role === "assistant" && m.sources && m.sources.length > 0 && (
                      <SourcesSection sources={m.sources} />
                    )}
                    {m.role === "assistant" && m.relatedTopics && (
                      <RelatedTopics topics={m.relatedTopics} />
                    )}
                  </div>
                </div>
              ))}
              {thinking && <TypingIndicator />}
              <div ref={endRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border bg-card/95 backdrop-blur px-4 py-3">
              {/* Suggestions */}
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="press shrink-0 rounded-full border border-border/50 bg-secondary/50 px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-secondary/80"
                  >
                    {s}
                  </button>
                ))}
              </div>
              
              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void send(input);
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
                      void send(input);
                    }
                  }}
                  placeholder="اكتب سؤالك هنا..."
                  className="max-h-28 flex-1 resize-none rounded-2xl border border-border/50 bg-secondary/30 px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--gold)]/50 focus:ring-2 focus:ring-[var(--gold)]/20"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  aria-label="إرسال"
                  className={cn(
                    "press flex size-12 items-center justify-center rounded-2xl transition-all",
                    input.trim() && !thinking
                      ? "gradient-gold text-gold-foreground shadow-[var(--shadow-glow)]"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  <Send className="size-5 -scale-x-100" />
                </button>
              </form>
              
              {/* Footer hint */}
              <div className="mt-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--gold)]/10 p-3">
                <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                  ⚠️ تنبيه مهم: هذه الإجابات مُخصصة لأغراض تعليمية ولا تغني عن استفتاء أهل العلم المختصين. يُرجى دائمًا التحقق من المعلومات الشرعية من المصادر الموثوقة.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}