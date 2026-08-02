type Pattern = "light" | "medium" | "heavy" | "success" | "warn";

const PATTERNS: Record<Pattern, number | number[]> = {
  light: 10,
  medium: 22,
  heavy: 45,
  success: [12, 40, 24],
  warn: [30, 60, 30],
};

export function haptic(pattern: Pattern = "light") {
  if (typeof navigator === "undefined") return;
  if (typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(PATTERNS[pattern]);
  } catch {
    /* ignore */
  }
}