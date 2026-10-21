import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icons";
import { searchCities } from "@/api/weather";
import { localizeDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { GeoResult, Lang } from "@/types";
import { t } from "@/i18n";

interface SearchCommandProps {
  lang: Lang;
  fontClass: string;
  recent: GeoResult[];
  favorites: GeoResult[];
  activeCityId?: number;
  onSelectCity: (city: GeoResult) => void;
  onManualSearch: (query: string) => void;
  onLocate: () => void;
}

export function SearchCommand({
  lang,
  fontClass,
  recent,
  favorites,
  activeCityId,
  onSelectCity,
  onManualSearch,
  onLocate,
}: SearchCommandProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [searchDone, setSearchDone] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const debounceRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    setSearchDone(false);
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      try {
        setSuggestions(await searchCities(query.trim(), lang));
        setHighlighted(-1);
      } catch {
        setSuggestions([]);
      }
      setSearchDone(true);
    }, 320);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query, lang]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function focusOnSlash(e: KeyboardEvent) {
      const el = document.activeElement;
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", focusOnSlash);
    return () => window.removeEventListener("keydown", focusOnSlash);
  }, []);

  const handleSelect = (city: GeoResult) => {
    setShowSuggestions(false);
    setQuery("");
    setSuggestions([]);
    setHighlighted(-1);
    onSelectCity(city);
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    setShowSuggestions(false);
    onManualSearch(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setShowSuggestions(true);
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (showSuggestions && highlighted >= 0 && suggestions[highlighted]) handleSelect(suggestions[highlighted]);
      else handleSubmit();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const hasQuery = query.trim().length >= 2;
  const menuOpen = showSuggestions && (suggestions.length > 0 || (searchDone && hasQuery));
  const favoriteIds = new Set(favorites.map((c) => c.id));
  const recentOnly = recent.filter((c) => !favoriteIds.has(c.id));

  let announcement = "";
  if (suggestions.length > 0) announcement = `${localizeDigits(suggestions.length, lang)} ${t(lang, "resultsLabel")}`;
  else if (searchDone && hasQuery) announcement = t(lang, "noResults");

  return (
    <div ref={containerRef} className="mb-8 sm:mb-10">
      <div className="relative">
        <div className="glass-input flex h-14 items-center gap-1.5 rounded-full ps-4 pe-1.5 sm:ps-5 sm:gap-2">
          <Icon name="search" className="hidden sm:block w-5 h-5 shrink-0 text-gold" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={menuOpen}
            aria-controls="city-suggestions"
            aria-autocomplete="list"
            aria-activedescendant={highlighted >= 0 ? `city-option-${highlighted}` : undefined}
            autoComplete="off"
            enterKeyHint="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={t(lang, "searchPlaceholder")}
            aria-label={t(lang, "searchAria")}
            className={cn(
              fontClass,
              "h-full min-w-0 flex-1 border-0 bg-transparent text-paper placeholder:text-mist outline-none"
            )}
          />

          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                inputRef.current?.focus();
              }}
              aria-label={t(lang, "clearSearch")}
              title={t(lang, "clearSearch")}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-mist transition-colors hover:bg-white/10 hover:text-paper"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden md:grid h-6 w-6 shrink-0 place-items-center rounded-md border border-white/15 bg-white/5 text-xs text-mist">
              /
            </kbd>
          )}

          <button
            type="button"
            onClick={onLocate}
            aria-label={t(lang, "locate")}
            title={t(lang, "locate")}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-gold transition-colors hover:bg-gold/15"
          >
            <Icon name="locate" className="w-5 h-5" />
          </button>
          <span className="h-6 w-px shrink-0 bg-white/15" />
          <Button
            onClick={handleSubmit}
            aria-label={t(lang, "searchButton")}
            className="h-11 w-11 shrink-0 rounded-full px-0 sm:w-auto sm:px-6"
          >
            <Icon name="search" className="w-5 h-5 sm:hidden" />
            <span className="hidden sm:inline">{t(lang, "searchButton")}</span>
          </Button>
        </div>

        {menuOpen && (
          <ul
            id="city-suggestions"
            role="listbox"
            aria-label={t(lang, "searchAria")}
            className="glass-menu absolute mt-2 w-full rounded-3xl overflow-hidden z-20 animate-pop-in p-1.5"
          >
            {suggestions.length === 0 ? (
              <li role="presentation" className="px-4 py-4 text-sm text-mist">
                {t(lang, "noResults")}
              </li>
            ) : (
              suggestions.map((s, i) => (
                <li key={s.id} id={`city-option-${i}`} role="option" aria-selected={i === highlighted}>
                  <button
                    tabIndex={-1}
                    onClick={() => handleSelect(s)}
                    onMouseEnter={() => setHighlighted(i)}
                    className={cn(
                      "w-full text-start px-4 py-3 rounded-2xl transition-colors flex items-center justify-between gap-3",
                      i === highlighted ? "bg-gold/15" : "hover:bg-white/10"
                    )}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <Icon name="pin" className="w-4 h-4 shrink-0 text-gold" />
                      <span className="text-paper truncate">{s.name}</span>
                    </span>
                    <span className="text-mist text-xs truncate">
                      {[s.admin1, s.country].filter(Boolean).join(", ")}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
        <p role="status" className="sr-only">
          {announcement}
        </p>
      </div>

      {(favorites.length > 0 || recentOnly.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {favorites.length > 0 && (
            <>
              <span className="text-xs text-mist me-1">{t(lang, "savedLabel")}</span>
              {favorites.map((c) => (
                <Chip key={c.id} active={c.id === activeCityId} onClick={() => onSelectCity(c)}>
                  <Icon name="star" filled className="w-3.5 h-3.5 text-gold" />
                  {c.name}
                </Chip>
              ))}
            </>
          )}
          {recentOnly.length > 0 && (
            <>
              <span className={cn("text-xs text-mist me-1", favorites.length > 0 && "ms-3")}>
                {t(lang, "recentLabel")}
              </span>
              {recentOnly.map((c) => (
                <Chip key={c.id} active={c.id === activeCityId} onClick={() => onSelectCity(c)}>
                  {c.name}
                </Chip>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
