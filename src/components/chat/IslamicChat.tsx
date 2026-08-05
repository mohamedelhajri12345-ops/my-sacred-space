/**
 * واجهة المحادثة الإسلامية المتكاملة
 * مساعد مفتٍ ومرشد مع مصادر ومراجع
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { 
  Moon, 
  Send, 
  X, 
  WifiOff, 
  Info, 
  BookOpen, 
  Quote, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { useApp } from "@/lib/app-context";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { getIslamicAnswer, formatSources, type Source } from "@/lib/islamic-ai";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
  relatedTopics?: string[];
  isStreaming?: boolean;
  error?: boolean;
};

const SUGGESTIONS = [
  "ما فضل أذكار الصباح؟",
  "كيف أصلي بطريقة صحيحة؟",
  "ما هو الوضوء؟",
  "دعاء للهمّ والحزن",
  "ما هي أركان الإسلام؟",
  "ما فضل قراءة القرآن؟",
  "ما هي شروط التوبة؟",
  "كيف أتوب توبة نصوح؟",
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
  const [expanded, setExpanded] useState(false);
  
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
                {source.type === "general" && "معلومة"}
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

function IslamicChatHeader({ onClose }: { onClose: () => void }) {
  return (
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
            مفتٍ ومرشد شرعي
          </p>
        </div>
      </div>
      <button
        aria-label="إغلاق"
        onClick={onClose}
        className="press flex size-9 items-center justify-center rounded-xl border border-border/50 bg-card/80 backdrop-blur"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function InfoBanner({ online }: { online: boolean }) {
  return (
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
  );
}

function FooterDisclaimer() {
  return (
    <div className="mt-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--gold)]/10 p-3">
      <p className="flex items-center gap-2 text-center text-[11px] leading-relaxed text-muted-foreground">
        <AlertTriangle className="size-3.5 shrink-0 text-[var(--gold)]" />
        <span>
          تنبيه مهم: هذه الإجابات مُخصصة لأغراض تعليمية ولا تغني عن استفتاء أهل العلم المختصين.
        </span>
      </p>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div
      className={cn("flex", message.role === "user" ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed",
          message.role === "user"
            ? "gradient-spiritual text-primary-foreground"
            : message.error 
              ? "border border-red-500/30 bg-red-500/10 text-destructive"
              : "border border-border bg-card text-card-foreground shadow-[var(--shadow-soft)]"
        )}
      >
        {message.role === "assistant" && !message.error && (
          <div className="mb-2 flex items-center gap-2 border-b border-border/50 pb-2">
            <Moon className="size-4 text-[var(--gold)]" />
            <span className="text-[10px] font-medium text-[var(--gold)]">المساعد الإسلامي</span>
            {message.isStreaming && (
              <RefreshCw className="size-3 animate-spin text-[var(--gold)]" />
            )}
          </div>
        )}
        <div className="whitespace-pre-wrap text-sm">{message.text}</div>
        {!message.error && message.sources && message.sources.length > 0 && (
          <SourcesSection sources={message.sources} />
        )}
        {!message.error && message.relatedTopics && (
          <RelatedTopics topics={message.relatedTopics} />
        )}
      </div>
    </div>
  );
}

export function IslamicChat() {
  const { online } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: `السلام عليكم ورحمة الله وبركاته 🌙

أهلاً بك في مساعدك الإسلامي الموثوق.

**أنا هنا لمساعدتك في:**
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
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const answerLocally = useCallback((question: string, note?: string) => {
    const response = getIslamicAnswer(question);
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
  }, []);

  const sendMessage = async (text: string) => {
    const value = text.trim();
    if (!value || isLoading) return;
    haptic("medium");

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: value,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    if (!online) {
      answerLocally(value, "🔌 أنت غير متصل بالإنترنت، وهذه إجابة من قاعدة المعرفة المحفوظة داخل التطبيق:");
      setIsLoading(false);
      return;
    }

    const assistantMessageId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, role: "assistant", text: "", isStreaming: true },
    ]);

    try {
      abortControllerRef.current = new AbortController();
      
      const history = messages
        .filter((m) => m.id !== "welcome" && !m.isStreaming)
        .map((m) => ({
          role: m.role as "user" | "assistant",
          parts: [{ type: "text" as const, text: m.text }],
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...history,
            { id: userMessage.id, role: "user", parts: [{ type: "text", text: value }] },
          ],
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const errorMsg = res.status === 429 
          ? "كثرة الطلبات، انتظر قليلًا ثم أعد المحاولة."
          : res.status === 402 
            ? "انتهى رصيد الذكاء الاصطناعي لهذا التطبيق."
            : "تعذّر الاتصال بالمساعد.";
        throw new Error(errorMsg);
      }

      haptic("success");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { value: chunk, done } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(chunk, { stream: true });
        acc += chunkText;
        
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId ? { ...m, text: acc } : m
          )
        );
      }

      if (!acc.trim()) {
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
        answerLocally(value);
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId ? { ...m, isStreaming: false } : m
          )
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ.";
      
      if (errorMessage.includes("abort")) {
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
        return;
      }
      
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                id: assistantMessageId,
                role: "assistant",
                text: `⚠️ ${errorMessage}\nإليك إجابة من قاعدة المعرفة المحفوظة:`,
                error: true,
              }
            : m
        )
      );
      
      if (!errorMessage.includes("429") && !errorMessage.includes("402")) {
        setTimeout(() => {
          setMessages((prev) => {
            const currentMsg = prev.find((m) => m.id === assistantMessageId);
            if (currentMsg && !currentMsg.sources) {
              answerLocally(value);
            }
            return prev;
          });
        }, 500);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      inputRef.current?.focus();
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setMessages((prev) =>
        prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
      );
    }
  };

  return (
    <>
      {/* زر FAB */}
      <button
        aria-label="محادثة إسلامية بالذكاء الاصطناعي"
        onClick={() => {
          haptic("medium");
          setIsOpen(true);
        }}
        className="press animate-soft-pulse fixed bottom-24 right-4 z-50 flex size-14 items-center justify-center rounded-full gradient-gold text-gold-foreground"
        style={{ boxShadow: '0 8px 32px -8px rgba(212, 175, 55, 0.6), 0 0 40px rgba(212, 175, 55, 0.3)' }}
      >
        <div className="relative">
          <Moon className="size-6 -rotate-12" />
          <Sparkles className="absolute -right-1 -top-1 size-3 animate-pulse text-primary" />
        </div>
        <span aria-hidden className="absolute -top-0.5 -left-0.5 size-2 rounded-full bg-primary" />
      </button>

      {/* نافذة الشات */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 backdrop-blur-sm">
          <div className="animate-rise flex h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-border bg-background">
            <IslamicChatHeader onClose={() => setIsOpen(false)} />
            <InfoBanner online={online} />

            {/* الرسائل */}
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={endRef} />
            </div>

            {/* منطقة الإدخال */}
            <div className="border-t border-border bg-card/95 backdrop-blur px-4 py-3">
              {/* الاقتراحات */}
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void sendMessage(s)}
                    className="press shrink-0 rounded-full border border-border/50 bg-secondary/50 px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-secondary/80"
                  >
                    {s}
                  </button>
                ))}
              </div>
              
              {/* نموذج الإدخال */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendMessage(input);
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
                      void sendMessage(input);
                    }
                  }}
                  placeholder="اكتب سؤالك هنا..."
                  className="max-h-28 flex-1 resize-none rounded-2xl border border-border/50 bg-secondary/30 px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--gold)]/50 focus:ring-2 focus:ring-[var(--gold)]/20"
                />
                {isLoading ? (
                  <button
                    type="button"
                    onClick={stopGeneration}
                    aria-label="إيقاف"
                    className="press flex size-12 items-center justify-center rounded-2xl bg-red-500 text-white transition-all hover:bg-red-600"
                  >
                    <X className="size-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    aria-label="إرسال"
                    className={cn(
                      "press flex size-12 items-center justify-center rounded-2xl transition-all",
                      input.trim()
                        ? "gradient-gold text-gold-foreground shadow-[var(--shadow-glow)]"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    <Send className="size-5 -scale-x-100" />
                  </button>
                )}
              </form>
              
              <FooterDisclaimer />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
