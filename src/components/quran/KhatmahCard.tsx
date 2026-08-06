import React, { useRef, useState } from "react";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { loadQuran, toArabicNumber, TOTAL_AYAHS, type ReadingProgress } from "@/lib/quran";
import { useLocalStorage } from "@/lib/use-local-storage";
import { formatHijri } from "@/lib/hijri";
import { haptic } from "@/lib/haptics";
import { Stepper, StepContent, StepNavigation } from "@/components/ui/stepper";

/** رسم بطاقة الختمة على canvas لتنزيلها كصورة PNG. */
function drawCard(canvas: HTMLCanvasElement, opts: { percent: number; surahName: string; ayah: number; hijri: string }) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = (canvas.width = 1080);
  const H = (canvas.height = 1080);

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#123a33");
  grad.addColorStop(1, "#0a2a35");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // زخرفة نجمية خفيفة
  ctx.strokeStyle = "rgba(212,175,102,0.16)";
  ctx.lineWidth = 3;
  for (let r = 120; r < 900; r += 90) {
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // إطار
  ctx.strokeStyle = "rgba(212,175,102,0.75)";
  ctx.lineWidth = 6;
  ctx.strokeRect(50, 50, W - 100, H - 100);

  ctx.textAlign = "center";
  ctx.fillStyle = "#d4af66";
  ctx.font = "bold 52px Amiri, serif";
  ctx.fillText("تقدّمي في ختم القرآن", W / 2, 200);

  // حلقة التقدم
  const cx = W / 2;
  const cy = 560;
  const radius = 200;
  ctx.lineWidth = 34;
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#d4af66";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * opts.percent) / 100);
  ctx.stroke();

  ctx.fillStyle = "#fdf8ef";
  ctx.font = "bold 120px Tajawal, sans-serif";
  ctx.fillText(`${Math.round(opts.percent)}%`, cx, cy + 40);

  ctx.font = "40px Amiri, serif";
  ctx.fillStyle = "#e9dcc3";
  ctx.fillText(`آخر قراءة: سورة ${opts.surahName} — آية ${opts.ayah}`, W / 2, 860);
  ctx.font = "32px Tajawal, sans-serif";
  ctx.fillStyle = "rgba(233,220,195,0.75)";
  ctx.fillText(opts.hijri, W / 2, 920);
  ctx.fillStyle = "#d4af66";
  ctx.font = "bold 36px Amiri, serif";
  ctx.fillText("تطبيق نور", W / 2, 990);
}

export function KhatmahCard() {
  const [progress] = useLocalStorage<ReadingProgress | null>("islamic:progress", null);
  const { data } = useQuery({ queryKey: ["quran"], queryFn: loadQuran, staleTime: Infinity });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);

  const read = progress?.readAyahs ?? 0;
  const percent = Math.min(100, (read / TOTAL_AYAHS) * 100);
  const surahName = data?.find((s) => s.i === progress?.surah)?.n ?? "الفاتحة";
  const ayah = progress?.ayah ?? 0;

  // تحديد المرحلة الحالية بناءً على نسبة الإنجاز
  const determineStage = (pct: number): number => {
    if (pct === 0) return 0;
    if (pct < 25) return 1;
    if (pct < 50) return 2;
    if (pct < 75) return 3;
    if (pct < 100) return 4;
    return 5;
  };

  // مزامنة المرحلة مع نسبة الإنجاز
  React.useEffect(() => {
    const stage = determineStage(percent);
    setCurrentStage(stage);
  }, [percent]);

  const steps = [
    { id: "start", label: "البداية", description: "ابدأ رحلتك" },
    { id: "quarter", label: "الربع الأول", description: "25٪" },
    { id: "half", label: "النصف", description: "50٪" },
    { id: "three-quarter", label: "الثلاثة أرباع", description: "75٪" },
    { id: "almost", label: "اقتربت", description: "90٪" },
    { id: "complete", label: "الختمة", description: "100٪" },
  ];

  const build = () => {
    const canvas = canvasRef.current ?? document.createElement("canvas");
    canvasRef.current = canvas;
    drawCard(canvas, { percent, surahName, ayah, hijri: formatHijri(new Date()) });
    return canvas;
  };

  const download = async () => {
    haptic("success");
    setBusy(true);
    try {
      const canvas = build();
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
      if (!blob) throw new Error("failed");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "khatmah.png";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("تم تنزيل بطاقة الختمة");
    } catch {
      toast.error("تعذّر إنشاء الصورة");
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    haptic("medium");
    try {
      const canvas = build();
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
      if (!blob) throw new Error("failed");
      const file = new File([blob], "khatmah.png", { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "تقدّمي في ختم القرآن" });
      } else {
        await download();
      }
    } catch {
      /* المستخدم ألغى المشاركة */
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* شريط المراحل */}
      <div className="surface-card glass-panel p-4">
        <Stepper steps={steps} currentStep={currentStage} variant="default" />
      </div>

      {/* بطاقة التقدم */}
      <div className="surface-card glass-panel relative overflow-hidden p-6 text-center">
        <div className="mx-auto grid size-44 place-items-center rounded-full"
          style={{
            background: `conic-gradient(var(--gold) ${percent * 3.6}deg, color-mix(in oklab, var(--muted) 70%, transparent) 0deg)`,
          }}
        >
          <div className="grid size-36 place-items-center rounded-full bg-card">
            <span className="font-display text-3xl font-bold">{toArabicNumber(Math.round(percent))}٪</span>
            <span className="text-[11px] text-muted-foreground">من المصحف</span>
          </div>
        </div>
        <p className="mt-4 text-sm font-bold">
          {toArabicNumber(read)} آية من {toArabicNumber(TOTAL_AYAHS)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          آخر قراءة: سورة {surahName} — الآية {toArabicNumber(ayah)}
        </p>
        <div className="divider-geo my-4" />
        <div className="flex gap-2">
          <button
            onClick={download}
            disabled={busy}
            className="press gradient-gold flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-gold-foreground disabled:opacity-60"
          >
            <Download className="size-4" /> تنزيل البطاقة
          </button>
          <button
            onClick={share}
            className="press flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 text-sm font-bold"
          >
            <Share2 className="size-4" /> مشاركة
          </button>
        </div>
      </div>
      <p className="px-2 text-center text-[11px] text-muted-foreground">
        يتحدّث التقدّم تلقائيًا كلما قرأت أو استمعت إلى آية في المصحف.
      </p>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
