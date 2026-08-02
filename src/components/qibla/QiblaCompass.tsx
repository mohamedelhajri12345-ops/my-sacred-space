import { useEffect, useState } from "react";
import { Compass, Navigation, MapPin, RefreshCw } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { qiblaDirection } from "@/lib/prayer";
import { haptic } from "@/lib/haptics";

type OrientationEventWithHeading = DeviceOrientationEvent & { webkitCompassHeading?: number };

export function QiblaCompass() {
  const { coords, requestLocation, locating } = useApp();
  const [heading, setHeading] = useState<number | null>(null);
  const [granted, setGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qibla = qiblaDirection(coords);
  const rotation = heading === null ? qibla : qibla - heading;
  const aligned = heading !== null && Math.abs(((rotation % 360) + 540) % 360 - 360) < 6;

  useEffect(() => {
    if (!granted) return;
    const handler = (event: Event) => {
      const e = event as OrientationEventWithHeading;
      const value =
        typeof e.webkitCompassHeading === "number"
          ? e.webkitCompassHeading
          : e.alpha !== null && e.alpha !== undefined
            ? 360 - e.alpha
            : null;
      if (value !== null) setHeading(value);
    };
    window.addEventListener("deviceorientationabsolute", handler, true);
    window.addEventListener("deviceorientation", handler, true);
    return () => {
      window.removeEventListener("deviceorientationabsolute", handler, true);
      window.removeEventListener("deviceorientation", handler, true);
    };
  }, [granted]);

  useEffect(() => {
    if (aligned) haptic("success");
  }, [aligned]);

  const enableSensor = async () => {
    haptic("medium");
    const anyOrientation = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<PermissionState>;
    };
    try {
      if (typeof anyOrientation.requestPermission === "function") {
        const state = await anyOrientation.requestPermission();
        if (state !== "granted") {
          setError("لم يتم منح إذن استخدام حساس الاتجاه");
          return;
        }
      }
      setGranted(true);
      setError(null);
    } catch {
      setError("جهازك لا يدعم حساس الاتجاه، استخدم الزاوية المعروضة يدويًا");
    }
  };

  return (
    <div className="space-y-4">
      <div className="surface-card flex items-center justify-between p-4">
        <span className="flex items-center gap-2 text-sm">
          <MapPin className="size-4 text-accent" /> {coords.label ?? "موقع محفوظ"}
        </span>
        <button
          onClick={requestLocation}
          className="press flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs"
        >
          <RefreshCw className={locating ? "size-3.5 animate-spin" : "size-3.5"} /> تحديث الموقع
        </button>
      </div>

      <div className="surface-card flex flex-col items-center gap-5 p-6">
        <div className="relative flex size-72 items-center justify-center rounded-full gradient-night text-[oklch(0.95_0.02_84)]">
          <div
            className="absolute inset-3 rounded-full border border-[oklch(0.78_0.12_82)]/25 transition-transform duration-200"
            style={{ transform: `rotate(${heading === null ? 0 : -heading}deg)` }}
          >
            {["ش", "ق", "ج", "غ"].map((dir, i) => (
              <span
                key={dir}
                className="absolute left-1/2 -translate-x-1/2 text-xs opacity-70"
                style={{
                  transform: `rotate(${i * 90}deg) translateY(0)`,
                  transformOrigin: "50% 8.25rem",
                  top: "0.5rem",
                }}
              >
                {dir}
              </span>
            ))}
          </div>
          <div
            className="absolute inset-0 flex items-start justify-center transition-transform duration-200"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div className="mt-6 flex flex-col items-center">
              <Navigation
                className={
                  aligned
                    ? "size-12 text-[oklch(0.85_0.14_85)] drop-shadow-[0_0_12px_oklch(0.8_0.14_85)]"
                    : "size-12 text-[oklch(0.78_0.12_82)]"
                }
              />
              <span className="mt-1 text-[10px] opacity-80">القبلة</span>
            </div>
          </div>
          <div className="text-center">
            <p dir="ltr" className="text-4xl font-bold tabular-nums">
              {Math.round(qibla)}°
            </p>
            <p className="text-[11px] opacity-75">من الشمال</p>
          </div>
        </div>

        {!granted ? (
          <button
            onClick={enableSensor}
            className="press flex items-center gap-2 rounded-full gradient-gold px-5 py-2.5 text-sm font-bold text-gold-foreground"
          >
            <Compass className="size-4" /> تفعيل البوصلة
          </button>
        ) : (
          <p className="text-xs text-muted-foreground">
            {aligned ? "أنت الآن باتجاه القبلة ✅" : "أدر جهازك حتى يشير السهم للأعلى"}
          </p>
        )}
        {error && <p className="text-center text-xs text-destructive">{error}</p>}
        <p className="text-center text-[11px] text-muted-foreground">
          ضع الجهاز أفقيًا بعيدًا عن المعادن للحصول على قراءة دقيقة.
        </p>
      </div>
    </div>
  );
}