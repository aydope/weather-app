import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Header, type NavSection } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { SearchCommand } from "@/components/SearchCommand";
import { EmptyState } from "@/components/EmptyState";
import { Hero } from "@/components/Hero";
import { Briefing } from "@/components/Briefing";
import { HourlyStrip } from "@/components/HourlyStrip";
import { DailyForecast } from "@/components/DailyForecast";
import { AirQuality } from "@/components/AirQuality";
import { DetailsGrid } from "@/components/DetailsGrid";
import { SunMoon } from "@/components/SunMoon";
import { AmbientOrbs } from "@/components/AmbientOrbs";
import { ParticleLayer } from "@/components/ParticleLayer";
import { HeroSkeleton, StripSkeleton, ListSkeleton, GridSkeleton } from "@/components/Skeletons";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useActiveSection } from "@/lib/useActiveSection";
import { searchCities, fetchWeatherBundle } from "@/api/weather";
import { CURRENT_LOCATION_ID } from "@/lib/config";
import { buildInsights } from "@/lib/insights";
import { skyGradient, weatherMeta } from "@/lib/weatherMeta";
import type { GeoResult, Lang, Status, Unit, WeatherBundle } from "@/types";
import { t } from "@/i18n";

const MAX_RECENT = 8;

export default function App() {
  const [lang, setLang] = useLocalStorage<Lang>("aftab:lang", "fa");
  const [unit, setUnit] = useLocalStorage<Unit>("aftab:unit", "metric");
  const [recent, setRecent] = useLocalStorage<GeoResult[]>("aftab:recent", []);
  const [favorites, setFavorites] = useLocalStorage<GeoResult[]>("aftab:favorites", []);

  const [city, setCity] = useState<GeoResult | null>(null);
  const [bundle, setBundle] = useState<WeatherBundle | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState("errorGeneric");
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const restoredLastCity = useRef(false);

  useEffect(() => {
    document.documentElement.lang = lang === "fa" ? "fa" : "en";
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);

  const rememberCity = useCallback(
    (selected: GeoResult) => {
      setRecent((prev) => {
        const withoutDup = prev.filter((c) => c.id !== selected.id);
        return [selected, ...withoutDup].slice(0, MAX_RECENT);
      });
    },
    [setRecent]
  );

  const failWith = useCallback((key: string) => {
    setErrorKey(key);
    setStatus("error");
  }, []);

  const failNetwork = useCallback(() => {
    failWith(navigator.onLine ? "errorGeneric" : "errorOffline");
  }, [failWith]);

  const loadWeatherFor = useCallback(
    async (selected: GeoResult) => {
      setCity(selected);
      setRefreshFailed(false);
      setStatus("loading");
      try {
        const data = await fetchWeatherBundle(selected.latitude, selected.longitude);
        setBundle(data);
        setStatus("success");
        if (selected.id !== CURRENT_LOCATION_ID) rememberCity(selected);
      } catch {
        failNetwork();
      }
    },
    [rememberCity, failNetwork]
  );

  useEffect(() => {
    if (restoredLastCity.current) return;
    restoredLastCity.current = true;
    if (recent[0]) void loadWeatherFor(recent[0]);
  }, [recent, loadWeatherFor]);

  const handleManualSearch = useCallback(
    async (query: string) => {
      setLastQuery(query);
      setStatus("loading");
      try {
        const results = await searchCities(query, lang);
        if (results.length === 0) {
          failWith("errorNotFound");
          return;
        }
        await loadWeatherFor(results[0]);
      } catch {
        failNetwork();
      }
    },
    [lang, loadWeatherFor, failWith, failNetwork]
  );

  const handleLocate = useCallback(() => {
    setLastQuery(null);
    if (!navigator.geolocation) {
      failWith("errorLocation");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        void loadWeatherFor({
          id: CURRENT_LOCATION_ID,
          name: t(lang, "myLocation"),
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      (err) => failWith(err.code === err.PERMISSION_DENIED ? "errorLocationDenied" : "errorLocation"),
      { timeout: 10000 }
    );
  }, [lang, loadWeatherFor, failWith]);

  const toggleFavorite = useCallback(
    (target: GeoResult) => {
      setFavorites((prev) =>
        prev.some((c) => c.id === target.id) ? prev.filter((c) => c.id !== target.id) : [target, ...prev]
      );
    },
    [setFavorites]
  );

  const refresh = useCallback(async () => {
    if (!city || refreshing) return;
    setRefreshing(true);
    setRefreshFailed(false);
    try {
      setBundle(await fetchWeatherBundle(city.latitude, city.longitude));
    } catch {
      setRefreshFailed(true);
    } finally {
      setRefreshing(false);
    }
  }, [city, refreshing]);

  const retry = () => {
    if (errorKey === "errorLocation" || errorKey === "errorLocationDenied") handleLocate();
    else if (lastQuery) void handleManualSearch(lastQuery);
    else if (city) void loadWeatherFor(city);
  };

  const meta = bundle ? weatherMeta(bundle.current.weatherCode, lang) : null;
  const gradient = bundle
    ? skyGradient(meta!.group, bundle.current.isDay)
    : "from-[#0A0D18] via-[#10172C] to-[#1B1830]";

  const fontClass = lang === "fa" ? "font-fa" : "font-body";
  const displayFont = lang === "fa" ? "font-fa" : "font-display";

  const sections: NavSection[] =
    status === "success" && bundle
      ? [
          { id: "overview", labelKey: "navOverview", shortKey: "navShortOverview" },
          { id: "hourly", labelKey: "navHourly", shortKey: "navShortHourly" },
          { id: "forecast", labelKey: "navForecast", shortKey: "navShortForecast" },
          ...(bundle.air ? [{ id: "air", labelKey: "navAir", shortKey: "navShortAir" }] : []),
          { id: "details", labelKey: "navDetails", shortKey: "navShortDetails" },
          { id: "sun", labelKey: "navSun", shortKey: "navShortSun" },
        ]
      : [];

  const activeSection = useActiveSection(sections.map((s) => s.id));

  const stagger = (index: number) => ({ animationDelay: `${index * 80}ms` });

  return (
    <div className={`min-h-screen ${fontClass} text-paper relative overflow-x-clip`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-50 focus:rounded-full focus:bg-gold-soft focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ink"
      >
        {t(lang, "skipToContent")}
      </a>

      <div aria-hidden className="fixed inset-0 overflow-hidden bg-ink pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all duration-700`} />
        <AmbientOrbs group={meta?.group ?? "idle"} isDay={bundle?.current.isDay ?? true} />
        <ParticleLayer group={meta?.group ?? "clear"} />
        <div className="vignette absolute inset-0" />
        <div className="grain absolute inset-0" />
      </div>

      <Header
        lang={lang}
        unit={unit}
        fontClass={fontClass}
        displayFont={displayFont}
        sections={sections}
        active={activeSection}
        onLangChange={setLang}
        onUnitChange={setUnit}
      />

      <main id="main" tabIndex={-1} className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pt-8 sm:pt-12 outline-none">
        <p role="status" className="sr-only">
          {status === "loading" ? t(lang, "loadingWeather") : ""}
        </p>

        <SearchCommand
          lang={lang}
          fontClass={fontClass}
          recent={recent}
          favorites={favorites}
          activeCityId={city?.id}
          onSelectCity={loadWeatherFor}
          onManualSearch={handleManualSearch}
          onLocate={handleLocate}
        />

        {status === "idle" && (
          <EmptyState lang={lang} displayFont={displayFont} onPick={handleManualSearch} onLocate={handleLocate} />
        )}

        {status === "loading" && (
          <div aria-busy="true">
            <HeroSkeleton />
            <StripSkeleton />
            <ListSkeleton />
            <GridSkeleton />
          </div>
        )}

        {status === "error" && (
          <div role="alert" className="glass glass-danger rounded-[32px] px-6 py-10 text-center animate-rise-in">
            <p className="text-paper leading-7 max-w-md mx-auto">{t(lang, errorKey)}</p>
            {errorKey !== "errorNotFound" && (
              <Button variant="destructive" size="sm" className="mt-5" onClick={retry}>
                {t(lang, "retry")}
              </Button>
            )}
          </div>
        )}

        {status === "success" && bundle && city && (
          <>
            {refreshFailed && (
              <p role="alert" className="glass glass-danger rounded-2xl px-4 py-3 text-sm mb-4">
                {t(lang, "errorRefresh")}
              </p>
            )}
            <div className="animate-rise-in">
              <Hero
                lang={lang}
                unit={unit}
                displayFont={displayFont}
                city={city}
                weather={bundle.current}
                today={bundle.daily[0]}
                isFavorite={favorites.some((c) => c.id === city.id)}
                onToggleFavorite={() => toggleFavorite(city)}
                refreshing={refreshing}
                onRefresh={() => void refresh()}
              />
            </div>
            <div className="animate-rise-in" style={stagger(1)}>
              <Briefing
                lang={lang}
                displayFont={displayFont}
                insights={buildInsights(bundle.current, bundle.daily[0], bundle.hourly, bundle.air)}
              />
            </div>
            <div className="animate-rise-in" style={stagger(2)}>
              <HourlyStrip lang={lang} unit={unit} displayFont={displayFont} hours={bundle.hourly} />
            </div>
            <div className="animate-rise-in" style={stagger(3)}>
              <DailyForecast lang={lang} unit={unit} displayFont={displayFont} days={bundle.daily} />
            </div>
            {bundle.air && (
              <div className="animate-rise-in" style={stagger(4)}>
                <AirQuality lang={lang} displayFont={displayFont} air={bundle.air} />
              </div>
            )}
            <div className="animate-rise-in" style={stagger(5)}>
              <DetailsGrid
                lang={lang}
                unit={unit}
                displayFont={displayFont}
                weather={bundle.current}
                today={bundle.daily[0]}
              />
            </div>
            <div className="animate-rise-in" style={stagger(6)}>
              <SunMoon
                lang={lang}
                displayFont={displayFont}
                weather={bundle.current}
                today={bundle.daily[0]}
                tomorrow={bundle.daily[1]}
              />
            </div>
          </>
        )}
      </main>

      <Footer lang={lang} displayFont={displayFont} ready={status !== "loading"} />
      <MobileNav lang={lang} sections={sections} active={activeSection} />
    </div>
  );
}
