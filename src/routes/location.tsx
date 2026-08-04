import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, Star, MapPin, Check, Trash2, Globe } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/lib/app-context";
import { COUNTRIES, getAllCities, searchCities, cityToCoords, type City } from "@/lib/cities";
import { PRAYER_LABELS } from "@/lib/prayer";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/lib/use-local-storage";

export const Route = createFileRoute("/location")({
  head: () => ({
    meta: [
      { title: "اختيار الموقع — نور" },
      { name: "description", content: "اختر مدينتك لحساب مواقيت الصلاة بدقة" },
    ],
  }),
  component: LocationPage,
});

/** نوع الموقع المحفوظ */
type SavedLocation = {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  method: string;
  label: string;
};

export function LocationPage() {
  const navigate = useNavigate();
  const { setCoords, setPlace, updateSettings } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [savedLocations, setSavedLocations] = useLocalStorage<SavedLocation[]>("islamic:savedLocations", []);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // البحث في المدن
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return searchCities(searchQuery).slice(0, 20);
  }, [searchQuery]);

  // المدن في الدولة المختارة
  const citiesInCountry = useMemo(() => {
    if (!selectedCountry) return [];
    const country = COUNTRIES.find((c) => c.code === selectedCountry);
    return country?.cities ?? [];
  }, [selectedCountry]);

  /** اختيار مدينة وتعيينها كموقع فعلي */
  const selectCity = (city: City) => {
    haptic("medium");
    const coords = cityToCoords(city);
    setCoords({
      latitude: city.latitude,
      longitude: city.longitude,
      label: `${city.name}، ${city.country}`,
    });
    setPlace({
      city: city.name,
      country: city.country,
      countryCode: city.countryCode,
    });
    updateSettings({ method: city.method, autoMethod: false });
    toast.success(`تم تحديد ${city.name}، ${city.country}`);
    void navigate({ to: "/" });
  };

  /** حفظ الموقع كمفضلة */
  const saveLocation = (city: City) => {
    haptic("light");
    const exists = savedLocations.some(
      (loc) => loc.latitude === city.latitude && loc.longitude === city.longitude
    );
    if (exists) {
      toast.info("هذا الموقع محفوظ مسبقاً");
      return;
    }

    const newLocation: SavedLocation = {
      id: crypto.randomUUID(),
      city: city.name,
      country: city.country,
      countryCode: city.countryCode,
      latitude: city.latitude,
      longitude: city.longitude,
      method: city.method,
      label: `${city.name}، ${city.country}`,
    };

    setSavedLocations((prev) => [newLocation, ...prev]);
    toast.success("تم حفظ الموقع");
  };

  /** حذف موقع محفوظ */
  const deleteLocation = (id: string) => {
    haptic("light");
    setSavedLocations((prev) => prev.filter((loc) => loc.id !== id));
    toast.success("تم حذف الموقع");
  };

  /** اختيار موقع محفوظ */
  const selectSavedLocation = (location: SavedLocation) => {
    haptic("medium");
    setCoords({
      latitude: location.latitude,
      longitude: location.longitude,
      label: location.label,
    });
    setPlace({
      city: location.city,
      country: location.country,
      countryCode: location.countryCode,
    });
    updateSettings({ method: location.method as "UmmAlQura", autoMethod: false });
    toast.success(`تم التبديل إلى ${location.label}`);
    void navigate({ to: "/" });
  };

  return (
    <AppShell title="اختيار الموقع" subtitle="حدد مدينتك لمواقيت الصلاة">
      <div className="space-y-5 pb-24">
        {/* البحث */}
        <div className="surface-card p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مدينة أو دولة…"
              className="w-full rounded-xl border border-input bg-card pr-10 pl-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              dir="rtl"
            />
          </div>

          {/* نتائج البحث */}
          {searchResults.length > 0 && (
            <div className="mt-3 max-h-64 overflow-y-auto space-y-1">
              {searchResults.map((city) => (
                <button
                  key={`${city.name}-${city.countryCode}`}
                  onClick={() => selectCity(city)}
                  className="flex w-full items-center justify-between rounded-xl bg-secondary/50 px-3 py-2.5 text-right text-sm transition-colors hover:bg-secondary"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span>
                      {city.name}، {city.country}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveLocation(city);
                    }}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
                  >
                    <Star className="size-4" />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* المواقع المحفوظة */}
        {savedLocations.length > 0 && (
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 px-1 text-sm font-bold">
              <Star className="size-4 text-gold" />
              المواقع المحفوظة
            </h2>
            <div className="space-y-2">
              {savedLocations.map((location) => (
                <div
                  key={location.id}
                  className="surface-card flex items-center justify-between p-4"
                >
                  <button
                    onClick={() => selectSavedLocation(location)}
                    className="flex flex-1 items-center gap-3 text-right"
                  >
                    <div className="flex size-10 items-center justify-center rounded-xl bg-secondary">
                      <MapPin className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{location.label}</p>
                      <p className="text-xs text-muted-foreground">طريقة: {location.method}</p>
                    </div>
                  </button>
                  <button
                    onClick={() => deleteLocation(location.id)}
                    className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* الدول */}
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 px-1 text-sm font-bold">
            <Globe className="size-4 text-primary" />
            الدول والمدن
          </h2>

          {selectedCountry ? (
            <div className="space-y-3">
              <button
                onClick={() => {
                  haptic("light");
                  setSelectedCountry(null);
                }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <span>←</span> العودة للدول
              </button>

              <div className="surface-card overflow-hidden">
                {citiesInCountry.map((city, index) => (
                  <button
                    key={city.name}
                    onClick={() => selectCity(city)}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-3.5 text-right text-sm transition-colors",
                      index < citiesInCountry.length - 1 && "border-b border-border"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span>{city.name}</span>
                      {city.name === "مكة المكرمة" && (
                        <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-medium text-gold">
                          المسجد الحرام
                        </span>
                      )}
                    </div>
                    <Check className="size-4 text-primary" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  onClick={() => {
                    haptic("light");
                    setSelectedCountry(country.code);
                  }}
                  className="surface-card p-3 text-right text-sm transition-transform active:scale-95"
                >
                  <p className="font-medium leading-relaxed">{country.name}</p>
                  <p className="text-xs text-muted-foreground">{country.cities.length} مدن</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* معلومات */}
        <div className="rounded-2xl border border-border bg-card/50 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            يتم حساب مواقيت الصلاة تلقائياً بناءً على موقعك المحدد.
            <br />
            يمكنك حفظ عدة مواقع للسفر بينها بسهولة.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
