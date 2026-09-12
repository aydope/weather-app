import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { SearchCommand } from "@/components/SearchCommand";
import { Hero } from "@/components/Hero";
import { HourlyStrip } from "@/components/HourlyStrip";
import { DailyForecast } from "@/components/DailyForecast";
import { DetailsGrid } from "@/components/DetailsGrid";
import { ParticleLayer } from "@/components/ParticleLayer";
import { HeroSkeleton, StripSkeleton, ListSkeleton, GridSkeleton } from "@/components/Skeletons";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { searchCities, fetchWeatherBundle } from "@/api/weather";
import { skyGradient, weatherMeta } from "@/lib/weatherMeta";
import type { GeoResult, Lang, Status, Unit, WeatherBundle } from "@/types";
import { t } from "@/i18n";

const MAX_RECENT = 6;

export default function App() {
  const [lang, setLang] = useLocalStorage<Lang>("aftab:lang", "fa");
  const [unit, setUnit] = useLocalStorage<Unit>("aftab:unit", "metric");
  const [recent, setRecent] = useLocalStorage<GeoResult[]>("aftab:recent", []);

  const [city, setCity] = useState<GeoResult | null>(null);
  const [bundle, setBundle] = useState<WeatherBundle | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState("errorGeneric");
  const [lastQuery, setLastQuery] = useState<string | null>(null);

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

  const loadWeatherFor = useCallback(
    async (selected: GeoResult) => {
      setCity(selected);
      setStatus("loading");
      try {
        const data = await fetchWeatherBundle(selected.latitude, selected.longitude);
        setBundle(data);
        setStatus("success");
        rememberCity(selected);
      } catch {
        setErrorKey("errorGeneric");
        setStatus("error");
      }
    },
    [rememberCity]
  );

  const handleManualSearch = useCallback(
    async (query: string) => {
      setLastQuery(query);
      setStatus("loading");
      try {
        const results = await searchCities(query);
        if (results.length === 0) {
          setErrorKey("errorNotFound");
          setStatus("error");
          return;
        }
        await loadWeatherFor(results[0]);
      } catch {
        setErrorKey("errorGeneric");
        setStatus("error");
      }
    },
    [loadWeatherFor]
  );

  const retry = () => {
    if (lastQuery) handleManualSearch(lastQuery);
    else if (city) loadWeatherFor(city);
  };

  const meta = bundle ? weatherMeta(bundle.current.weatherCode, lang) : null;
  const gradient = bundle
    ? skyGradient(meta!.group, bundle.current.isDay)
    : "from-[#0C1122] via-[#141F3C] to-[#1F2E52]";

  const fontClass = lang === "fa" ? "font-fa" : "font-body";
  const displayFont = lang === "fa" ? "font-fa" : "font-display";

  return (
    <div className={`min-h-screen bg-ink ${fontClass} text-paper relative overflow-hidden`}>
      {/* ambient backdrop */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 transition-all duration-700`} />
      <ParticleLayer group={meta?.group ?? "clear"} />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-14">
        <Header
          lang={lang}
          unit={unit}
          fontClass={fontClass}
          displayFont={displayFont}
          onLangChange={setLang}
          onUnitChange={setUnit}
        />

        <SearchCommand
          lang={lang}
          fontClass={fontClass}
          recent={recent}
          activeCityId={city?.id}
          onSelectCity={loadWeatherFor}
          onManualSearch={handleManualSearch}
        />

        {status === "idle" && (
          <div className="rounded-[28px] border border-line bg-white/[0.035] px-6 py-14 text-center animate-rise-in">
            <p className={`${displayFont} text-lg sm:text-xl mb-2`}>{t(lang, "emptyTitle")}</p>
            <p className="text-mist text-sm sm:text-base">{t(lang, "emptyBody")}</p>
          </div>
        )}

        {status === "loading" && (
          <>
            <HeroSkeleton />
            <StripSkeleton />
            <ListSkeleton />
            <GridSkeleton />
          </>
        )}

        {status === "error" && (
          <div className="rounded-[28px] border border-coral/40 bg-coral/[0.07] px-6 py-10 text-center animate-rise-in">
            <p className="text-paper mb-4">{t(lang, errorKey)}</p>
            <Button variant="destructive" size="sm" onClick={retry}>
              {t(lang, "retry")}
            </Button>
          </div>
        )}

        {status === "success" && bundle && city && (
          <div className="animate-rise-in">
            <Hero
              lang={lang}
              unit={unit}
              displayFont={displayFont}
              city={city}
              weather={bundle.current}
              today={bundle.daily[0]}
              tomorrow={bundle.daily[1]}
            />
            <HourlyStrip lang={lang} unit={unit} displayFont={displayFont} hours={bundle.hourly} />
            <DailyForecast lang={lang} unit={unit} displayFont={displayFont} days={bundle.daily} />
            <DetailsGrid
              lang={lang}
              unit={unit}
              displayFont={displayFont}
              weather={bundle.current}
              today={bundle.daily[0]}
            />
          </div>
        )}

        <footer className="mt-10 sm:mt-14 text-center text-xs text-mist">{t(lang, "footerNote")}</footer>
      </div>
    </div>
  );
}
