import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocalStorage } from "./use-local-storage";
import { DEFAULT_COORDS, type Coords, type MethodKey, type PrayerKey } from "./prayer";
import { methodForCountry, reverseGeocode, type PlaceInfo } from "./geo";

export type AlertKind = "silent" | "beep" | "adhan";

/** تعديلات مواقيت الصلاة بالدقائق (سالب للتقديم، موجب للتأخير) */
export type PrayerAdjustments = Partial<Record<PrayerKey, number>>;

export type Settings = {
  theme: "light" | "dark" | "reading";
  method: MethodKey;
  autoMethod: boolean;
  notificationsEnabled: boolean;
  alertKind: AlertKind;
  reminderMinutes: number;
  wuduReminder: boolean;
  wuduMinutes: number;
  qiyamReminder: boolean;
  fastingReminder: boolean;
  khushuMode: boolean;
  khushuMinutes: number;
  reciter: string;
  fontScale: number;
  showTranslation: boolean;
  animatedBackground: boolean;
  /** تفعيل/إيقاف كل صلاة على حدة */
  enabledPrayers: Record<PrayerKey, boolean>;
  /** تعديلات مخصصة لكل صلاة بالدقائق */
  prayerAdjustments: PrayerAdjustments;
  /** تفعيل التوقيت الصيفي تلقائيًا */
  autoDst: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  theme: "light",
  method: "UmmAlQura",
  autoMethod: true,
  notificationsEnabled: false,
  alertKind: "beep",
  reminderMinutes: 10,
  wuduReminder: true,
  wuduMinutes: 10,
  qiyamReminder: false,
  fastingReminder: false,
  khushuMode: true,
  khushuMinutes: 20,
  reciter: "ar.alafasy",
  fontScale: 1,
  showTranslation: false,
  animatedBackground: true,
  enabledPrayers: {
    fajr: true,
    sunrise: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  },
  prayerAdjustments: {},
  autoDst: true,
};

export type Streak = { count: number; lastDay: string; totalSessions: number };

type AppContextValue = {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  coords: Coords;
  setCoords: (c: Coords) => void;
  place: PlaceInfo | null;
  setPlace: (p: PlaceInfo | null) => void;
  locating: boolean;
  locationError: string | null;
  requestLocation: () => Promise<void>;
  streak: Streak;
  markThikrSession: () => void;
  online: boolean;
  /** تعديل وقت صلاة واحدة */
  adjustPrayer: (key: PrayerKey, minutes: number) => void;
  /** إعادة تعيين التعديلات للافتراضي */
  resetPrayerAdjustments: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function todayKey() {
  return new Date().toDateString();
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>("islamic:settings", DEFAULT_SETTINGS);
  const [coords, setCoordsState] = useLocalStorage<Coords>("islamic:coords", DEFAULT_COORDS);
  const [place, setPlace] = useLocalStorage<PlaceInfo | null>("islamic:place", null);
  const [streak, setStreak] = useLocalStorage<Streak>("islamic:streak", {
    count: 0,
    lastDay: "",
    totalSessions: 0,
  });
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", settings.theme === "dark" || settings.theme === "reading");
    root.classList.toggle("reading-mode", settings.theme === "reading");
    root.style.setProperty("--app-font-scale", String(settings.fontScale));
  }, [settings.theme, settings.fontScale]);

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => setSettings((prev) => ({ ...prev, ...patch })),
    [setSettings],
  );

  const setCoords = useCallback((c: Coords) => setCoordsState(c), [setCoordsState]);

  const adjustPrayer = useCallback((key: PrayerKey, minutes: number) => {
    setSettings((prev) => ({
      ...prev,
      prayerAdjustments: {
        ...prev.prayerAdjustments,
        [key]: minutes,
      },
    }));
  }, [setSettings]);

  const resetPrayerAdjustments = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      prayerAdjustments: {},
    }));
  }, [setSettings]);

  const requestLocation = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationError("جهازك لا يدعم تحديد الموقع، يمكنك اختيار المدينة يدويًا من الإعدادات");
      return;
    }
    setLocating(true);
    setLocationError(null);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 600000,
        }),
      );
      const { latitude, longitude } = pos.coords;
      const info = await reverseGeocode(latitude, longitude);
      const label = info?.city
        ? info.country
          ? `${info.city}، ${info.country}`
          : info.city
        : "موقعي الحالي";
      setCoordsState({ latitude, longitude, label });
      setPlace(info);
      const suggested = methodForCountry(info?.countryCode);
      if (suggested) {
        setSettings((prev) => (prev.autoMethod ? { ...prev, method: suggested } : prev));
      }
    } catch {
      setLocationError("لم نتمكن من قراءة موقعك، سنستخدم آخر موقع محفوظ ويمكنك التغيير يدويًا");
    } finally {
      setLocating(false);
    }
  }, [setCoordsState, setPlace, setSettings]);

  const markThikrSession = useCallback(() => {
    const today = todayKey();
    setStreak((prev) => {
      if (prev.lastDay === today) return { ...prev, totalSessions: prev.totalSessions + 1 };
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      return {
        count: prev.lastDay === yesterday ? prev.count + 1 : 1,
        lastDay: today,
        totalSessions: prev.totalSessions + 1,
      };
    });
  }, [setStreak]);

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
      coords,
      setCoords,
      place,
      setPlace,
      locating,
      locationError,
      requestLocation,
      streak,
      markThikrSession,
      online,
      adjustPrayer,
      resetPrayerAdjustments,
    }),
    [settings, updateSettings, coords, setCoords, place, setPlace, locating, locationError, requestLocation, streak, markThikrSession, online, adjustPrayer, resetPrayerAdjustments],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}