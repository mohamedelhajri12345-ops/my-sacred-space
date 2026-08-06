import type { AlertKind } from "./app-context";

export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!notificationsSupported()) return "unsupported";
  const result = await Notification.requestPermission();
  return result;
}

/**
 * إظهار إشعار مع دعم الإشعارات التفاعلية
 */
export function showLocalNotification(
  title: string, 
  body: string, 
  options?: {
    tag?: string;
    requireInteraction?: boolean;
    silent?: boolean;
    icon?: string;
    badge?: string;
    data?: Record<string, unknown>;
  }
): Notification | undefined {
  if (!notificationsSupported() || Notification.permission !== "granted") return undefined;
  
  try {
    const notificationOptions: NotificationOptions = {
      body,
      icon: options?.icon || "/icons/icon-192.png",
      badge: options?.badge || "/icons/icon-192.png",
      tag: options?.tag || title,
      requireInteraction: options?.requireInteraction ?? false,
      silent: options?.silent ?? true,
      data: options?.data,
      dir: "rtl",
      lang: "ar",
    };

    const notification = new Notification(title, notificationOptions);

    // إغلاق الإشعار تلقائياً بعد 10 ثوان إذا لم يتطلب تفاعل
    if (!options?.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 10000);
    }

    // معالجة النقر على الإشعار
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  } catch {
    return undefined;
  }
}

/**
 * إظهار إشعار الصلاة (مُحسّن للإشعارات التفاعلية)
 */
export function showPrayerNotification(
  prayerName: string,
  message: string,
  type: 'adhan' | 'reminder' | 'wudu'
): Notification | undefined {
  const icons: Record<string, string> = {
    adhan: "📢",
    reminder: "⏰",
    wudu: "💧"
  };

  return showLocalNotification(
    `${icons[type]} ${prayerName}`,
    message,
    {
      tag: `prayer-${prayerName}`,
      requireInteraction: type === 'adhan',
      data: { type, prayer: prayerName }
    }
  );
}

/**
 * إظهار إشعار تشغيل الموسيقى
 */
export function showMusicNotification(
  title: string,
  artist: string,
  isPlaying: boolean
): void {
  if (!notificationsSupported() || Notification.permission !== "granted") return;
  
  try {
    if (isPlaying && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist,
        album: "المكتبة الإسلامية",
        artwork: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      });
    } else if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = null;
    }
  } catch {
    /* ignore */
  }
}

/**
 * إعداد Media Session API للتحكم في المشغل من الشاشة الرئيسية
 */
export function setupMediaSession(
  onPlay: () => void,
  onPause: () => void,
  onNext: () => void,
  onPrevious: () => void
): void {
  if (typeof navigator === "undefined" || !('mediaSession' in navigator)) return;

  try {
    navigator.mediaSession.setActionHandler('play', onPlay);
    navigator.mediaSession.setActionHandler('pause', onPause);
    navigator.mediaSession.setActionHandler('nexttrack', onNext);
    navigator.mediaSession.setActionHandler('previoustrack', onPrevious);
  } catch {
    /* ignore */
  }
}

/**
 * تحديث حالة المشغل في Media Session
 */
export function updateMediaSessionState(state: 'playing' | 'paused' | 'none'): void {
  if (typeof navigator === "undefined" || !('mediaSession' in navigator)) return;
  
  try {
    navigator.mediaSession.playbackState = state;
  } catch {
    /* ignore */
  }
}

/**
 * تسجيل Service Worker للإشعارات في الخلفية
 */
export async function registerForPushNotifications(): Promise<void> {
  if (typeof navigator === "undefined" || !('serviceWorker' in navigator)) return;
  if (!notificationsSupported() || Notification.permission !== "granted") return;

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // إضافة مستمع للـ push event في Service Worker
    if ('addEventListener' in registration) {
      // @ts-expect-error - PushEvent types
      registration.addEventListener('push', (event: PushEvent) => {
        if (!event.data) return;
        
        try {
          const data = event.data.json();
          showLocalNotification(data.title || "إشعار", data.body || "", {
            tag: data.tag || 'push',
            requireInteraction: data.requireInteraction ?? false,
            data: data.data
          });
          
          if (data.playSound && data.soundType) {
            playAlertSound(data.soundType);
          }
        } catch {
          showLocalNotification("إشعار جديد", event.data.text());
        }
      });

      // @ts-expect-error - NotificationEvent types
      registration.addEventListener('notificationclick', (event: NotificationEvent) => {
        event.notification.close();
        
        const url = (event.notification.data as { url?: string })?.url || '/';
        
        event.waitUntil(
          // @ts-expect-error - clients is available in service worker context
          self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList: WindowClient[]) => {
            for (const client of clientList) {
              if (client.url === url && 'focus' in client) {
                return client.focus();
              }
            }
            // @ts-expect-error - clients is available in service worker context
            return self.clients.openWindow(url);
          })
        );
      });
    }
  } catch {
    /* ignore */
  }
}

/**
 * تسجيل أذان حقيقي من المسجد الحرام مخزّن محليًا
 */
export const ADHAN_FULL_SRC = "/audio/adhan.mp3";
export const ADHAN_SHORT_SRC = "/audio/adhan-short.mp3";

let alertAudio: HTMLAudioElement | null = null;

function getAlertAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  alertAudio = alertAudio ?? new Audio();
  return alertAudio;
}

export function stopAlertSound(): void {
  if (!alertAudio) return;
  alertAudio.pause();
  alertAudio.currentTime = 0;
}

/** تشغيل صوت الأذان الحقيقي (كامل أو مقطع قصير) حسب نوع التنبيه. */
export function playAlertSound(kind: AlertKind): void {
  if (kind === "silent") return;
  const audio = getAlertAudio();
  if (!audio) return;
  try {
    audio.pause();
    audio.src = kind === "adhan" ? ADHAN_FULL_SRC : ADHAN_SHORT_SRC;
    audio.currentTime = 0;
    audio.volume = 1;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // التشغيل التلقائي قد لا يعمل بدون تفاعل المستخدم
      });
    }
  } catch {
    /* ignore */
  }
}

/** معاينة الصوت من صفحة الإعدادات. */
export function previewAlertSound(kind: AlertKind): void {
  playAlertSound(kind === "silent" ? "beep" : kind);
}
/** جدولة إشعارات الصلاة داخل الـ Service Worker لتعمل والتطبيق مغلق أو الشاشة مقفلة. */
export async function schedulePrayersInServiceWorker(
  prayers: { label: string; date: Date }[],
  reminderMinutes: number,
): Promise<void> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  if (!notificationsSupported() || Notification.permission !== "granted") return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const now = Date.now();
    for (const p of prayers) {
      if (!p.date || p.date.getTime() <= now) continue;
      reg.active?.postMessage({
        type: "SCHEDULE_PRAYER_NOTIFICATION",
        prayerName: p.label,
        prayerTime: p.date.toISOString(),
        reminderMinutes,
      });
    }
  } catch {
    /* ignore */
  }
}
