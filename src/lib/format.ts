import type { Lang, Unit } from "@/types";

const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function localizeDigits(value: string | number, lang: Lang): string {
  const str = String(value);
  if (lang !== "fa") return str;
  return str
    .replace(/[0-9]/g, (d) => faDigits[Number(d)])
    .replace(".", "\u066B");
}

export function celsiusToUnit(celsius: number, unit: Unit): number {
  return unit === "imperial"
    ? Math.round((celsius * 9) / 5 + 32)
    : Math.round(celsius);
}

export function kmhToUnit(kmh: number, unit: Unit): number {
  return unit === "imperial" ? Math.round(kmh * 0.621371) : Math.round(kmh);
}

export function unitSuffix(unit: Unit): string {
  return unit === "imperial" ? "°F" : "°C";
}

export function speedSuffix(unit: Unit): string {
  return unit === "imperial" ? "mph" : "km/h";
}

export function formatTemp(celsius: number, unit: Unit, lang: Lang): string {
  return `${localizeDigits(celsiusToUnit(celsius, unit), lang)}°`;
}

export function formatHour(iso: string, lang: Lang): string {
  const d = new Date(iso);
  const str = d.toLocaleTimeString(lang === "fa" ? "fa-IR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: lang === "en",
  });
  return str;
}

export function formatClock(iso: string, lang: Lang): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(lang === "fa" ? "fa-IR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatWeekday(iso: string, lang: Lang, index: number): string {
  if (index === 0) return lang === "fa" ? "امروز" : "Today";
  const d = new Date(iso);
  return d.toLocaleDateString(lang === "fa" ? "fa-IR" : "en-US", {
    weekday: "short",
  });
}

export function compassLabel(deg: number, lang: Lang): string {
  const dirsEn = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const dirsFa = [
    "شمال",
    "شمال‌شرق",
    "شرق",
    "جنوب‌شرق",
    "جنوب",
    "جنوب‌غرب",
    "غرب",
    "شمال‌غرب",
  ];
  const idx = Math.round(deg / 45) % 8;
  return lang === "fa" ? dirsFa[idx] : dirsEn[idx];
}

export function formatLongDate(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleDateString(lang === "fa" ? "fa-IR" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatDuration(ms: number, lang: Lang): string {
  const totalMinutes = Math.max(0, Math.round(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (lang === "fa")
    return `${localizeDigits(hours, lang)} ساعت و ${localizeDigits(minutes, lang)} دقیقه`;
  return `${hours}h ${minutes}m`;
}

export function formatVisibility(
  meters: number,
  unit: Unit,
  lang: Lang,
): string {
  const km = meters / 1000;
  const value = unit === "imperial" ? km * 0.621371 : km;
  const shown = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  const suffix = unit === "imperial" ? "mi" : lang === "fa" ? "کیلومتر" : "km";
  return `${localizeDigits(shown, lang)} ${suffix}`;
}

export function formatPrecip(mm: number, unit: Unit, lang: Lang): string {
  const shown =
    unit === "imperial"
      ? Math.round((mm / 25.4) * 100) / 100
      : Math.round(mm * 10) / 10;
  return `${localizeDigits(shown, lang)} ${unit === "imperial" ? "in" : "mm"}`;
}
