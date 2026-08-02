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

let audioContext: AudioContext | null = null;

export function playAlertSound(kind: AlertKind) {
  if (kind === "silent" || typeof window === "undefined") return;
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContext = audioContext ?? new Ctor();
    const ctx = audioContext;
    const now = ctx.currentTime;
    const notes = kind === "adhan" ? [392, 440, 523.25, 440, 392] : [660, 880];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + index * (kind === "adhan" ? 0.55 : 0.22);
      const dur = kind === "adhan" ? 0.5 : 0.18;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur + 0.05);
    });
  } catch {
    /* ignore */
  }
}