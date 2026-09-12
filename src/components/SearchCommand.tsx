import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { searchCities } from "@/api/weather";
import type { GeoResult, Lang } from "@/types";
import { t } from "@/i18n";

interface SearchCommandProps {
  lang: Lang;
  fontClass: string;
  recent: GeoResult[];
  activeCityId?: number;
  onSelectCity: (city: GeoResult) => void;
  onManualSearch: (query: string) => void;
}

export function SearchCommand({
  lang,
  fontClass,
  recent,
  activeCityId,
  onSelectCity,
  onManualSearch,
}: SearchCommandProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      try {
        const results = await searchCities(query.trim());
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      }
    }, 320);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city: GeoResult) => {
    setShowSuggestions(false);
    setQuery("");
    setSuggestions([]);
    onSelectCity(city);
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    setShowSuggestions(false);
    onManualSearch(query.trim());
  };

  return (
    <div ref={containerRef} className="mb-6 sm:mb-8">
      <div className="relative">
        <div className="flex gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
                if (e.key === "Escape") setShowSuggestions(false);
              }}
              placeholder={t(lang, "searchPlaceholder")}
              aria-label={t(lang, "searchAria")}
              className={fontClass}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute mt-2 w-full rounded-2xl bg-ink-raised/95 border border-line backdrop-blur-md overflow-hidden shadow-2xl z-20 animate-pop-in">
                {suggestions.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => handleSelect(s)}
                      className="w-full text-start px-5 py-3 hover:bg-white/[0.07] transition-colors flex items-baseline justify-between gap-3"
                    >
                      <span className="text-paper">{s.name}</span>
                      <span className="text-mist text-xs">
                        {[s.admin1, s.country].filter(Boolean).join(", ")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Button onClick={handleSubmit} className="shrink-0">
            {t(lang, "searchButton")}
          </Button>
        </div>
      </div>

      {recent.length > 0 && (
        <div className="flex items-center gap-2 mt-3 overflow-x-auto scroll-quiet pb-1">
          <span className="text-xs text-mist shrink-0">{t(lang, "recentLabel")}</span>
          {recent.map((c) => (
            <Chip key={c.id} active={c.id === activeCityId} onClick={() => onSelectCity(c)}>
              {c.name}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
