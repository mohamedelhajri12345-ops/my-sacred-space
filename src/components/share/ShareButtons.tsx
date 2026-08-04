import { Share2, Copy, Heart, Twitter, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { haptic } from "@/lib/haptics";

type ShareProps = {
  text: string;
  source?: string;
  title?: string;
};

/** نسخ النص إلى الحافظة */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // fallback للنسخ
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

/** مشاركة عبر Web Share API أو نسخ الرابط */
export async function shareContent(text: string, title?: string): Promise<void> {
  haptic("medium");

  // استخدام Web Share API إن كان متاحاً
  if (navigator.share && navigator.canShare) {
    try {
      const result = await navigator.share({
        title: title ?? "نور - تطبيق إسلامي",
        text: text,
      });
      return;
    } catch {
      // المستخدم ألغى المشاركة
      return;
    }
  }

  // نسخ النص كبديل
  const success = await copyToClipboard(text);
  if (success) {
    toast.success("تم نسخ النص! يمكنك لصقه في أي تطبيق");
  } else {
    toast.error("فشل نسخ النص");
  }
}

/** مشاركة على Twitter */
export function shareToTwitter(text: string, hashtags?: string[]): void {
  haptic("medium");
  const hashtagsStr = hashtags ? hashtags.map((h) => `#${h}`).join(" ") : "#نور #إسلامي #أذكار";
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtagsStr)}`;
  window.open(twitterUrl, "_blank", "width=550,height=420");
}

/** مشاركة على WhatsApp */
export function shareToWhatsApp(text: string): void {
  haptic("medium");
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, "_blank");
}

/** مشاركة على Telegram */
export function shareToTelegram(text: string): void {
  haptic("medium");
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(text)}`;
  window.open(telegramUrl, "_blank");
}

/** أزرار المشاركة */
export function ShareButtons({ text, source, title }: ShareProps) {
  const handleCopy = async () => {
    haptic("light");
    const fullText = source ? `${text}\n\nالمصدر: ${source}` : text;
    const success = await copyToClipboard(fullText);
    if (success) {
      toast.success("تم نسخ النص");
    } else {
      toast.error("فشل نسخ النص");
    }
  };

  const handleShare = () => {
    const shareText = source ? `${text}\n\n${source}` : text;
    void shareContent(shareText, title);
  };

  const handleTwitter = () => {
    const tweetText = source ? `${text}\n\n${source}` : text;
    shareToTwitter(tweetText);
  };

  const handleWhatsApp = () => {
    const shareText = source ? `${text}\n\n${source}` : text;
    shareToWhatsApp(shareText);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="نسخ"
      >
        <Copy className="size-4" />
      </button>

      <button
        onClick={handleShare}
        className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="مشاركة"
      >
        <Share2 className="size-4" />
      </button>

      <button
        onClick={handleTwitter}
        className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]"
        aria-label="مشاركة على تويتر"
      >
        <Twitter className="size-4" />
      </button>

      <button
        onClick={handleWhatsApp}
        className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-[#25D366]/10 hover:text-[#25D366]"
        aria-label="مشاركة على واتساب"
      >
        <MessageCircle className="size-4" />
      </button>
    </div>
  );
}

/** إضافة للمفضلة */
export function FavoriteButton({ text, onFavorite }: { text: string; onFavorite?: () => void }) {
  const handleFavorite = () => {
    haptic("medium");
    // يمكن إضافة منطق الحفظ للمفضلة هنا
    if (onFavorite) {
      onFavorite();
    }
    toast.success("تمت الإضافة إلى المفضلة");
  };

  return (
    <button
      onClick={handleFavorite}
      className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
      aria-label="إضافة للمفضلة"
    >
      <Heart className="size-4" />
    </button>
  );
}
