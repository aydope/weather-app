import type { Lang, Unit } from "@/types";

const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function localizeDigits(value: string | number, lang: Lang): string {
  const str = String(value);
  if (lang !== "fa") return str;
  return str.replace(/[0-9]/g, (d) => faDigits[Number(d)]);
}

export function celsiusToUnit(celsius: number, unit: Unit): number {
  return unit === "imperial" ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius);
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
  return d.toLocaleDateString(lang === "fa" ? "fa-IR" : "en-US", { weekday: "short" });
}

export function compassLabel(deg: number, lang: Lang): string {
  const dirsEn = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const dirsFa = ["شمال", "شمال‌شرق", "شرق", "جنوب‌شرق", "جنوب", "جنوب‌غرب", "غرب", "شمال‌غرب"];
  const idx = Math.round(deg / 45) % 8;
  return lang === "fa" ? dirsFa[idx] : dirsEn[idx];
}
