type Pattern = "light" | "medium" | "heavy" | "success" | "warn" | "selection" | "tap";

const PATTERNS: Record<Pattern, number | number[]> = {
  light: 10,
  medium: 22,
  heavy: 45,
  success: [12, 40, 24],
  warn: [30, 60, 30],
  selection: 5,
  tap: 8,
};

/**
 * تنفيذ اهتزاز لمسية
 */
export function haptic(pattern: Pattern = "light") {
  if (typeof navigator === "undefined") return;
  if (typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(PATTERNS[pattern]);
  } catch {
    /* ignore */
  }
}

/**
 * اهتزاز مخصص
 */
export function hapticCustom(pattern: number | number[]) {
  if (typeof navigator === "undefined") return;
  if (typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}

/**
 * إيقاف الاهتزاز
 */
export function hapticStop() {
  if (typeof navigator === "undefined") return;
  if (typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(0);
  } catch {
    /* ignore */
  }
}

/**
 * التحقق من دعم الاهتزاز
 */
export function hapticsSupported() {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}