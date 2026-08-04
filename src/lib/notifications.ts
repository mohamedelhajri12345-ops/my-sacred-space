import type { AlertKind } from "./app-context";

export function notificationsSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return "unsupported" as const;
  const result = await Notification.requestPermission();
  return result;
}

export function showLocalNotification(title: string, body: string) {
  if (!notificationsSupported() || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/icons/icon-192.png", badge: "/icons/icon-192.png", tag: title });
  } catch {
    /* ignore */
  }
}

/**
 * تسجيل أذان حقيقي من المسجد الحرام (أرشيف عام على archive.org) مخزّن محليًا،
 * ومقطع قصير منه يُستخدم للتذكيرات الخفيفة. لا تُستخدم أي نغمات مُركّبة.
 */
export const ADHAN_FULL_SRC = "/audio/adhan.mp3";
export const ADHAN_SHORT_SRC = "/audio/adhan-short.mp3";

let alertAudio: HTMLAudioElement | null = null;

function getAlertAudio() {
  if (typeof window === "undefined") return null;
  alertAudio = alertAudio ?? new Audio();
  return alertAudio;
}

export function stopAlertSound() {
  if (!alertAudio) return;
  alertAudio.pause();
  alertAudio.currentTime = 0;
}

/** تشغيل صوت الأذان الحقيقي (كامل أو مقطع قصير) حسب نوع التنبيه. */
export function playAlertSound(kind: AlertKind) {
  if (kind === "silent") return;
  const audio = getAlertAudio();
  if (!audio) return;
  try {
    audio.pause();
    audio.src = kind === "adhan" ? ADHAN_FULL_SRC : ADHAN_SHORT_SRC;
    audio.currentTime = 0;
    audio.volume = 1;
    void audio.play().catch(() => undefined);
  } catch {
    /* ignore */
  }
}

/** معاينة الصوت من صفحة الإعدادات. */
export function previewAlertSound(kind: AlertKind) {
  playAlertSound(kind === "silent" ? "beep" : kind);
}